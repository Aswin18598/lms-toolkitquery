import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { useGetTranscriptUserDetailsQuery } from "../store";

const TranscriptCard = () => {
	const navigate = useNavigate();
	const { TranscriptUserDetails } = useAppSelector((state: any) => state.TranscriptReducer);

	const handleClick = () => {
		navigate(navigateLink.transcriptDetails);
	};
	return (
		<>
			{TranscriptUserDetails?.length > 0 &&
				TranscriptUserDetails.map((user: any, index: number) => {
					return (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-between " key={index}>
								<div className="flex items-center gap-4 py-4 sm:py-0 sm:p-4">
									<div className="avatar h-16 w-16">
										<img className="rounded-full" src="/profile.png" alt="avatar" />
									</div>
									<div>
										<h6 className="text-xl font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light">
											{`${user.FirstName} ${user.LastName}`}
										</h6>
										<p className="text-base text-slate-5  00 dark:text-navy-300">{user.EmailID}</p>
									</div>
								</div>
								<div className="grid sm:justify-end justify-start" id="download-container">
									<button
										className="btn space-x-2 rounded-full bg-white hover:bg-white focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
										onClick={handleClick}
									>
										<Icon icon="ph:eye-bold" width="16" height="16" />

										<span>View as Public </span>
									</button>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
								<div className="flex items-center bg-white rounded-lg p-6">
									<div className="relative">
										<img src="/assets/images/learningcard.svg" />
										<Icon
											icon="mingcute:copper-coin-line"
											width="16"
											height="16"
											color="#FAA41A"
											className="absolute inset-0 m-auto"
										/>
									</div>
									<div className="ml-6 flex flex-col">
										<span className="font-semibold text-lg">{user.TotalPoints}</span>
										<span>Learning Points</span>
									</div>
								</div>
								<div className="flex items-center bg-white rounded-lg p-6">
									<div className="relative">
										<img src="/assets/images/learningcard1.svg" />
										<Icon
											icon="mingcute:copper-coin-line"
											width="16"
											height="16"
											color="#4FC666"
											className="absolute inset-0 m-auto"
										/>
									</div>
									<div className="ml-6 flex flex-col">
										<span className="font-semibold text-lg">{user.CoursePoints}</span>
										<span>Course Points</span>
									</div>
								</div>
								<div className="flex items-center bg-white rounded-lg p-6">
									<div className="relative">
										<img src="/assets/images/learningcard2.svg" />
										<Icon
											icon="mingcute:copper-coin-line"
											width="16"
											height="16"
											color="#288AD7"
											className="absolute inset-0 m-auto"
										/>
									</div>
									<div className="ml-6 flex flex-col">
										<span className="font-semibold text-lg">{user.AssessmentPoints}</span>
										<span>Assessment Points</span>
									</div>
								</div>
								<div className="flex items-center bg-white rounded-lg p-6">
									<div className="relative">
										<img src="/assets/images/learningcard3.svg" />
										<Icon
											icon="mdi:clock-time-five-outline"
											width="16"
											height="16"
											color="#D85C57"
											className="absolute inset-0 m-auto"
										/>
									</div>
									<div className="ml-6 flex flex-col">
										<span className="font-semibold text-lg">{user.LearningTime}</span>
										<span>Time Spent</span>
									</div>
								</div>
							</div>
						</>
					);
				})}
		</>
	);
};

export default TranscriptCard;
