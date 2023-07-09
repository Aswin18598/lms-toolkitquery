import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { notify } from "~/helpers";
import { ILearningAssignments, ILearningPathItems } from "../@types";
import { assignedLearning, useLearningPathActionsInputMutation } from "../store";
import AssignedLearningTableHeader from "./AssignedLearningTableHeader";

interface IPreDefinedPathItemsTableProps {
	expandedRowIndex: number;
	setExpandedRowIndex: React.Dispatch<any>;
	isLearningPathItemsFetching: boolean;
	isPreDefinedPathFetching: boolean;
	setPathId: React.Dispatch<any>;
	preDefinedPageNumber: number;
	preDefinedPageSize: number;
	setPreDefinedPageNumber: React.Dispatch<React.SetStateAction<number>>;
	setPreDefinedPageSize: React.Dispatch<React.SetStateAction<number>>;
}
function PreDefinedPathItemsTable(props: IPreDefinedPathItemsTableProps) {
	const navigate = useNavigate();
	const [cloneLearningPathActionInput, { isLoading }] = useLearningPathActionsInputMutation();

	const { preDefinedLearningPaths, preDefinedLearningPathsEmptyMessage, learningPathItemsDetails } =
		useAppSelector(assignedLearning);
	const {
		expandedRowIndex,
		setExpandedRowIndex,
		isLearningPathItemsFetching,
		isPreDefinedPathFetching,
		preDefinedPageNumber,
		preDefinedPageSize,
		setPathId,
		setPreDefinedPageNumber,
		setPreDefinedPageSize
	} = props;
	const handleCloneLearningPath = (assignments: ILearningAssignments) => {
		console.log(assignments);
		cloneLearningPathActionInput({
			Action: "CA",
			PathID: assignments.PathID,
			TypeID: assignments.TypeID
		})
			.then((response: any) => {
				if (response?.data?.Output) {
					navigate(`/account/assigned-learning/edit/${response?.data?.Output}`, {
						state: { ...assignments, PathID: parseInt(response?.data?.Output) }
					});
				}
			})
			.catch(error => {
				notify("assignments_clone_error_message", error?.data);
			});
	};
	if (isPreDefinedPathFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isPreDefinedPathFetching && !preDefinedLearningPaths?.PreDefinedLearningPaths?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={preDefinedLearningPathsEmptyMessage}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				{isLoading && (
					<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
						<Spinner />
					</section>
				)}
				<table className="w-full text-left">
					<AssignedLearningTableHeader />
					<tbody className="bg-white">
						{preDefinedLearningPaths?.PreDefinedLearningPaths.map(
							(assignments: ILearningAssignments, i: any) => (
								<Fragment key={i}>
									<tr
										className={`border border-transparent ${
											expandedRowIndex === i ? "border-none" : "border-b-slate-200"
										}  dark:border-b-navy-500`}
									>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{`${
														(preDefinedPageNumber - 1) * preDefinedPageSize + i + 1
													}`.padStart(2, "0")}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.PathID}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.Name}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.CoursesCount}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.AssessmentsCount}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left gap-8 items-center">
												<Tippy content={"Clone"} placement={"bottom"}>
													<div>
														<Icon
															icon={"ri:file-copy-2-line"}
															width={20}
															height={20}
															className={"cursor-pointer"}
															onClick={() => handleCloneLearningPath(assignments)}
														/>
													</div>
												</Tippy>
												<button
													onClick={() => {
														expandedRowIndex === i
															? setExpandedRowIndex(null)
															: setExpandedRowIndex(i);
														setPathId(assignments.PathID);
													}}
													title={expandedRowIndex === i ? "" : "Expand"}
													className={`ac-trigger p-1 rounded-full hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
														expandedRowIndex === i ? "rotate-180" : ""
													} duration-300`}
												>
													<Icon
														icon={"material-symbols:keyboard-arrow-down-rounded"}
														width={25}
														height={25}
													/>
												</button>
											</div>
										</td>
									</tr>
									{expandedRowIndex === i ? (
										<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
											<td colSpan={6} className={"px-4 py-3 sm:pl-5"}>
												{isLearningPathItemsFetching && !learningPathItemsDetails?.length && (
													<Spinner />
												)}
												{assignments?.Description ? (
													<p className="text-sm font-dmsans text-[#020A12]/60 py-3 ">
														{assignments?.Description}
													</p>
												) : null}
												<div className="is-scrollbar-hidden min-w-full overflow-x-auto">
													<table className="w-full text-left">
														<thead>
															<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
																<th className="whitespace-nowrap px-3 py-3 font-normal  w-[5%] text-slate-800 dark:text-navy-100 lg:px-5">
																	Type
																</th>
																<th className="whitespace-nowrap px-3 py-3 font-normal  w-[95%]  text-slate-800 dark:text-navy-100 lg:px-5">
																	Name
																</th>
															</tr>
														</thead>
														<tbody>
															{learningPathItemsDetails?.length > 0 ? (
																learningPathItemsDetails?.map(
																	(pathItem: ILearningPathItems, i: number) => (
																		<tr
																			className="border border-transparent border-b-slate-200 dark:border-b-navy-500"
																			key={i}
																		>
																			<td className="whitespace-nowrap px-4 py-3 sm:px-5">
																				{pathItem?.Type === "Course" ? (
																					<div className="w-fit p-2 bg-[#1268B3]/10 rounded-[3px]">
																						<svg
																							xmlns="http://www.w3.org/2000/svg"
																							className="h-4 w-4 text-primary"
																							viewBox="0 0 24 24"
																						>
																							<g fill="none">
																								<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />

																								<path
																									fill="currentColor"
																									d="M17 2c1.598 0 3 1.3 3 3v13c0 1.7-1.4 3-3 3H6c-1.054 0-2-.95-2-2V4c0-1.054.95-2 2-2h11Zm0 2h-7v15h7c.513 0 1-.39 1-1V5c0-.513-.49-1-1-1ZM8 4H6v15h2V4Z"
																								/>
																							</g>
																						</svg>
																					</div>
																				) : (
																					<div className="w-fit p-2 bg-[#FAA41A]/10 rounded-[3px]">
																						<svg
																							xmlns="http://www.w3.org/2000/svg"
																							className="h-4 w-4 text-[#FAA41A]"
																							fill="none"
																							viewBox="0 0 24 24"
																							stroke="currentColor"
																							stroke-width="2"
																							stroke-linecap="round"
																							stroke-linejoin="round"
																						>
																							<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11"></path>

																							<line
																								x1="9"
																								y1="7"
																								x2="13"
																								y2="7"
																							></line>

																							<line
																								x1="9"
																								y1="11"
																								x2="13"
																								y2="11"
																							></line>
																						</svg>
																					</div>
																				)}
																			</td>
																			<td className="whitespace-nowrap px-4 py-3 sm:px-5">
																				{pathItem?.Name}
																			</td>
																		</tr>
																	)
																)
															) : (
																<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
																	<td
																		colSpan={2}
																		className="whitespace-nowrap px-4 py-3 sm:px-5"
																	>
																		{"No Records Found"}
																	</td>
																</tr>
															)}
															<tr>
																<td
																	className="px-4 py-3 sm:px-5 text-right"
																	colSpan={2}
																>
																	<button
																		className="text-primary text-sm+ font-semibold"
																		onClick={() => setExpandedRowIndex(null)}
																	>
																		Hide
																	</button>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</td>
										</tr>
									) : null}
								</Fragment>
							)
						)}
					</tbody>
				</table>
			</div>
			<Pagination
				PaginationData={{
					TotalItems: preDefinedLearningPaths.TotalItems,
					TotalPages: preDefinedLearningPaths.TotalPages
				}}
				isTableView={true}
				pageNumber={preDefinedPageNumber}
				pageSize={preDefinedPageSize}
				setPageNumber={setPreDefinedPageNumber}
				setPageSize={setPreDefinedPageSize}
			/>
		</>
	);
}

export default PreDefinedPathItemsTable;
