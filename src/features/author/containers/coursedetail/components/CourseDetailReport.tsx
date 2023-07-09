import { Fragment, useState } from "react";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/account/management/containers/dashboard/components/Pagination";
import { getLoggedUser } from "~/helpers/auth";
import { useGetCoursesCanCopyQuery } from "../store";

interface Iprops {
	isFetching: any;
	setPageNumber: any;
	setPageSize: any;
	pageNumber: any;
	pageSize: any;
}
const CourseDetailReport = ({ isFetching, setPageNumber, setPageSize, pageNumber, pageSize }: Iprops) => {
	const { CoursesCanCopy, CoursesCanCopyMessage } = useAppSelector((state: any) => state.CourseDetailReducer);

	return (
		<>
			{isFetching && (
				<div className="flex bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px] h-full">
					<Spinner />
				</div>
			)}
			{CoursesCanCopy?.CourseBuilderCopyExistingCourses?.length > 0 && (
				<div className="mt-6 overflow-auto">
					<table className="mb-0.5 is-hoverable w-full text-left">
						<thead className="bg-[#E2E8F0]">
							<tr className="border border-slate-150 font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">S NO</th>
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">COURSE ID</th>
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">TITLE</th>
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">LAST MODIFIED BY</th>
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">LAST MODIFIED DATE</th>
								<th className="whitespace-nowrap px-4 py-3 lg:px-5">STATUS</th>
							</tr>
						</thead>
						<tbody className="bg-[#FFFFFF]">
							{CoursesCanCopy?.CourseBuilderCopyExistingCourses.map((item: any, index: number) => (
								<Fragment key={item.index}>
									<tr key={index} className={"border border-slate-150"}>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 text-sm font-dmsans text-[#020A12]/60">
													{(pageNumber === 1 ? 0 : pageNumber * pageSize - pageSize) +
														index +
														1}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{item?.CourseID}
												</p>
											</div>
										</td>

										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">{item.Title}</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{item.LastModifiedByName}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{item.LastModifiedDate?.split("T")[0]}
												</p>
											</div>
										</td>

										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">{item.StatusID}</p>
											</div>
										</td>
									</tr>
								</Fragment>
							))}
						</tbody>
					</table>
					<Pagination
						PaginationData={CoursesCanCopy}
						count={10}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						pageSize={pageSize}
						setPageSize={setPageSize}
					/>{" "}
				</div>
			)}
			{!isFetching &&
				(CoursesCanCopy?.CourseBuilderCopyExistingCourses?.length === 0 ||
					CoursesCanCopy?.TotalItems === 0) && (
					<div className="flex flex-col items-center mx-auto py-20 bg-white rounded-lg border border-gray-200 text-center items-center justify-center min-h-[100px]">
						<img
							className="h-40 my-auto"
							src="/assets/images/Tiger_images/tiger-logoutX400.png"
							alt={CoursesCanCopyMessage}
						/>
						<p className="text-xs+ text-[#020A12]/60">{CoursesCanCopyMessage}</p>
					</div>
				)}
		</>
	);
};

export default CourseDetailReport;
