import AdminDashboard from "./components/AdminDashboard";
import CurrentSubscription from "./components/CurrentSubscription";
import TopAssessment from "./components/TopAssessment";
import TopCourses from "./components/TopCourses";
import LoginMonthChart from "./components/LoginMonthChart";
import CourseTimeChart from "./components/CourseTimeChart";
import { useGetDownloadUserReportQuery, useUserRoleStructureMapListQuery } from "./store";
import { Icon } from "@iconify/react";
import { CSVLink } from "react-csv";

function Dashboard() {
	const { data } = useGetDownloadUserReportQuery("");
	const UserReportList = useUserRoleStructureMapListQuery("");

	const HeadersData = [
		"UserID",
		"UserName",
		"UserStatus",
		"UserType",
		"AccountID",
		"FirstName",
		"LastName",
		"MiddleName",
		"Email",
		"Title",
		"Department",
		"EmployeeType",
		"CompanyName",
		"Industry",
		"CustomerType",
		"Phone",
		"Fax",
		"Platform",
		"AgreeToTerms",
		"SecondTermsAcceptance",
		"ShipAddress1",
		"ShipAddress2",
		"ShipCity",
		"ShipState",
		"ShipPostalCode",
		"ShipCountry",
		"ConnectTime",
		"DisconnectTime",
		"TTime",
		"TotalLogins"
	];

	const ReportHeadersData = [
		"UserId",
		"UserName",
		"FirstName",
		"LastName",
		"Email",
		"CurrentRoleId",
		"CurrentRoleName",
		"TargetRoleId",
		"TargetRoleName",
		"RoleStructureId",
		"RoleStructureName"
	];

	const headers = HeadersData.map((header: any) => {
		return {
			label: header,
			key: header
		};
	});

	const ReportHeaders = ReportHeadersData.map((header: any) => {
		return {
			label: header,
			key: header
		};
	});

	const CSVdatas = {
		filename: "UserDetails.csv",
		headers: headers,
		data: data?.Data ? data?.Data : []
	};

	const userReport = {
		filename: "UserReport.csv",
		headers: ReportHeaders,
		data: UserReportList?.data?.Data?.UserRoleStructureMapList
			? UserReportList?.data?.Data?.UserRoleStructureMapList
			: []
	};

	return (
		<>
			<div className="flex justify-between items-center flex-col sm:flex-row py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl self-start">
					Dashboard
				</h2>
				<div className="flex flex-col sm:flex-row items-start sm:gap-2 self-start">
					{!UserReportList.isLoading && (
						<CSVLink
							{...userReport}
							className="btn flex gap-2 rounded-full font-medium text-[#0A4B94] px-0"
						>
							<Icon icon={"material-symbols:download-rounded"} width={20} height={20} />
							<span>Download User Role Report</span>
						</CSVLink>
					)}
					<CSVLink {...CSVdatas} className="btn flex gap-2 rounded-full font-medium text-[#0A4B94] px-0">
						<Icon icon={"material-symbols:download-rounded"} width={20} height={20} />
						<span>Download User Report</span>
					</CSVLink>
				</div>
			</div>
			<AdminDashboard />
			<div className="grid grid-cols-12 gap-6 h-fit pb-2">
				<LoginMonthChart />
				<CourseTimeChart />
			</div>
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-12 lg:col-span-6 h-full">
					<div className="flex items-center space-x-4 py-5 lg:py-6">
						<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
							Top used courses in past year
						</h2>
					</div>
				</div>
				<div className="col-span-12 lg:col-span-6 h-full">
					<div className="flex items-center space-x-4 py-5 lg:py-6">
						<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
							Top used assessments in past year
						</h2>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-12 gap-6 h-fit pb-2">
				<TopCourses />
				<TopAssessment />
			</div>
			<div className="grid grid-cols-12 gap-6">
				<CurrentSubscription />
			</div>
		</>
	);
}

export default Dashboard;
