import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import { setSelectedPageNumber, setSelectedPageSize, useGetTranscriptAssessmentHistoryQuery } from "../store";
import AssessmentHistoryChild from "./AssessmentHistoryChild";
import _ from "lodash";
import { getLoggedUser } from "~/helpers/auth";
import Pagination from "./Pagination";

const AssessmentHistory = () => {
	const { UserId } = getLoggedUser();
	const [expanded, setCollapseExpanded] = useState<Map<string, boolean>>(new Map<string, boolean>());
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const { PageNumber, PageSize } = useAppSelector((state: any) => state.TranscriptReducer);
	const { isFetching, refetch } = useGetTranscriptAssessmentHistoryQuery({
		UserID: UserId,
		CategoryID: -1,
		PageNumber: PageNumber,
		PageSize: PageSize
	});
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const { TranscriptAssessmentHistory, TranscriptAssessmentHistoryMessage } = useAppSelector(
		(state: any) => state.TranscriptReducer
	);

	useEffect(() => {
		dispatch(setSelectedPageNumber(pageNumber));
		dispatch(setSelectedPageSize(pageSize));
		setTimeout(() => {
			refetch();
		}, 500);
	}, [pageNumber, pageSize]);

	const toggleCollapse = (index: string) => {
		const localMap = new Map<string, boolean>();
		if (!expanded.has(index)) {
			localMap.set(index, true);
		}
		setCollapseExpanded(localMap);
	};
	const clickHide = () => {
		const localMap = new Map<string, boolean>();
		setCollapseExpanded(localMap);
	};
	function rotateCollapse180(index: string): string {
		if (expanded.has(index)) {
			return "-rotate-180";
		}
		return "";
	}
	return (
		<>
			{isFetching && (
				<div className="mx-auto my-12">
					<Spinner />
				</div>
			)}
			{!isFetching &&
				(TranscriptAssessmentHistory?.transcriptAssessmmentHistoryParents.length > 0 ? (
					<>
						<div className="col-span-12 overflow-x-auto bg-white rounded-lg mt-6 border">
							<table className="is-hoverable w-full text-left">
								<thead>
									<tr className="bg-[#E2E8F0] font-inter font-medium text-sm text-[#020A12]/60 rounded-tl-lg">
										<th className=" px-4 py-3 lg:px-5">#</th>
										<th className=" px-4 py-3 lg:px-5">LOGO</th>
										<th className=" px-4 py-3 lg:px-5">CATEGORY</th>
										<th className=" px-4 py-3 lg:px-5">POINTS EARNED</th>
										<th className=" px-1 lg:px-5"></th>
									</tr>
								</thead>
								<tbody>
									{TranscriptAssessmentHistory?.transcriptAssessmmentHistoryParents.map(
										(item: any, index: string) => (
											<Fragment>
												<tr className="border-transparent border-b-slate-200">
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className=" text-sm font-dmsans text-[#020A12]/60">
																{index + 1}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<img
																className="h-10"
																src={
																	item.CategoryImageFileName
																		? imageUrl + item.CategoryImageFileName
																		: "/assets/images/image 95.png"
																}
																alt="assessment logo"
																onError={({ currentTarget }) => {
																	currentTarget.onerror = null;
																	currentTarget.src = "assets/images/image 95.png";
																}}
															/>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.CategoryName}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.SubTotalEndPoints}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap">
														<button
															className="btn"
															onClick={(): void => toggleCollapse(index + 1)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className={`h-4.5 w-4.5 text-sm font-dmsans text-[#020A12]/60   ${rotateCollapse180(
																	index + 1
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
													</td>
												</tr>
												{expanded.get(index + 1) && (
													<AssessmentHistoryChild
														clickHide={clickHide}
														assessmentDetails={item.TranscriptAssessmmentHistoryChildren}
													/>
												)}
											</Fragment>
										)
									)}
								</tbody>
							</table>
						</div>
						{TranscriptAssessmentHistory?.TotalPages > 0 && (
							<Pagination
								PaginationData={TranscriptAssessmentHistory}
								pageNumber={pageNumber}
								setPageNumber={setPageNumber}
								pageSize={pageSize}
								setPageSize={setPageSize}
							/>
						)}
					</>
				) : (
					<>
						<div className="flex flex-col text-center items-center mx-auto py-12">
							<img
								className="h-40 my-auto"
								src="assets/images/Tiger_images/tiger-logoutX400.png"
								alt={TranscriptAssessmentHistoryMessage}
							/>
							<p className="text-xs+ text-[#020A12]/60">{TranscriptAssessmentHistoryMessage}</p>
						</div>
					</>
				))}
		</>
	);
};

export default AssessmentHistory;
