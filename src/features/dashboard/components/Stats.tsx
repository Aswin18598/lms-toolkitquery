import { useGetScorecardQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";
import { Spinner1 } from "~/components/spinner";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { getLoggedUser } from "~/helpers/auth";
interface IProps {
	userId?: string;
}

const Stats = ({ userId }: IProps) => {
	const navigate = useNavigate();
	const { isLoading } = useGetScorecardQuery(userId);
	const { scorecard } = useAppSelector((state: any) => state.dashboard);
	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
				<button
					title="View Detail"
					className="rounded-lg bg-white pl-6 border border-gray-200"
					onClick={() => navigate(navigateLink.MyLearningCourse, { state: { statusID: 2 } })}
				>
					<div className="flex justify-between">
						<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-14">
							Courses In Progress
						</p>
						<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#E3F2FB] rounded-lg  lg:block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mt-2 ml-2 h-6 w-6 text-[#0A4B94]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="4" y1="4" x2="4" y2="20" />
								<line x1="4" y1="20" x2="20" y2="20" />
								<polyline points="4 17 9 11 13 15 21 7" />
								<polyline points="14 7 21 7 21 14" />
							</svg>
						</div>
					</div>
					<div className="flex justify-between">
						{isLoading && <Spinner1 />}
						{!isLoading && (
							<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
								{scorecard.InProgressCourses}
							</p>
						)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
							fill="none"
							viewBox="-4 -4 24 24"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="4" y1="4" x2="4" y2="20" />
							<line x1="4" y1="20" x2="20" y2="20" />
							<polyline points="4 17 9 11 13 15 21 7" />
							<polyline points="14 7 21 7 21 14" />
						</svg>
					</div>
				</button>
				<button
					title="View Detail"
					className="rounded-lg bg-white pl-6 border border-gray-200"
					onClick={() => navigate(navigateLink.MyLearningCourse, { state: { statusID: 3 } })}
				>
					<div className="flex justify-between">
						<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-14">
							Courses Completed
						</p>
						<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#E6F7E9] rounded-lg  lg:block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mt-2 ml-2 h-6 w-6 text-[#4FC666]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
							</svg>
						</div>
					</div>
					<div className="flex justify-between">
						{isLoading && <Spinner1 />}
						{!isLoading && (
							<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
								{scorecard.CompletedCourses}
							</p>
						)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className=" lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
							fill="none"
							viewBox="-4 -4 24 24"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
						</svg>
					</div>
				</button>
				<button
					title="View Detail"
					className="rounded-lg bg-white pl-6 border border-gray-200"
					onClick={() => navigate(navigateLink.MyLearningAssesment, { state: { statusID: 2 } })}
				>
					<div className="flex justify-between">
						<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-14">
							Assessments Completed
						</p>
						<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FFFDE6] rounded-lg  lg:block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mt-2 ml-2 h-6 w-6 text-[#FAA41A]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
								<line x1="9" y1="7" x2="13" y2="7" /> <line x1="9" y1="11" x2="13" y2="11" />
							</svg>
						</div>
					</div>
					<div className="flex justify-between">
						{isLoading && <Spinner1 />}
						{!isLoading && (
							<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
								{scorecard.NumAssms}
							</p>
						)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className=" lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
							fill="none"
							viewBox="-4 -4 24 24"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
							<line x1="9" y1="7" x2="13" y2="7" /> <line x1="9" y1="11" x2="13" y2="11" />
						</svg>
					</div>
				</button>
				<div className="rounded-lg bg-white pl-6 border border-gray-200">
					<div className="flex justify-between">
						<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-14">
							Learning Time
						</p>
						<div className="flex items-center justify-center mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg  lg:block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mt-2 ml-2 h-6 w-6 text-[#D85C57]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
					<div className="flex justify-between">
						{isLoading && <Spinner1 />}
						{!isLoading && (
							<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
								<span className="text-xl">{scorecard.TrainingTime}</span>
							</p>
						)}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className=" lg:block mt-6 h-16 w-16 text-[#E8EAEE]"
							fill="none"
							viewBox="-4 -4 24 24"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>
		</>
	);
};

export default Stats;
