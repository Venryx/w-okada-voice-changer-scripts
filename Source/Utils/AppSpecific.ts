import {FindHTMLElementsMatching} from "./General.js";

// app state
// ==========

// these are of course extremely hacky; just use them for exploration/experimentation
export function GetAppState() {
	const portraitAreaFiber = Object.entries(document.querySelector(".portrait-area") ?? []).find(a=>a[0].includes("__reactFiber$"))?.[1];
	const appState = portraitAreaFiber?.return?.dependencies.firstContext.memoizedValue;
	return appState;
}
export function GetAppActions() {
	const portraitAreaFiber = Object.entries(document.querySelector(".portrait-area") ?? []).find(a=>a[0].includes("__reactFiber$"))?.[1];
	const actions = portraitAreaFiber?.return?.dependencies.firstContext.next.memoizedValue;
	return actions;
}

// ui reading
// ==========

export function GetChunkSizeInBytes() {
	const chunkSelectEl = FindHTMLElementsMatching(".config-sub-area-control-title").find(a=>a.innerText == "CHUNK:")?.nextSibling?.childNodes[0] as HTMLSelectElement;
	const chunkSelectInfo = chunkSelectEl.childNodes[chunkSelectEl.selectedIndex]["innerText"];
	const chunkSizeInBytes = Number(chunkSelectInfo.match(/, ([0-9]+)\)/)[1]);
	return chunkSizeInBytes;
}
export function GetExtraSizeInBytes() {
	const extraSelectEl = FindHTMLElementsMatching(".config-sub-area-control-title").find(a=>a.innerText == "EXTRA:")?.nextSibling?.childNodes[0] as HTMLSelectElement;
	const extraSelectInfo = extraSelectEl.childNodes[extraSelectEl.selectedIndex]["innerText"];
	const extraSizeInBytes = Number(extraSelectInfo);
	return extraSizeInBytes;
}

export function GetRecordButtonsContainer() {
	const controlAreaTitles = FindHTMLElementsMatching(".config-sub-area-control-title");
	return controlAreaTitles.find(a=>a.innerText == "REC.")?.nextSibling?.childNodes[0] as HTMLElement;
}
export function GetVoiceConversionButtonsContainer() {
	const passthroughButton = FindHTMLElementsMatching(".character-area-control-passthru-button-stanby, .character-area-control-passthru-button-active")[0];
	return passthroughButton!.parentElement!;
}

// ui actions
// ==========

export function StopRegularVoiceConversion() {
	const stopConversionButton = GetVoiceConversionButtonsContainer().childNodes[1] as HTMLElement;
	stopConversionButton.click();
}
export function StopAudioInputFilePlayback() {
	const audioInputFileEl = document.querySelector("#audio-test-converted") as HTMLAudioElement;
	if (audioInputFileEl == null) return;
	audioInputFileEl.pause();
}