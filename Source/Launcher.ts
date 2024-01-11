import {AddButton_ConvertFreshFile, AddButton_ConvertLoadedFile} from "./AddDirectFileConvertButtons.js";
import {ApplyMyStartupTweaks} from "./MyStartupTweaks.js";
import {FindHTMLElementsMatching} from "./Utils/General.js";

// use this to reset before each paste (type "r" in console, hit enter, then redo the paste+enter)
/*if (window["r"] == null) {
	Object.defineProperty(window, "r", {
		get() {
			Object.keys(window).filter(k=>k.startsWith("parcelRequire")).forEach(k=>delete window[k]);
			return "reset";
		},
	});
}*/
// actually, just reset it automatically!
function ClearParcelCache() {
	Object.keys(window).filter(k=>k.startsWith("parcelRequire")).forEach(k=>delete window[k]);
}
ClearParcelCache();

function ClearModificationsFromLastRun() {
	for (const el of FindHTMLElementsMatching(".v-added")) {
		el.remove();
	}
}

// clear ui modifications from last run
ClearModificationsFromLastRun();

// comment lines here to leave only the behavior you want
ApplyMyStartupTweaks();
AddButton_ConvertFreshFile();
AddButton_ConvertLoadedFile();
console.log("Finished applying modifications.");