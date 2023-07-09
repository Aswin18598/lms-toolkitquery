import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import { ViewSearchDocument } from "~/helpers/RedirectLink";
import { HandlePageNumber, HandlePageSize } from "../store";
import Pagination from "./Pagination";

interface IProps {
	APIFetching: boolean;
	SearchTableData: any[];
	APIResultCount: number;
}

function SearchTableView({ SearchTableData, APIFetching, APIResultCount }: IProps) {
	const imageUrl = import.meta.env.VITE_MENU_ICONS_IMG_URL + "images/search/";
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "").replace("s", "S") + location.search;
	const { PageNumber, PageSize } = useAppSelector((state: any) => state.searchReducer);
	const [pageNumber, setPageNumber] = useState<number>(PageNumber);
	const [pageSize, setPageSize] = useState<number>(PageSize);
	const PaginationData = {
		TotalItems: APIResultCount,
		TotalPages: Math.ceil(APIResultCount / pageSize)
	};

	useEffect(() => {
		dispatch(HandlePageNumber(pageNumber));
		dispatch(HandlePageSize(+pageSize));
	}, [pageNumber, pageSize]);

	function setTypeImage(DocData: any) {
		var docTypeImage = "";
		if (+DocData.docTypeID === 1) {
			docTypeImage = imageUrl + "page-introduction-incomplete.png";
		} else if (+DocData.docTypeID === 2) {
			if (+DocData.docTemplateID === 1) docTypeImage = imageUrl + "page-lesson-incomplete.png";
			else docTypeImage = imageUrl + "page-incomplete.png";
		} else if (+DocData.docTypeID === 3) {
			docTypeImage = imageUrl + "page-project-incomplete.png";
		} else if (+DocData.docTypeID === 4) {
			docTypeImage = imageUrl + "page-procedure-incomplete.png";
		} else if (+DocData.docTypeID === 10) {
			docTypeImage = imageUrl + "course-incomplete.png";
		} else docTypeImage = imageUrl + "page-quiz-incomplete.png";

		if (DocData.viewed) {
			docTypeImage = docTypeImage.replace(/incomplete/g, "complete");
		}
		return docTypeImage;
	}

	return (
		<div className="col-span-12 lg:col-span-6">
			{APIFetching && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center h-40">
					<Spinner />
				</div>
			)}

			{!APIFetching && SearchTableData.length > 0 && (
				<div className="flex flex-col justify-between bg-white rounded-lg border border-gray-200">
					<div className="grid-cols-12 grid">
						<div className="col-span-12">
							<table className="is-hoverable w-full text-left">
								<thead>
									<tr>
										{/* <th className="whitespace-wrap rounded-tl-lg bg-slate-200 px-4 py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											#
										</th> */}
										<th className="whitespace-wrap bg-slate-200 px-4 py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											TYPE
										</th>
										<th className="whitespace-wrap bg-slate-200 px-auto py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											TITLE
										</th>
										<th className="whitespace-wrap rounded-tr-lg bg-slate-200 px-2 py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											CATEGORY
										</th>
									</tr>
								</thead>
								<tbody>
									{SearchTableData.map((item: any, index: number) => (
										<Fragment key={index}>
											<tr
												key={index}
												className={`border-y border-transparent border-b-slate-200 dark:border-b-navy-500`}
											>
												{/* <td className="whitespace-wrap px-4 py-4">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{(pageNumber === 1 ? 0 : pageNumber * pageSize - pageSize) +
																index +
																1}
														</p>
													</div>
												</td> */}
												<td className="whitespace-wrap px-4 py-4">
													<div className="flex items-center">
														<img src={setTypeImage(item)} alt="Type" />
													</div>
												</td>
												<td className="whitespace-wrap px-auto py-4">
													<button
														className="flex items-center"
														onClick={() =>
															window.location.replace(
																ViewSearchDocument(
																	item.docID,
																	item.docTypeID,
																	locationEndPoint
																)
															)
														}
														title="View Detail"
													>
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.title}
														</p>
													</button>
												</td>
												<td className="whitespace-wrap px-2 py-4">
													<div className="flex items-center">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.subcategoryName}
														</p>
													</div>
												</td>
											</tr>
										</Fragment>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<Pagination
						PaginationData={PaginationData}
						count={10}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						pageSize={pageSize}
						setPageSize={setPageSize}
					/>
				</div>
			)}

			{!APIFetching && SearchTableData.length === 0 && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px]">
					<p className="text-sm font-dmsans text-[#020A12]/60">
						{"No Data Available for the Selected criteria"}
					</p>
				</div>
			)}
		</div>
	);
}

export default SearchTableView;
