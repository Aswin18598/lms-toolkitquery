import md5 from "md5";

export function encryptPassword(text: any) {
	var byteArray: any = new Uint8Array(text.length * 2);
	for (var i = 0; i < text.length; i++) {
		byteArray[i * 2] = text.charCodeAt(i); // & 0xff;
		byteArray[i * 2 + 1] = text.charCodeAt(i) >> 8; // & 0xff;
	}
	return md5(String.fromCharCode.apply(String, byteArray));
}
export function getCurrentDate() {
	const date = new Date();
	let day: any = date.getDate();
	let year = date.getFullYear();
	let month: any = date.getMonth() + 1;
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	return year + "-" + month + "-" + day;
}

export function getCurrentHour() {
	const date = new Date();
	let hour: any = date.getHours();
	let hours = hour < 10 ? "0" + hour : hour;
	let minute: any = new Date().getMinutes();
	return minute < 30 ? hours : hours + 1;
}

export function getCurrentMinute() {
	let minute: any = new Date().getMinutes();
	return minute < 30 ? "30" : "00";
}

export function formatDate(dateStr: any) {
	if (!dateStr) return "";
	const date = new Date(dateStr),
		month = date.getMonth() + 1,
		day = date.getDate(),
		year = date.getFullYear();
	return [year, month < 10 ? "0" + month : month, day < 10 ? "0" + day : day].join("-");
}

export function setMinDate() {
	const dtToday = new Date(),
		month = dtToday.getMonth() + 1,
		day = dtToday.getDate(),
		year = dtToday.getFullYear();
	return year + "-" + (month < 10 ? "0" + month.toString() : month) + "-" + (day < 10 ? "0" + day.toString() : day);
}
