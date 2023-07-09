import { Fragment, useState, useEffect } from "react";
import { useGetLearningPathQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";

interface IProps {
	userId?: string;
}

const LearningPath = ({ userId }: IProps) => {
	useGetLearningPathQuery(userId);
	const { learningPath, learningPathMessage } = useAppSelector((state: any) => state.dashboard);
	const [showDropDown, setShowDropDown] = useState<boolean>(false);
	const [expanded, setCollapseExpanded] = useState<Map<string, boolean>>(new Map<string, boolean>());
	const [startIndex, setStartIndex] = useState<number>(0);
	const [endIndex, setEndIndex] = useState<number>(3);
	const [noOfPages, setPages] = useState<number>(0);
	const navigate = useNavigate();

	useEffect(() => {
		if (learningPath && learningPath?.LearningPathDetailedList?.length > 0) {
			if (learningPath.LearningPathDetailedList.length % 3 === 0) {
				setPages(Math.floor(learningPath.LearningPathDetailedList.length / 3));
			} else {
				setPages(Math.floor(learningPath.LearningPathDetailedList.length / 3) + 1);
			}
		}
	}, [learningPath, noOfPages]);

	function loadContent(pageNumber: number): void {
		let newStartIndex = 0 + 3 * pageNumber;
		let newEndIndex = 3 + 3 * pageNumber;
		if (newStartIndex > learningPath.LearningPathDetailedList.length) {
			newStartIndex = startIndex;
		}
		if (newEndIndex > learningPath.LearningPathDetailedList.length) {
			newEndIndex = learningPath.LearningPathDetailedList.length;
		}
		setStartIndex(newStartIndex);
		setEndIndex(newEndIndex);
	}

	const toggleDropDown = () => {
		setShowDropDown(!showDropDown);
	};
	const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
		if (event.currentTarget === event.target) {
			setShowDropDown(false);
		}
	};

	const toggleCollapse = (index: string) => {
		const localMap = new Map<string, boolean>();
		if (!expanded.has(index)) {
			localMap.set(index, true);
		}
		setCollapseExpanded(localMap);
	};

	function rotateCollapse180(index: string): string {
		if (expanded.has(index)) {
			return "-rotate-180";
		}
		return "";
	}

	function showTableRowBorder(index: string): string {
		if (expanded.has(index)) {
			return "";
		}
		return "border-y";
	}

	const clickHide = () => {
		const localMap = new Map<string, boolean>();
		setCollapseExpanded(localMap);
	};

	return (
		<>
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4 py-5 lg:py-6">
						<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
							Learning Path
						</h2>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center" title="Search">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3.5 w-3.5 hover:bg-[#020A12]/75 rounded-full"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<div className="inline-flex ml-2" title="Menu">
							<button
								className="btn h-3.5 w-3.5 rounded-full p-0"
								onClick={(): void => toggleDropDown()}
								onBlur={(e: React.FocusEvent<HTMLButtonElement>): void => dismissHandler(e)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3.5 w-3.5 hover:bg-[#020A12]/75 rounded-full"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
								</svg>
							</button>
							{showDropDown && (
								<div className="absolute right-16 rounded-md border border-slate-150 bg-white py-1.5 font-inter">
									<ul>
										<li className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4.5 w-4.5 ml-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" />
												<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
												<polyline points="7 11 12 16 17 11" />
												<line x1="12" y1="4" x2="12" y2="16" />
											</svg>
											<button className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
												Download
											</button>
										</li>
										<li className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4.5 w-4.5 ml-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
											</svg>
											<button className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100">
												Share
											</button>
										</li>
									</ul>
								</div>
							)}
						</div>
						<h2
							className="text-[#1268B3] cursor-pointer"
							onClick={() => navigate(navigateLink.learning + "?LearningPaths")}
						>
							View All
						</h2>
					</div>
				</div>
				{learningPath.LearningPathDetailedList?.length > 0 ? (
					<>
						<div className="col-span-12 bg-white rounded-lg">
							<table className="is-hoverable w-full text-left">
								<thead>
									<tr className="bg-[#E2E8F0] font-inter font-medium text-sm text-[#020A12]/60 rounded-tl-lg">
										<th className=" px-4 py-3 lg:px-5">#</th>
										<th className=" px-4 py-3 lg:px-5">LEARNING PATH NAME</th>
										<th className=" px-4 py-3 lg:px-5">ITEMS</th>
										{/* <th className=" px-4 py-3 lg:px-5">Completion Status</th> */}
										<th className=" px-1 lg:px-5"></th>
									</tr>
								</thead>
								<tbody>
									{learningPath.LearningPathDetailedList.map((item: any, index: number) => (
										<Fragment key={item.SNo}>
											<tr
												className={` ${showTableRowBorder(
													item.SNo
												)} border-transparent border-b-slate-200 cursor-pointer`}
												key={item.SNo}
												onClick={(): void => toggleCollapse(`${index}`)}
											>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className=" text-sm font-dmsans text-[#020A12]/60">
															{startIndex + index + 1}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.LearningPathName}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.LearningPathCourseDetails?.length} items
														</p>
													</div>
												</td>
												{/* <td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{(item.CompletedLP || 0) + "/" + (item.TotalLP || 0)}
														</p>
													</div>
												</td> */}
												<td className="whitespace-nowrap">
													{item.LearningPathCourseDetails?.length > 0 && (
														<button
															title={
																rotateCollapse180(`${index}`) ? "Collapse" : "Expand"
															}
															className="btn"
															onClick={(): void => toggleCollapse(`${index}`)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className={`h-4.5 w-4.5 text-sm font-dmsans text-[#020A12]/60  ${rotateCollapse180(
																	`${index}`
																)}`}
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
															</svg>
														</button>
													)}
												</td>
											</tr>
											{expanded.get(`${index}`) && (
												<CourseTable
													clickHide={clickHide}
													courseDetails={item.LearningPathCourseDetails}
												/>
											)}
										</Fragment>
									))}
								</tbody>
							</table>
						</div>

						{noOfPages > 0 && (
							<div className="flex flex-col items-center bg-white justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
								<div className="text-sm">
									{startIndex + 1} - {endIndex} of {learningPath.LearningPathDetailedList.length}{" "}
									entries
								</div>

								<ul className="pagination inline-flex items-center -space-x-px">
									<li className="rounded-l-full bg-[#E9EEF5]">
										<button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 19l-7-7 7-7"
												/>
											</svg>
										</button>
									</li>
									{_.times(noOfPages, i => (
										<li key={i + 1} className="bg-[#E9EEF5] ">
											<button
												className="flex h-8 min-w-[2rem] items-center justify-center rounded-full px-3 leading-tight transition-colors hover:bg-[slate-300] focus:bg-[#1268B3] focus:text-[#FFFFFF] active:bg-[#1268B3] active:text-[#FFFFFF]"
												onClick={() => loadContent(i)}
											>
												{i + 1}
											</button>
										</li>
									))}
									<li className="rounded-r-full bg-slate-150">
										<button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									</li>
								</ul>
							</div>
						)}
					</>
				) : (
					<>
						<div className="flex flex-col text-center items-center mx-auto py-12">
							{learningPathMessage.toLowerCase().includes("success") || learningPathMessage === "" ? (
								<></>
							) : !learningPathMessage.toLowerCase().includes("fail") ? (
								<p className="text-xs+ text-[#020A12]/60">{learningPathMessage}</p>
							) : (
								<p className="text-xs+ text-[#020A12]/60">{"No records found"}</p>
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

const CourseTable = ({ clickHide, courseDetails }: { clickHide: Function; courseDetails: any }) => {
	const navigate = useNavigate();
	return (
		<tr className="border-y border-transparent border-b-slate-200 text-[#020A12]/60">
			<td colSpan={6}>
				<div className="bg-white rounded-lg">
					<table className="is-hoverable w-full text-left">
						<thead>
							<tr className="text-sm font-dmsans m-4 font-medium">
								<th className=" px-4 py-3 lg:px-5">TYPE</th>
								<th className=" px-4 py-3 lg:px-5">NAME</th>
								<th className=" px-4 py-3 lg:px-5">LAST ACCESS</th>
								<th className=" px-4 py-3 lg:px-5">TIME SPENT</th>
								<th className=" px-4 py-3 lg:px-5">START DATE</th>
								<th className=" px-4 py-3 lg:px-5">DUE DATE</th>
							</tr>
						</thead>
						<tbody>
							{courseDetails.map((course: any, index: number) => (
								<tr className="border-y border-transparent border-b-slate-200" key={course.CourseName}>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										{course.Type !== "Course" ? (
											<div className="w-8 h-8 bg-[#FFFDE6] rounded-md flex" title={"Assessment"}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 text-[#FAA41A] m-2"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
													<line x1="9" y1="7" x2="13" y2="7" />{" "}
													<line x1="9" y1="11" x2="13" y2="11" />
												</svg>
											</div>
										) : (
											<div className="w-8 h-8 bg-[#F5F7F9] rounded-md flex" title={"Course"}>
												<svg
													width="12"
													height="13"
													viewBox="0 0 12 13"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="m-2.5"
												>
													<path
														d="M9.33463 0.333984C10.3998 0.333984 11.3346 1.20065 11.3346 2.33398V11.0007C11.3346 12.134 10.4013 13.0007 9.33463 13.0007H2.0013C1.29839 13.0007 0.667969 12.3673 0.667969 11.6673V1.66732C0.667969 0.96441 1.3013 0.333984 2.0013 0.333984H9.33463ZM9.33463 1.66732H4.66797V11.6673H9.33463C9.67653 11.6673 10.0013 11.4073 10.0013 11.0007V2.33398C10.0013 1.9921 9.67463 1.66732 9.33463 1.66732ZM3.33464 1.66732H2.0013V11.6673H3.33464V1.66732Z"
														fill="#1268B3"
													/>
												</svg>
											</div>
										)}
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<button
											className="flex text-left"
											onClick={() =>
												navigate(
													course.Type === "Course"
														? navigateLink.LearningCoursedetail + "&" + course.CourseID
														: navigateLink.learningAssesmentDetails + "&" + course.CourseID
												)
											}
											title="View Detail"
										>
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.CourseName}</p>
										</button>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.LastAccess}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-1  sm:px-5">
										<div className="flex text-left">
											<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
												{course.Duration}
											</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.StartDate}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.DueDate}</p>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<button className="btn font-bold float-right m-6 text-xs+ text-[#1268B3]" onClick={() => clickHide()}>
					Hide
				</button>
			</td>
		</tr>
	);
};

export default LearningPath;
