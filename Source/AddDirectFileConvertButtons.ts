import {FindHTMLElementsMatching, StartUpload} from "./Utils/General.js";
import {GetExtraSizeInBytes, GetRecordButtonsContainer, GetVoiceConversionButtonsContainer, StopAudioInputFilePlayback, StopRegularVoiceConversion} from "./Utils/AppSpecific.js";
import {ArrayBufferToBase64, Base64ToArrayBuffer, FlattenFloat32Arrays, Float32ArrayToInt16Array, FloatTo16BitPCM, Int16ArrayToFloat32Array} from "./Utils/Arrays.js";

async function DecodeFileToAudioBuffer(file) {
	const audioCtx = new AudioContext({sampleRate: 48000});
	const decodedData = await audioCtx.decodeAudioData(await file.arrayBuffer());
	audioCtx.close();
	return decodedData;
}

function DownloadFloat32ArrayAsWAV(data) {
	const writeString = (view, offset, string)=>{
		for (var i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	};

	const buffer = new ArrayBuffer(44 + (data.length * 2));
	const view = new DataView(buffer);

	// https://www.youfit.co.jp/archives/1418
	writeString(view, 0, "RIFF"); // RIFFヘッダ
	view.setUint32(4, 32 + data.length * 2, true); // これ以降のファイルサイズ
	writeString(view, 8, "WAVE"); // WAVEヘッダ
	writeString(view, 12, "fmt "); // fmtチャンク
	view.setUint32(16, 16, true); // fmtチャンクのバイト数
	view.setUint16(20, 1, true); // フォーマットID
	view.setUint16(22, 1, true); // チャンネル数
	view.setUint32(24, 48000, true); // サンプリングレート
	view.setUint32(28, 48000 * 2, true); // データ速度
	view.setUint16(32, 2, true); // ブロックサイズ
	view.setUint16(34, 16, true); // サンプルあたりのビット数
	writeString(view, 36, "data"); // dataチャンク
	view.setUint32(40, data.length * 2, true); // 波形データのバイト数
	FloatTo16BitPCM(view, 44, data); // 波形データ
	const audioBlob = new Blob([view], {type: "audio/wav"});

	const url = URL.createObjectURL(audioBlob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `output.wav`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

async function Convert(fileBlob: Blob, flushStartWithXChunks = 1) {
	const startTime = Date.now();

	// We actually use the user-supplied "extra size" setting here rather than the "chunk size".
	// The "extra size" seems to match more with what we're doing: sending pre-recorded data. (rather than live-streaming audio, whose latency is what chunk-size is focused on)
	const chunkSize = GetExtraSizeInBytes(); //GetChunkSizeInBytes();
	const flushLengthInInt16Array = flushStartWithXChunks * chunkSize;
	const flushLengthInF32Array = flushLengthInInt16Array / 2; // f32 arrays are twice as "dense" as int16 arrays, so need half as many slots to hold the same amount of data
	console.log("ChunkSize[extra]:", chunkSize, "@flushLength:", flushLengthInInt16Array);

	const audioBuffer = await DecodeFileToAudioBuffer(fileBlob);
	let audioBufferAsF32Array = audioBuffer.getChannelData(0);

	// If the last chunk sent to the backend had noise at the end, it would normally "bleed" into the start of this conversion's chunks.
	// We avoid that, by "flushing" the converter backend with X chunks of silence, before sending the actual data. (we trim these "flush chunks" off at end)
	// Note that we apply this process early (on the f32-array, pre-conversion to i16-array), since it's easier to conceptualize (ie. silence is just a sequence of zeroes).
	if (flushLengthInInt16Array > 0) {
		const flushChunk = new Float32Array(flushLengthInF32Array);
		flushChunk.fill(0); // in this flush chunk, just fill it with zeroes (meaning silence)
		audioBufferAsF32Array = FlattenFloat32Arrays([flushChunk, audioBufferAsF32Array]); // make space
	}

	const audioBufferAsInt16PCMArrayBuffer = Float32ArrayToInt16Array(audioBufferAsF32Array);

	const f32DataSubarrays = [] as Float32Array[];
	for (let i = 0; i < audioBufferAsInt16PCMArrayBuffer.byteLength; i += chunkSize) {
		const audioBufferRawAsBase64Str = ArrayBufferToBase64(audioBufferAsInt16PCMArrayBuffer.slice(i, i + chunkSize));

		const requestBody = JSON.stringify({
			timestamp: Date.now(),
			buffer: audioBufferRawAsBase64Str,
		});
		const resp = await fetch("http://127.0.0.1:18888/test", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: requestBody,
		});
		const responseData = await resp.json();
		console.log("ResponseData:", responseData);

		const isFlushChunk = i < flushLengthInInt16Array;
		if (!isFlushChunk) {
			const changedVoiceBase64 = responseData.changedVoiceBase64;
			const ab = Base64ToArrayBuffer(changedVoiceBase64);

			const f32Data = Int16ArrayToFloat32Array(new Int16Array(ab));
			f32DataSubarrays.push(f32Data);
		}
	}
	const f32Data_combinedArray = FlattenFloat32Arrays(f32DataSubarrays);

	DownloadFloat32ArrayAsWAV(f32Data_combinedArray);
	console.log("Done in:", Date.now() - startTime);
}

export function AddButton_ConvertFreshFile() {
	const button = document.createElement("button");
	button.classList.add("v-added");
	button.innerText = "Convert fresh file";
	button.onclick = async()=>{
		// help user out by stopping regular voice-conversion processes, if active
		StopRegularVoiceConversion();
		StopAudioInputFilePlayback();

		const file = await StartUpload();
		Convert(file);
	};
	const container = GetRecordButtonsContainer();
	container.appendChild(button);
}
export function AddButton_ConvertLoadedFile() {
	const button = document.createElement("button");
	button.classList.add("v-added");
	button.innerText = "Convert loaded file";
	button.onclick = async()=>{
		// help user out by stopping regular voice-conversion processes, if active
		StopRegularVoiceConversion();
		StopAudioInputFilePlayback();

		const loadedFileDataURI = (document.querySelector("#audio-test-converted") as HTMLAudioElement).src;
		const loadedFileAsBlob = await (await fetch(loadedFileDataURI)).blob();
		Convert(loadedFileAsBlob);
	};
	const container = GetRecordButtonsContainer();
	container.appendChild(button);
}