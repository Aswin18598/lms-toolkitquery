import { Icon } from "@iconify/react";
import { Spinner1 } from "~/components/spinner";
import { useGetAuthorScoreCardsQuery } from "../store";

const AuthorDashboard = () => {
	const { isLoading, data } = useGetAuthorScoreCardsQuery("");
	const AuthorDashboardDetails = data?.Data;

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						COURSES IN ACCOUNT
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#E6F7E9] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#4FC666]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AuthorDashboardDetails?.TotalCourseInAccount}
						</p>
					)}
					<Icon
						className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
						icon="mingcute:book-3-line"
						width="16"
						height="16"
					/>
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						ASSESSMENTS IN ACCOUNT
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:group-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AuthorDashboardDetails?.TotalAssessmentInAccount}
						</p>
					)}
					<Icon className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:group-line" />
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						COURSES CREATED
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#E6F7E9] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#4FC666]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AuthorDashboardDetails?.TotalCoursesCreated}
						</p>
					)}
					<Icon
						className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
						icon="mingcute:book-3-line"
						width="16"
						height="16"
					/>
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						COURSES EDITED
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							<span className="text-xl">{AuthorDashboardDetails?.TotalCoursesEdited}</span>
						</p>
					)}
					<Icon className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:book-3-line" />
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						COURSES ONLINE
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							<span className="text-xl">{AuthorDashboardDetails?.TotalCoursesOnline}</span>
						</p>
					)}
					<Icon className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:book-3-line" />
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						COURSES OFFLINE
					</p>
					<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg hidden lg:block">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							<span className="text-xl">{AuthorDashboardDetails?.TotalCoursesOffline}</span>
						</p>
					)}
					<Icon className="hidden lg:block mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:book-3-line" />
				</div>
			</div>
		</div>
	);
};

export default AuthorDashboard;
