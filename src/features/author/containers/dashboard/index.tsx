import { Icon } from "@iconify/react";
import AuthorDashboard from "./components/AuthorDashboard";
import CourseTimeChart from "./components/CourseTimeChart";
import LoginMonthChart from "./components/LoginMonthChart";
import TopAssessment from "./components/TopAssessments";
import TopCourses from "./components/TopCourses";

function Dashboard() {
	return (
		<>
			<div className="flex justify-between items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Dashboard</h2>
			</div>
			<AuthorDashboard />
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
		</>
	);
}

export default Dashboard;
