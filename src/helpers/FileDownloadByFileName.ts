const FileDownloadByFileName = (Data: any) => {
	const a = document.createElement("a");
	a.setAttribute("href", "data:" + Data.FileType + ";base64," + Data.FileContent);
	a.setAttribute("download", Data.FileName);
	a.setAttribute("target", "_blank");
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export default FileDownloadByFileName;
