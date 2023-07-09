import { useGetTranscriptListQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";
import { Link } from "react-router-dom";

interface IProps {
	userId?: string;
}

const Transcript = ({ userId }: IProps) => {
	useGetTranscriptListQuery(userId);
	const { transcriptList } = useAppSelector((state: any) => state.dashboard);

	return (
		<div className="col-span-12 lg:col-span-3">
			<div className="flex items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Transcript</h2>
			</div>
			<div className="grid grid-row-4 gap-6">
				<div className="col-span-12 hidden lg:block">
					<img src="/assets/images/transcript.svg" alt="transcript" />
				</div>
				<div className="col-span-6 lg:col-span-12 p-4 rounded-lg bg-white border border-gray-200">
					<div className="flex items-center">
						<div className="hidden lg:block">
							<img src="/assets/images/goldcoin.svg" alt="" />
						</div>
						<span className="ml-4">
							<p className="text-lg font-bold font-inter lg:text-lg">
								{transcriptList && transcriptList[0]?.CoursePoints}
							</p>
							<p className="text-base">Course Points</p>
						</span>
					</div>
				</div>
				<div className="col-span-6 lg:col-span-12 p-4 rounded-lg bg-white border border-gray-200">
					<div className="flex items-center">
						<div className="hidden lg:block">
							<img src="/assets/images/goldcoin.svg" alt="" />
						</div>
						<span className="ml-4">
							<p className="text-lg font-bold font-inter lg:text-lg">
								{transcriptList && transcriptList[0]?.AssessmentPoints}
							</p>
							<p className="text-base">Assessments Points</p>
						</span>
					</div>
				</div>
				<div className="col-span-12 ml-16 text-xs lg:text-sm">
					<Link
						to={"/transcript"}
						className="flex items-center justify-center font-inter font-semibold rounded-lg text-[#1268B3] px-6"
					>
						View Transcript
						<svg
							className="ml-2.5"
							width="12"
							height="10"
							viewBox="0 0 12 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7.80473 0.757765L11.5759 4.52899C11.8363 4.78933 11.8363 5.21146 11.5759 5.47179L7.80473 9.24306C7.5444 9.50339 7.12227 9.50339 6.86193 9.24306C6.60153 8.98272 6.60153 8.56059 6.86193 8.30026L9.49507 5.66706H0.666667C0.29848 5.66706 0 5.36859 0 5.00039C0 4.63219 0.29848 4.33372 0.666667 4.33372H9.49507L6.86193 1.70057C6.60153 1.44022 6.60153 1.01811 6.86193 0.757765C7.12227 0.497412 7.5444 0.497412 7.80473 0.757765Z"
								fill="#1268B3"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Transcript;
