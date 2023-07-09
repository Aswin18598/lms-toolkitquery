export const training = {
	form: {
		name: {
			placeholder: "Training Name",
			error: {
				required: "* Training Name is required"
			}
		},
		description: {
			placeholder: "Enter Description",
			error: {
				required: "* Description is required"
			}
		}
	}
};

export const session = {
	form: {
		name: {
			placeholder: "Enter Session Name",
			error: {
				required: "* Session Name is required"
			}
		},
		description: {
			placeholder: "Enter Description",
			error: {
				required: "* Description is required"
			}
		},
		location: {
			placeholder: "Enter Location",
			error: {
				required: "* Location is required"
			}
		},
		instructorname: {
			placeholder: "Enter Instructor Name",
			error: {
				required: "* Instructor Name is required"
			}
		}
	}
};

export const convertLocalISOString = function (date: any) {
	console.log("date", date);

	function addPad(number: any) {
		return number < 10 ? "0" + number : number;
	}

	return (
		date.getFullYear() +
		"-" +
		addPad(date.getMonth() + 1) +
		"-" +
		addPad(date.getDate()) +
		"T" +
		addPad(date.getHours()) +
		":" +
		addPad(date.getMinutes()) +
		":" +
		addPad(date.getSeconds())
	);
};

export const dateFormatWithDelimiter = function (dateString: any, delimiter: string) {
	if (!dateString) return "";
	const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	const date = new Date(dateString);
	const day = date.getDate(),
		month = monthList[date.getMonth()],
		year = date.getFullYear();
	return "" + (day <= 9 ? "0" + day : day) + delimiter + month + delimiter + year;
};

export const formatTimeDiff = function (dateString: any) {
	if (!dateString) return "-";
	const timeDiff = new Date().getTime() - new Date(dateString).getTime();
	const diffInDays = Math.floor(timeDiff / (1000 * 60 * (60 * 24)));
	const diffInDate = new Date(diffInDays);
	return getDiffInDays(diffInDays, diffInDate);
};

function getDiffInDays(diffInDays: any, diffInDate: any) {
	if (diffInDays > 1) {
		return diffInDays + "d ago";
	} else if (diffInDate.getHours() < 1) {
		return diffInDate.getMinutes() + "m ago";
	} else {
		return diffInDate.getHours() + "h ago";
	}
}
