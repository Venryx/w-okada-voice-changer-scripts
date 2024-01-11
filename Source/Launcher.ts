import {AddButton_ConvertFreshFile, AddButton_ConvertLoadedFile} from "./AddDirectFileConvertButtons.js";
import {ApplyMyStartupTweaks} from "./MyStartupTweaks.js";
import {FindHTMLElementsMatching} from "./Utils/General.js";

// clear the parcel cache each time our code runs, so that user can keep re-applying modified versions of this code without refreshing the page
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