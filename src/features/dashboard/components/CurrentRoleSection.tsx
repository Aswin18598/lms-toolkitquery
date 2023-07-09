import CircularProgress from "./CircleProgressBar";
import { Icon } from "@iconify/react";
import { getLoggedUser } from "~/helpers/auth";
import { Link, useNavigate } from "react-router-dom";
import { useGetHeroSectionDetailsQuery, useGetProfileDataQuery } from "../store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const CurrentRoleSection = () => {
	const { FirstName } = getLoggedUser();
	const navigate = useNavigate();
	const { UserId } = getLoggedUser();
	useGetProfileDataQuery(UserId);
	useGetHeroSectionDetailsQuery(UserId);
	const { ProfileData, HeroSectionDetails } = useSelector((state: any) => state.dashboard);
	const [profilepercentage, setprofilepercentage] = useState<any>(0);
	const [shareOption, setShareOption] = useState<boolean>(false);
	const linkstr = "/account/update/role-and-skill";

	useEffect(() => {
		ProfileData?.map((data: any) => {
			setprofilepercentage(data.ProfileCompletionPercentage ? data.ProfileCompletionPercentage : 0);
		});
	});

	return (
		<>
			<div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 mt-8">
				{HeroSectionDetails?.heroSectionNavigation?.Navigation === "LP" ? (
					<>
						<div
							className={`col-span-12 ${
								profilepercentage < 100 ? "lg:col-span-8" : "lg:col-span-12"
							} rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#4F46E5]  shadow-soft print:border p-5`}
						>
							<div className="flex text-[#FFFFFF] whitespace-nowrap  lg:gap-6">
								<div className="flex flex-col relative gap-4">
									{shareOption && (
										<div className="flex flex-col absolute left-[30%] top-[10%] p-3 gap-4 rounded-lg text-[#020A12] text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90">
											<div
												className="flex items-center text-left gap-2 cursor-pointer"
												onClick={() => navigate(linkstr)}
											>
												<Icon icon="fluent:edit-24-regular" width="16" height="16" />
												<span>Edit target role</span>
											</div>
											<div
												className="flex items-center gap-2 cursor-pointer"
												onClick={() => navigate(linkstr)}
											>
												<Icon icon="mingcute:eye-line" width="16" height="16" />
												<span>Preview role structure</span>
											</div>
										</div>
									)}
									<span className="flex items-center gap-2 text-sm" title="Menu">
										Target Role
										<Icon
											icon="ph:dots-three-outline-fill"
											onClick={() => setShareOption(!shareOption)}
										/>
									</span>

									<span className="text-lg font-medium">
										{HeroSectionDetails.heroSectionNavigation.TargetRole}
									</span>
									<div className="flex text-sm lg:gap-6">
										<div className="flex flex-col lg:gap-4">
											<span>Paths completed</span>
											<div className="flex items-center flex-row lg:gap-4">
												<div
													className="flex items-center justify-center w-8 h-8 rounded-full hidden lg:block"
													style={{ background: "rgba(0, 0, 0, 0.17)" }}
												>
													<Icon
														className="mt-2 ml-2 h-4 w-4"
														icon="mingcute:directory-line"
													/>
												</div>
												<span className="text-sm+ font-bold">
													{HeroSectionDetails.heroSectionLearningPathList[0]
														? HeroSectionDetails.heroSectionLearningPathList[0]
																.PathsCompleted
														: "0"}
													/{HeroSectionDetails.heroSectionLearningPathList?.length}
												</span>
											</div>
										</div>

										<div className="flex flex-col lg:gap-4">
											<span>Time to spend</span>
											<div className="flex items-center flex-row lg:gap-4">
												<div
													className="flex items-center justify-center w-8 h-8 rounded-full hidden lg:block"
													style={{ background: "rgba(0, 0, 0, 0.17)" }}
												>
													<Icon
														className="mt-2 ml-2 h-4 w-4"
														icon="ic:baseline-access-time"
													/>
												</div>
												<span className="text-sm+ font-bold">
													{HeroSectionDetails.heroSectionLearningPathList[0]
														? HeroSectionDetails.heroSectionLearningPathList[0].TimeToSpend
														: "00:00"}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="flex overflow-auto scrollbar-hide gap-6">
									{HeroSectionDetails.heroSectionLearningPathList.map((item: any) => (
										<div className="rounded-lg" style={{ background: "rgba(255, 255, 255, 0.26)" }}>
											<div className="p-5 flex flex-col lg:gap-14">
												<div className="text-sm font-bold">{item.LearningPathName}</div>
												<div className="flex flex-row lg:gap-10">
													<div className="flex flex-col">
														<span className="text-sm+ font-bold">
															{item.CourseCompleted}/{item.TotalCourse}
														</span>
														<span className=" text-sm">Courses</span>
													</div>
													<div className="flex flex-col">
														<span className="text-sm+ font-bold">
															{item.AssessmentCompleted}/{item.TotalAssessment}
														</span>
														<span className=" text-sm">Assessemnt</span>
													</div>
													<div
														title="View Detail"
														className="flex items-center justify-center bg-[#FFFFFF] border w-8 h-8 rounded-full hidden lg:block cursor-pointer"
														onClick={() => navigate("/learning?LearningPaths")}
													>
														<Icon
															className="mt-2 ml-1.5 h-4 w-4"
															icon="ph:arrow-up-right-bold"
															color="#1E293B"
														/>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						{profilepercentage < 100 && (
							<div className="col-span-12 lg:col-span-4 rounded-lg bg-gradient-to-r from-[#818CF8] to-[#F9A8D4]   shadow-soft print:border">
								<div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
									<div className="col-span-8 lg:col-span-8 mt-7 ml-6">
										<div className="flex items-center tracking-wide space-x-2 text-white max-w-2xl">
											<p className="font-dmsans font-normal text-sm">
												Complete your profile to access all the features, and preferences based
												recommendations
											</p>
										</div>
										<div className="mt-6 mb-6 text-xs lg:text-sm">
											<button
												className="flex items-center justify-center font-inter font-semibold rounded-lg text-[#FFFFFF] bg-[#FFFFFF]/40 px-6 py-3 cursor-pointer"
												onClick={() => navigate("/account/update/personal")}
											>
												Go to profile
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
														fill="#FFFFFF"
													/>
												</svg>
											</button>
										</div>
									</div>
									<div className="col-span-4 lg:col-span-4">
										<div className="flex my-9 mr-8">
											<div className="w-24 h-24 block">
												<CircularProgress data={profilepercentage} />
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<>
						<div
							className={`col-span-12  ${
								profilepercentage < 100 ? "lg:col-span-8" : "lg:col-span-12"
							} relative flex  w-full flex-col break-words rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#4F46E5]  shadow-soft print:border px-7 sm:px-5`}
						>
							<div className=" flex h-auto items-center justify-between pr-4">
								<div className="flex flex-col my-7">
									<h2 className="font-bold tracking-wide text-white line-clamp-1 dark:text-navy-100 lg:text-xl">
										Welcome, {FirstName}
									</h2>
									<div className="mt-2 text-xs text-white max-w-2xl lg:text-sm">
										<div className="flex items-center tracking-wide space-x-2 mt-2 text-white lg:text-sm">
											<p className="font-dmsans font-normal text-sm lg:text-lg">
												Click{" "}
												<Link
													className="underline hover:text-[#4F46E5]"
													to={"skill-advisor"}
													// to={`${
													// 	HeroSectionDetails?.heroSectionNavigation?.Navigation === "SA"
													// 		? "skill-advisor"
													// 		: "/account/update/role-and-skill"
													// }`}
													target="_blank"
												>
													here
												</Link>{" "}
												to build a custom learning plan
											</p>
											{/* <p className="bg-[#FFFFFF]/20 text-sm lg:text-lg text-white font-bold mr-2 px-2 py-1 rounded-2xl">
													36%
												</p>
												<p className="font-dmsans font-normal text-sm lg:text-lg">
													faster than{" "}
												</p> */}
										</div>
										{/* <p className="font-dmsans font-normal tracking-wide text-white text-sm lg:text-lg">
												other learners in your current role!
											</p> */}
									</div>
								</div>
								<div className="hidden lg:flex">
									<img className="relative top-3" src="/tiger-pointing.png" alt="tiger" width={220} />
									<div className="mt-3 relative self-start right-6 xl:right-0">
										<div className="font-bold badge rounded-full px-8 py-4 text-base bg-white ">
											Hi, I'm Cosmos
										</div>
									</div>
								</div>
							</div>
						</div>
						{profilepercentage < 100 && (
							<div className="col-span-12 lg:col-span-4 rounded-lg bg-gradient-to-r from-[#818CF8] to-[#F9A8D4]   shadow-soft print:border">
								<div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
									<div className="col-span-8 lg:col-span-8 mt-7 ml-6">
										<div className="flex items-center tracking-wide space-x-2 text-white max-w-2xl">
											<p className="font-dmsans font-normal text-sm">
												Complete your profile to access all the features, and preferences based
												recommendations
											</p>
										</div>
										<div className="mt-6 mb-6 text-xs lg:text-sm">
											<button
												className="flex items-center justify-center font-inter font-semibold rounded-lg text-[#FFFFFF] bg-[#FFFFFF]/40 px-6 py-3 cursor-pointer"
												onClick={() => navigate("/account/update/personal")}
											>
												Go to profile
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
														fill="#FFFFFF"
													/>
												</svg>
											</button>
										</div>
									</div>
									<div className="col-span-4 lg:col-span-4">
										<div className="flex my-9 mr-8">
											<div className="w-24 h-24 block">
												<CircularProgress data={profilepercentage} />
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default CurrentRoleSection;
