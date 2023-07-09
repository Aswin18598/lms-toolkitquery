import { Fragment, useState } from "react";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/account/management/containers/dashboard/components/Pagination";
import { getLoggedUser } from "~/helpers/auth";
import { useGetAuthorTopCoursesQuery } from "../store";

const TopCourses = () => {
	const userDetails = getLoggedUser();
	const [PageNumber, setPageNumber] = useState<number>(1);
	const [PageSize, setPageSize] = useState<number>(10);
	const { isFetching } = useGetAuthorTopCoursesQuery({
		AccountID: userDetails.AccountId,
		PageNumber: PageNumber,
		PageSize: PageSize
	});
	const { TopCourses, TopCoursesMessage } = useAppSelector((state: any) => state.AuthorDashboradReducer);

	return (
		<div className="col-span-12 lg:col-span-6 h-full">
			{isFetching && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px] h-full">
					<Spinner />
				</div>
			)}
			{!isFetching && TopCourses?.topCourses?.length > 0 && (
				<div className="flex flex-col bg-white rounded-lg  border border-gray-200 h-full">
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
									{TopCourses.topCourses.map((item: any, index: number) => (
										<Fragment key={item.index}>
											<tr
												key={index}
												className={`border-y border-transparent border-b-slate-200 dark:border-b-navy-500`}
											>
												<td className="whitespace-wrap px-2 py-4">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{(PageNumber === 1 ? 0 : PageNumber * PageSize - PageSize) +
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
															{item.Launches}
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
						PaginationData={TopCourses}
						count={10}
						pageNumber={PageNumber}
						setPageNumber={setPageNumber}
						pageSize={PageSize}
						setPageSize={setPageSize}
					/>
				</div>
			)}
			{!isFetching && (TopCourses?.topCourses?.length === 0 || TopCourses?.TotalItems === 0) && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px]">
					<p className="text-sm font-dmsans text-[#020A12]/60">{TopCoursesMessage}</p>
				</div>
			)}
		</div>
	);
};

export default TopCourses;
