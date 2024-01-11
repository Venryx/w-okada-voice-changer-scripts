import {GetAppState, GetCurrentVoiceName} from "./Utils/AppSpecific.js";
import {FindHTMLElementsMatching, SleepAsync} from "./Utils/General.js";

async function SetRVCQuality(quality: 0 | 1) {
	console.log("Setting RVC quality to:", quality);
	await fetch("http://localhost:18888/update_settings", {
		method: "POST", mode: "cors",
		headers: {
			"content-type": "multipart/form-data; boundary=----WebKitFormBoundaryuhTAAoBfkhLFQciO",
			"cache-control": "no-cache", pragma: "no-cache",
		},
		body: [
			`------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data;`,
			` name="key"\r\n\r\nrvcQuality\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO\r\nContent-Disposition: form-data;`,
			` name="val"\r\n\r\n${quality}\r\n------WebKitFormBoundaryuhTAAoBfkhLFQciO--\r\n`,
		].join(""),
	});
	// this part doesn't actually change quality-setting, but makes ui match with the quality-setting set by fetch above
	const rvcQualitySelectEl = FindHTMLElementsMatching(".advanced-setting-container-row-title").find(a=>a.innerText == "RVC Quality")?.nextSibling?.childNodes[0] as HTMLSelectElement;
	rvcQualitySelectEl.selectedIndex = 1;
}

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

	// on init, set RVC quality to High
	SetRVCQuality(1);

	// also, set RVC quality to High again, whenever the voice is changed
	FindHTMLElementsMatching(".model-slot-tiles-container")[0].onclick = async e=>{
		const oldVoice = GetCurrentVoiceName();

		const target = e.target as HTMLElement;
		const clickedOnVoice = !target.className.includes("model-slot-tiles-container"); // if we didn't click directly on background, we must have clicked on a voice
		if (clickedOnVoice) {
			for (let i = 0; i < 10; i++) {
				await SleepAsync(1000);
				// once ui has updated to show the new voice (ie. after the voice is actually loaded by backend), we can set the quality to High again
				if (GetCurrentVoiceName() != oldVoice) {
					SetRVCQuality(1);
					break;
				}
			}
		}
	};
}

export function ApplyMyStartupTweaks() {
	Setup();

	// temp; let user type+enter "t" in console to reapply the startup tweaks (needed for some tweaks, eg. rvc-quality that gets reset on changing the voice)
	Object.defineProperty(window, "t", {
		configurable: true, // defaults to false
		get() {
			ApplyMyStartupTweaks();
		},
	});

	console.log("Applied startup tweaks.");
}