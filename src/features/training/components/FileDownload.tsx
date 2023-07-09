import { CSVLink } from "react-csv";

const FileDownload = () => {
	const HeadersData = ["UserName"];
	const Data = [{}];
	const headers = HeadersData.map((header: any) => {
		return {
			label: header,
			key: header
		};
	});
	const CSVdatas = {
		filename: "download.csv",
		headers: headers,
		data: Data
	};
	return (
		<CSVLink {...CSVdatas}>
			<span className="underline cursor-pointer text-primary">Download</span>
		</CSVLink>
	);
};

export default FileDownload;
