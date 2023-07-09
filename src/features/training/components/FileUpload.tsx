import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleInstructorAttendeeList, useValidateUserMutation } from "~/features/training/store";
import toast from "react-hot-toast";
import { useAppSelector } from "~/config/store";

function FileUpload() {
	const dispatch = useDispatch();
	const [file, setFile] = useState<any>([]);
	const [validateUser] = useValidateUserMutation();
	const { InstructorAttendeeList } = useAppSelector((state: any) => state.instructor);

	useEffect(() => {
		if (file.length > 0)
			(async () => {
				const users: any = {
					UserName: file
				};
				const response = await validateUser(users).unwrap();
				let count = 0;
				if (response.Data.ValidEmail !== undefined) {
					response.Data.ValidEmail.map((item: any) => {
						if (!InstructorAttendeeList.includes(item)) {
							dispatch(handleInstructorAttendeeList(item));
						} else {
							count++;
						}
					});
					if (count !== 0) toast.error(`${count} Duplicate users`);
					toast.success(response?.Message);
				}
			})();
	}, [file]);

	const importCSV = (event: any) => {
		const fileReader = new FileReader();
		const processCSV = (str: string, delim = ",") => {
			var lines = str.split("\n");
			var result = [];
			var obj = [];
			for (var i = 0; i < lines.length; i++) {
				const resultStr = lines[i].substring(0, lines[i].indexOf(","));
				if (resultStr) {
					result.push(resultStr);
				}
			}
			setFile(result);
		};

		fileReader.onload = function (ev: any) {
			const text = ev?.target?.result;
			const splitArr = text.split("\r\n");
			let result = [];
			for (let i = 1; i <= splitArr.length; i++) {
				if (splitArr[i] !== undefined && splitArr[i] !== "") {
					console.log("splitArr", splitArr[i]);
					result.push(splitArr[i]);
				}
			}
			setFile(result);
		};

		fileReader.readAsText(event.target.files[0]);
		event.target.value = "";
		// setFile(event.target.files[0]);
	};
	return (
		<div className="inline-block">
			<label htmlFor="formId">
				<input name="file" type="file" id="formId" hidden onChange={importCSV} accept=".csv" />
				<span className="underline cursor-pointer text-primary">upload</span>
			</label>
		</div>
	);
}

export default FileUpload;
