import { Fragment, useState } from "react";
import { useAppSelector } from "~/config/store";
import { useGetTopAssessmentsQuery } from "../store";
import _ from "lodash";
import Pagination from "./Pagination";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";

const TopAssessment = () => {
	const userDetails = getLoggedUser();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const { isFetching } = useGetTopAssessmentsQuery({
		AccountID: userDetails.AccountId,
		PageNumber: pageNumber,
		PageSize: pageSize
	});
	const { TopAssessments, TopAssessmentsMessage } = useAppSelector((state: any) => state.AdminDashboardReducer);

	return (
		<div className="col-span-12 lg:col-span-6 h-full">
			{isFetching && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px] h-full">
					<Spinner />
				</div>
			)}
			{!isFetching && TopAssessments?.topAssessments?.length > 0 && (
				<div className="flex flex-col justify-between bg-white rounded-t-lg border border-gray-200 h-full">
					<div className="grid-cols-12 grid h-full">
						<div className="col-span-12 h-full">
							<table className="is-hoverable w-full text-left">
								<thead>
									<tr>
										<th className="whitespace-wrap rounded-tl-lg bg-slate-200 px-2 py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											#
										</th>
										<th className="whitespace-wrap bg-slate-200 px-auto py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											TITLE
										</th>
										<th className="whitespace-wrap bg-slate-200 px-2 py-4 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
											LAUNCHES
										</th>
									</tr>
								</thead>
								<tbody>
									{TopAssessments.topAssessments.map((item: any, index: number) => (
										<Fragment key={item.index}>
											<tr
												key={index}
												className={`border-y border-transparent border-b-slate-200 dark:border-b-navy-500`}
											>
												<td className="whitespace-wrap px-2 py-4">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{(pageNumber === 1 ? 0 : pageNumber * pageSize - pageSize) +
																index +
																1}
														</p>
													</div>
												</td>
												<td className="whitespace-wrap px-auto py-4">
													<div className="flex items-center">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.Title}
														</p>
													</div>
												</td>
												<td className="whitespace-wrap px-2 py-4">
													<div className="flex items-center">
														<p className="text-sm font-dmsans text-[#020A12]/60 mx-auto">
															{item.TimesTaken}
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
						PaginationData={TopAssessments}
						count={10}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						pageSize={pageSize}
						setPageSize={setPageSize}
					/>
				</div>
			)}
			{!isFetching && (TopAssessments?.topAssessments?.length === 0 || TopAssessments?.TotalItems === 0) && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px]">
					<p className="text-sm font-dmsans text-[#020A12]/60">{TopAssessmentsMessage}</p>
				</div>
			)}
		</div>
	);
};

export default TopAssessment;
