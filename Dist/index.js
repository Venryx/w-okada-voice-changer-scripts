// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"2IaxQ":[function(require,module,exports) {
var _myStartupTweaksJs = require("./MyStartupTweaks.js");
var _addDirectFileConvertButtonsJs = require("./AddDirectFileConvertButtons.js");
var _launcherJs = require("./Launcher.js");

},{"./MyStartupTweaks.js":"dcnev","./AddDirectFileConvertButtons.js":"dVd8y","./Launcher.js":"766Dn"}],"dcnev":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ApplyMyStartupTweaks", ()=>ApplyMyStartupTweaks);
var _appSpecificJs = require("./Utils/AppSpecific.js");
var _generalJs = require("./Utils/General.js");
async function SetRVCQuality(quality) {
    console.log("Setting RVC quality to:", quality);
    await fetch("/update_settings", {
        method: "POST",
        mode: "cors",
        headers: {
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryuhTAAoBfkhLFQciO",
            "cache-control": "no-cache",
            pragma: "no-cache"
        },
        body: [
            `------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data;`,
            ` name="key"\r\n\r\nrvcQuality\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data;`,
            ` name="val"\r\n\r\n${quality}\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO--\r\n`
        ].join("")
    });
    // this part doesn't actually change quality-setting, but makes ui match with the quality-setting set by fetch above
    const rvcQualitySelectEl = (0, _generalJs.FindHTMLElementsMatching)(".advanced-setting-container-row-title").find((a)=>a.innerText == "RVC Quality")?.nextSibling?.childNodes[0];
    rvcQualitySelectEl.selectedIndex = 1;
}
function Setup() {
    (0, _generalJs.FindHTMLElementsMatching)(".model-slot-sort-button, .model-slot-sort-button-active")[1].click();
    if (document.querySelector("#style1") == null) {
        const style1 = document.createElement("style");
        style1.id = "style1";
        document.body.appendChild(style1);
    }
    document.querySelector("#style1").innerHTML = `
	  .main-body { padding: 1rem !important; }
	  .character-area { padding: 10px !important; }
	  .config-area { padding: 10px !important; }
	  .model-slot-tiles-container { max-height: 32rem !important; }
	`;
    // on init, set RVC quality to High
    SetRVCQuality(1);
    // also, set RVC quality to High again, whenever the voice is changed
    (0, _generalJs.FindHTMLElementsMatching)(".model-slot-tiles-container")[0].onclick = async (e)=>{
        const oldVoice = (0, _appSpecificJs.GetCurrentVoiceName)();
        const target = e.target;
        const clickedOnVoice = !target.className.includes("model-slot-tiles-container"); // if we didn't click directly on background, we must have clicked on a voice
        if (clickedOnVoice) for(let i = 0; i < 10; i++){
            await (0, _generalJs.SleepAsync)(1000);
            // once ui has updated to show the new voice (ie. after the voice is actually loaded by backend), we can set the quality to High again
            if ((0, _appSpecificJs.GetCurrentVoiceName)() != oldVoice) {
                SetRVCQuality(1);
                break;
            }
        }
    };
}
function ApplyMyStartupTweaks() {
    Setup();
    // temp; let user type+enter "t" in console to reapply the startup tweaks (needed for some tweaks, eg. rvc-quality that gets reset on changing the voice)
    Object.defineProperty(window, "t", {
        configurable: true,
        get () {
            ApplyMyStartupTweaks();
        }
    });
    console.log("Applied startup tweaks.");
}

},{"./Utils/General.js":"adrA1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"adrA1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FindHTMLElementsMatching", ()=>FindHTMLElementsMatching);
parcelHelpers.export(exports, "FindElementsMatching", ()=>FindElementsMatching);
parcelHelpers.export(exports, "SleepAsync", ()=>SleepAsync);
/** If the dialog is closed/canceled, the promise will just never resolve. */ parcelHelpers.export(exports, "StartUpload", ()=>StartUpload);
function FindHTMLElementsMatching(selector) {
    return FindElementsMatching(selector);
}
function FindElementsMatching(selector) {
    return Array.from(document.querySelectorAll(selector));
}
function SleepAsync(timeMS) {
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, timeMS);
    });
}
function StartUpload() {
    return new Promise((resolve, reject)=>{
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.style.display = "none";
        fileInput.onchange = (e)=>{
            var file = fileInput.files[0];
            if (file) resolve(file);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"dVd8y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "AddButton_ConvertFreshFile", ()=>AddButton_ConvertFreshFile);
parcelHelpers.export(exports, "AddButton_ConvertLoadedFile", ()=>AddButton_ConvertLoadedFile);
var _generalJs = require("./Utils/General.js");
var _appSpecificJs = require("./Utils/AppSpecific.js");
var _arraysJs = require("./Utils/Arrays.js");
async function DecodeFileToAudioBuffer(file) {
    const audioCtx = new AudioContext({
        sampleRate: 48000
    });
    const decodedData = await audioCtx.decodeAudioData(await file.arrayBuffer());
    audioCtx.close();
    return decodedData;
}
function DownloadFloat32ArrayAsWAV(data, fileName = "output.wav") {
    const writeString = (view, offset, string)=>{
        for(var i = 0; i < string.length; i++)view.setUint8(offset + i, string.charCodeAt(i));
    };
    const buffer = new ArrayBuffer(44 + data.length * 2);
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
    view.setUint32(28, 96000, true); // データ速度
    view.setUint16(32, 2, true); // ブロックサイズ
    view.setUint16(34, 16, true); // サンプルあたりのビット数
    writeString(view, 36, "data"); // dataチャンク
    view.setUint32(40, data.length * 2, true); // 波形データのバイト数
    (0, _arraysJs.FloatTo16BitPCM)(view, 44, data); // 波形データ
    const audioBlob = new Blob([
        view
    ], {
        type: "audio/wav"
    });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
async function Convert(fileBlob, flushStartWithXChunks = 1) {
    const startTime = Date.now();
    // We actually use the user-supplied "extra size" setting here rather than the "chunk size".
    // The "extra size" seems to match more with what we're doing: sending pre-recorded data. (rather than live-streaming audio, whose latency is what chunk-size is focused on)
    const chunkSize = (0, _appSpecificJs.GetExtraSizeInBytes)(); //GetChunkSizeInBytes();
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
        audioBufferAsF32Array = (0, _arraysJs.FlattenFloat32Arrays)([
            flushChunk,
            audioBufferAsF32Array
        ]); // make space
    }
    const audioBufferAsInt16PCMArrayBuffer = (0, _arraysJs.Float32ArrayToInt16Array)(audioBufferAsF32Array);
    const f32DataSubarrays = [];
    for(let i = 0; i < audioBufferAsInt16PCMArrayBuffer.byteLength; i += chunkSize){
        const audioBufferRawAsBase64Str = (0, _arraysJs.ArrayBufferToBase64)(audioBufferAsInt16PCMArrayBuffer.slice(i, i + chunkSize));
        const requestBody = JSON.stringify({
            timestamp: Date.now(),
            buffer: audioBufferRawAsBase64Str
        });
        const resp = await fetch("/test", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: requestBody
        });
        const responseData = await resp.json();
        console.log("ResponseData:", responseData);
        const isFlushChunk = i < flushLengthInInt16Array;
        if (!isFlushChunk) {
            const changedVoiceBase64 = responseData.changedVoiceBase64;
            const ab = (0, _arraysJs.Base64ToArrayBuffer)(changedVoiceBase64);
            const f32Data = (0, _arraysJs.Int16ArrayToFloat32Array)(new Int16Array(ab));
            f32DataSubarrays.push(f32Data);
        }
    }
    const f32Data_combinedArray = (0, _arraysJs.FlattenFloat32Arrays)(f32DataSubarrays);
    let fileName = "output.wav";
    if (fileBlob instanceof File) {
        const lastDotIndex = fileBlob.name.lastIndexOf(".");
        const [fileName_noExt, ext] = lastDotIndex == -1 ? [
            fileBlob.name,
            ""
        ] : [
            fileBlob.name.slice(0, lastDotIndex),
            fileBlob.name.slice(lastDotIndex + 1)
        ];
        fileName = `${fileName_noExt}.wav`;
    }
    DownloadFloat32ArrayAsWAV(f32Data_combinedArray, fileName);
    console.log("Done in:", Date.now() - startTime);
}
function AddButton_ConvertFreshFile() {
    const button = document.createElement("button");
    button.classList.add("v-added");
    button.innerText = "Convert fresh file";
    button.onclick = async ()=>{
        // help user out by stopping regular voice-conversion processes, if active
        (0, _appSpecificJs.StopRegularVoiceConversion)();
        (0, _appSpecificJs.StopAudioInputFilePlayback)();
        const file = await (0, _generalJs.StartUpload)();
        Convert(file);
    };
    const container = (0, _appSpecificJs.GetRecordButtonsContainer)();
    container.appendChild(button);
}
function AddButton_ConvertLoadedFile() {
    const button = document.createElement("button");
    button.classList.add("v-added");
    button.innerText = "Convert loaded file";
    button.onclick = async ()=>{
        // help user out by stopping regular voice-conversion processes, if active
        (0, _appSpecificJs.StopRegularVoiceConversion)();
        (0, _appSpecificJs.StopAudioInputFilePlayback)();
        const loadedFileDataURI = document.querySelector("#audio-test-converted").src;
        const loadedFileAsBlob = await (await fetch(loadedFileDataURI)).blob();
        Convert(loadedFileAsBlob);
    };
    const container = (0, _appSpecificJs.GetRecordButtonsContainer)();
    container.appendChild(button);
}

},{"./Utils/General.js":"adrA1","./Utils/AppSpecific.js":"2fzJN","./Utils/Arrays.js":"bxuO0","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2fzJN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// app state
// ==========
// these are of course extremely hacky; just use them for exploration/experimentation
parcelHelpers.export(exports, "GetAppState", ()=>GetAppState);
parcelHelpers.export(exports, "GetAppActions", ()=>GetAppActions);
// ui reading
// ==========
parcelHelpers.export(exports, "GetCurrentVoiceName", ()=>GetCurrentVoiceName);
parcelHelpers.export(exports, "GetChunkSizeInBytes", ()=>GetChunkSizeInBytes);
parcelHelpers.export(exports, "GetExtraSizeInBytes", ()=>GetExtraSizeInBytes);
parcelHelpers.export(exports, "GetRecordButtonsContainer", ()=>GetRecordButtonsContainer);
parcelHelpers.export(exports, "GetVoiceConversionButtonsContainer", ()=>GetVoiceConversionButtonsContainer);
// ui actions
// ==========
parcelHelpers.export(exports, "StopRegularVoiceConversion", ()=>StopRegularVoiceConversion);
parcelHelpers.export(exports, "StopAudioInputFilePlayback", ()=>StopAudioInputFilePlayback);
var _generalJs = require("./General.js");
function GetAppState() {
    const portraitAreaFiber = Object.entries(document.querySelector(".portrait-area") ?? []).find((a)=>a[0].includes("__reactFiber$"))?.[1];
    const appState = portraitAreaFiber?.return?.dependencies.firstContext.memoizedValue;
    return appState;
}
function GetAppActions() {
    const portraitAreaFiber = Object.entries(document.querySelector(".portrait-area") ?? []).find((a)=>a[0].includes("__reactFiber$"))?.[1];
    const actions = portraitAreaFiber?.return?.dependencies.firstContext.next.memoizedValue;
    return actions;
}
function GetCurrentVoiceName() {
    const voiceNameEl = (0, _generalJs.FindHTMLElementsMatching)(".character-area-text")[0];
    return voiceNameEl?.innerText;
}
function GetChunkSizeInBytes() {
    const chunkSelectEl = (0, _generalJs.FindHTMLElementsMatching)(".config-sub-area-control-title").find((a)=>a.innerText == "CHUNK:")?.nextSibling?.childNodes[0];
    const chunkSelectInfo = chunkSelectEl.childNodes[chunkSelectEl.selectedIndex]["innerText"];
    const chunkSizeInBytes = Number(chunkSelectInfo.match(/, ([0-9]+)\)/)[1]);
    return chunkSizeInBytes;
}
function GetExtraSizeInBytes() {
    const extraSelectEl = (0, _generalJs.FindHTMLElementsMatching)(".config-sub-area-control-title").find((a)=>a.innerText == "EXTRA:")?.nextSibling?.childNodes[0];
    const extraSelectInfo = extraSelectEl.childNodes[extraSelectEl.selectedIndex]["innerText"];
    const extraSizeInBytes = Number(extraSelectInfo);
    return extraSizeInBytes;
}
function GetRecordButtonsContainer() {
    const controlAreaTitles = (0, _generalJs.FindHTMLElementsMatching)(".config-sub-area-control-title");
    return controlAreaTitles.find((a)=>a.innerText == "REC.")?.nextSibling?.childNodes[0];
}
function GetVoiceConversionButtonsContainer() {
    const passthroughButton = (0, _generalJs.FindHTMLElementsMatching)(".character-area-control-passthru-button-stanby, .character-area-control-passthru-button-active")[0];
    return passthroughButton.parentElement;
}
function StopRegularVoiceConversion() {
    const stopConversionButton = GetVoiceConversionButtonsContainer().childNodes[1];
    stopConversionButton.click();
}
function StopAudioInputFilePlayback() {
    const audioInputFileEl = document.querySelector("#audio-test-converted");
    if (audioInputFileEl == null) return;
    audioInputFileEl.pause();
}

},{"./General.js":"adrA1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bxuO0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ArrayBufferToBase64", ()=>ArrayBufferToBase64);
parcelHelpers.export(exports, "Base64ToArrayBuffer", ()=>Base64ToArrayBuffer);
parcelHelpers.export(exports, "FloatTo16BitPCM", ()=>FloatTo16BitPCM);
parcelHelpers.export(exports, "Float32ArrayToInt16Array", ()=>Float32ArrayToInt16Array);
parcelHelpers.export(exports, "Int16ArrayToFloat32Array", ()=>Int16ArrayToFloat32Array);
parcelHelpers.export(exports, "FlattenFloat32Arrays", ()=>FlattenFloat32Arrays);
function ArrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for(var i = 0; i < len; i++)binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
}
function Base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for(var i = 0; i < len; i++)bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}
function FloatTo16BitPCM(output, offset, input) {
    for(var i = 0; i < input.length; i++, offset += 2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}
function Float32ArrayToInt16Array(data, offset = 0) {
    const buffer = new ArrayBuffer(offset + data.length * 2);
    const view = new DataView(buffer);
    FloatTo16BitPCM(view, offset, data); // 波形データ
    return buffer;
}
function Int16ArrayToFloat32Array(i16Data) {
    const f32Data = new Float32Array(i16Data.length);
    i16Data.forEach((x, i)=>{
        const float = x >= 0x8000 ? -(0x10000 - x) / 0x8000 : x / 0x7fff;
        f32Data[i] = float;
    });
    return f32Data;
}
function FlattenFloat32Arrays(chunks) {
    const nFrames = chunks.reduce((acc, elem)=>acc + elem.length, 0);
    const result = new Float32Array(nFrames);
    let currentFrame = 0;
    for (const chunk of chunks){
        result.set(chunk, currentFrame);
        currentFrame += chunk.length;
    }
    return result;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"766Dn":[function(require,module,exports) {
var _addDirectFileConvertButtonsJs = require("./AddDirectFileConvertButtons.js");
var _myStartupTweaksJs = require("./MyStartupTweaks.js");
var _generalJs = require("./Utils/General.js");
// clear the parcel cache each time our code runs, so that user can keep re-applying modified versions of this code without refreshing the page
function ClearParcelCache() {
    Object.keys(window).filter((k)=>k.startsWith("parcelRequire")).forEach((k)=>delete window[k]);
}
ClearParcelCache();
function ClearModificationsFromLastRun() {
    for (const el of (0, _generalJs.FindHTMLElementsMatching)(".v-added"))el.remove();
}
// clear ui modifications from last run
ClearModificationsFromLastRun();
// comment lines here to leave only the behavior you want
(0, _myStartupTweaksJs.ApplyMyStartupTweaks)();
(0, _addDirectFileConvertButtonsJs.AddButton_ConvertFreshFile)();
(0, _addDirectFileConvertButtonsJs.AddButton_ConvertLoadedFile)();
console.log("Finished applying modifications.");

},{"./AddDirectFileConvertButtons.js":"dVd8y","./MyStartupTweaks.js":"dcnev","./Utils/General.js":"adrA1"}]},["2IaxQ"], "2IaxQ", "parcelRequirebaf6")

//# sourceMappingURL=index.js.map
