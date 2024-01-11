export function FindHTMLElementsMatching(selector: string) {
	return FindElementsMatching(selector) as HTMLElement[];
}
export function FindElementsMatching(selector: string) {
	return Array.from(document.querySelectorAll(selector));
}

/** If the dialog is closed/canceled, the promise will just never resolve. */
export function StartUpload(): Promise<File> {
	return new Promise((resolve, reject)=>{
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.style.display = "none";
		fileInput.onchange = e=>{
			var file = fileInput.files![0];
			if (file) resolve(file);
		};
		document.body.appendChild(fileInput);
		fileInput.click();
	});
}