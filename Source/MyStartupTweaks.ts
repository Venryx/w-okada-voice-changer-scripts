import {FindHTMLElementsMatching} from "./Utils/General.js";

function Setup() {
	FindHTMLElementsMatching(".model-slot-sort-button, .model-slot-sort-button-active")[1].click();
	if (document.querySelector("#style1") == null) {
		const style1 = document.createElement("style");
		style1.id = "style1";
		document.body.appendChild(style1);
	}
	document.querySelector("#style1")!.innerHTML = `
	  .main-body { padding: 1rem !important; }
	  .character-area { padding: 10px !important; }
	  .config-area { padding: 10px !important; }
	  .model-slot-tiles-container { max-height: 32rem !important; }
	`;

	fetch("http://localhost:18888/update_settings", {
		method: "POST", mode: "cors",
		headers: {
			"content-type": "multipart/form-data; boundary=----WebKitFormBoundaryuhTAAoBfkhLFQciO",
			"cache-control": "no-cache", pragma: "no-cache",
		},
		body: "------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data; name=\"key\"\r\n\r\nrvcQuality\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data; name=\"val\"\r\n\r\n1\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO--\r\n",
	});
	// this part doesn't actually change quality-setting, but makes ui match with the quality-setting set by fetch above
	const rvcQualitySelectEl = FindHTMLElementsMatching(".advanced-setting-container-row-title").find(a=>a.innerText == "RVC Quality")?.nextSibling?.childNodes[0] as HTMLSelectElement;
	rvcQualitySelectEl.selectedIndex = 1;
}

/*function PlayInputAndRecordToFile() {
	const chunkSelectEl = FindHTMLElementsMatching(".config-sub-area-control-title").find(a=>a.innerText == "CHUNK:")?.nextSibling?.childNodes[0] as HTMLSelectElement;
	const chunkSelectInfo = (chunkSelectEl.childNodes[chunkSelectEl.selectedIndex] as HTMLOptionElement).innerText;
	const chunkDelay = Number(chunkSelectInfo.match(/([0-9.]+) ms/)![1]);
	console.log("ChunkDelay:", chunkDelay);

	const audioInputFileEl = document.querySelector("#audio-test-converted") as HTMLAudioElement;
	const buttons = FindHTMLElementsMatching(".config-sub-area-button, .config-sub-area-button-active");
	const startRecordButton = buttons[1];
	const stopRecordButton = buttons[2];

	audioInputFileEl.currentTime = 0;
	audioInputFileEl.play();
	setTimeout(()=>startRecordButton.click(), chunkDelay);
	audioInputFileEl.onended = ()=>{
		audioInputFileEl.onended = null;
		setTimeout(()=>stopRecordButton.click(), chunkDelay);
	};
}*/

export function ApplyMyStartupTweaks() {
	Setup();
	//setTimeout(()=>PlayInputAndRecordToFile(), 2000);

	// temp; let user type+enter "t" in console to reapply the startup tweaks (needed for some tweaks, eg. rvc-quality that gets reset on changing the voice)
	Object.defineProperty(window, "t", {
		configurable: true, // defaults to false
		get() {
			ApplyMyStartupTweaks();
		},
	});

	console.log("Applied startup tweaks.");
}