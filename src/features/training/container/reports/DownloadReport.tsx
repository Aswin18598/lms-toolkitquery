import { useAppSelector } from "~/config/store";
import { useFeedbackSessionReportQuery, useFeedbackUsersReportQuery, useSessionUserReportsQuery } from "../../store";
import { CSVLink } from "react-csv";
import { Icon } from "@iconify/react";
import { useEffect, useMemo } from "react";

interface Iprop {
	StartDate: any;
	EndDate: any;
}
const DownloadReport = ({ StartDate, EndDate }: Iprop) => {
	const { TrainingReports, SessionTrainingReports, FeedbackSessionReport, FeedbackUsersReport } = useAppSelector(
		(state: any) => state.instructor
	);

	const SessionUserReports = useSessionUserReportsQuery(
		{ StartDate: StartDate, EndDate: EndDate },
		{ skip: StartDate === -1 || EndDate === -1 }
	);

	const FeedbackSessionReports = useFeedbackSessionReportQuery(
		{ StartDate: StartDate, EndDate: EndDate },
		{ skip: StartDate === -1 || EndDate === -1 }
	);

	const FeedbackUserReports = useFeedbackUsersReportQuery(
		{ StartDate: StartDate, EndDate: EndDate },
		{ skip: StartDate === -1 || EndDate === -1 }
	);

	useEffect(() => {
		SessionUserReports.refetch();
		FeedbackSessionReports.refetch();
		FeedbackUserReports.refetch();
	}, [StartDate, EndDate]);

	const tableHeader: any[] = useMemo(
		() => [
			{ label: "Training Name", key: "TrainingName" },
			{ label: "Session Name", key: "SessionName" },
			{ label: "StartDate", key: "StartDateTime" },
			{ label: "EndDate", key: "EndDateTime" },
			{ label: "Total Registered", key: "TotalRegistered" },
			{ label: "Total Attended", key: "TotalAttended" },
			{ label: "Location", key: "Location" }
		],

		[]
	);

	const SessionTrainingReportsHeader: any[] = useMemo(
		() => [
			{ label: "EmailID", key: "EmailID" },
			{ label: "UserId", key: "UserId" },
			{ label: "CourseName", key: "CourseName" },
			{ label: "Description", key: "Description" },
			{ label: "TrainingName", key: "TrainingName" },
			{ label: "SessionName", key: "SessionName" },
			{ label: "Participant", key: "Participant" },
			{ label: "FeedbackDone", key: "FeedbackDone" },
			{ label: "StartDateTime", key: "StartDateTime" },
			{ label: "EndDateTime", key: "EndDateTime" }
		],
		[]
	);

	const FeedbackSessionHeader: any[] = useMemo(
		() => [
			{ label: "CourseName", key: "CourseName" },
			{ label: "TrainingName", key: "TrainingName" },
			{ label: "SessionName", key: "SessionName" },
			{ label: "Question", key: "Question" },
			{ label: "AverageRating", key: "AverageRating" },
			{ label: "Respondent", key: "NoOfRespondents" }
		],
		[]
	);

	const FeedbackUsersHeader: any[] = useMemo(
		() => [
			{ label: "UserId", key: "UserId" },
			{ label: "UserName", key: "UserName" },
			{ label: "CourseName", key: "CourseName" },
			{ label: "TrainingName", key: "TrainingName" },
			{ label: "SessionName", key: "SessionName" },
			{ label: "Question", key: "Question" },
			{ label: "Rating", key: "Rating" },
			{ label: "Comments", key: "FeedbackComments" }
		],
		[]
	);

	const handleFeedbackReport = () => {
		var element = document.getElementById("FeedbackUser");
		element?.click();
	};

	const dwdIcon = () => {
		return <Icon icon={"material-symbols:download-rounded"} width={20} height={20} />;
	};
	return (
		<>
			<CSVLink
				filename="training.csv"
				data={(TrainingReports.TrainingReports?.length > 0 && TrainingReports.TrainingReports) || []}
				headers={tableHeader}
				className={`btn px-0 rounded-full font-medium text-[#0A4B94] ${
					TrainingReports.TrainingReports ? "" : "disabled"
				}`}
			>
				{dwdIcon()}
				<span>Training Report</span>
			</CSVLink>
			<CSVLink
				filename="trainingDetailReport.csv"
				data={(SessionTrainingReports?.length > 0 && SessionTrainingReports) || []}
				headers={SessionTrainingReportsHeader}
				className={`btn px-0 rounded-full font-medium text-[#0A4B94] ${
					SessionTrainingReports?.length > 0 ? "" : "disabled"
				}`}
			>
				{dwdIcon()}
				<span>Training Detail Report</span>
			</CSVLink>
			<CSVLink
				filename="FeedbackSessionReport.csv"
				data={(FeedbackSessionReport?.length > 0 && FeedbackSessionReport) || []}
				headers={FeedbackSessionHeader}
				className={`btn px-0 rounded-full font-medium text-[#0A4B94] ${
					FeedbackSessionReport?.length > 0 ? "" : "disabled"
				}`}
				onClick={handleFeedbackReport}
			>
				{dwdIcon()}
				<span>Feedback Report</span>
			</CSVLink>
			<CSVLink
				id="FeedbackUser"
				filename="FeedbackUsersReport.csv"
				data={(FeedbackUsersReport?.length > 0 && FeedbackUsersReport) || []}
				headers={FeedbackUsersHeader}
				className={`btn px-0 FeedbackReport hidden space-x-2 rounded-full font-medium text-[#0A4B94] ${
					FeedbackUsersReport?.length > 0 ? "" : "disabled"
				}`}
			>
				<span>FeedBackUsers Report</span>
			</CSVLink>
		</>
	);
};

export default DownloadReport;
