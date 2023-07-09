import { useEffect, useState } from "react";
import Pagination from "./Pagination";

interface IProps {
	CoursesTableData: any;
	pageNumber: number;
	setPageNumber: any;
	pageSize: number;
	setPageSize: any;
}

const SubscriptionsCoursesTable = ({ CoursesTableData, pageSize, setPageSize, pageNumber, setPageNumber }: IProps) => {
	const [Data, setData] = useState<any>({});

	useEffect(() => {
		setData({
			TotalPages: CoursesTableData.CourseTotalPages,
			TotalItems: CoursesTableData.CourseTotalItems
		});
	}, [CoursesTableData]);

	const CourseTableData = () =>
		CoursesTableData.skillAdvisor_Courses.map((data: any) => (
			<tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.CourseID}</p>
					</div>
				</td>
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.Title}</p>
					</div>
				</td>
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.TotalLessons}</p>
					</div>
				</td>
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.OnlineHours}</p>
					</div>
				</td>
			</tr>
		));

	return (
		<>
			{
				<>
					{CoursesTableData?.skillAdvisor_Courses?.length > 0 && !!CourseTableData && (
						<>
							<div
								className="is-scrollbar-hidden min-w-full overflow-x-auto"
								x-data="pages.tables.initExample1"
							>
								<table className="is-hoverable w-full text-left rounded-full">
									<thead>
										<tr>
											<th className="w-14 text-center whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												#
											</th>
											<th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												Title
											</th>
											<th className="w-20 text-center whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												No Of Lessons
											</th>
											<th className="w-20 text-center whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												Learning Time
											</th>
										</tr>
									</thead>
									<tbody className="bg-[#FFFFFF]">
										<CourseTableData />
									</tbody>
								</table>
							</div>
							<Pagination
								PaginationData={Data}
								count={10}
								pageNumber={pageNumber}
								setPageNumber={setPageNumber}
								pageSize={pageSize}
								setPageSize={setPageSize}
							/>
						</>
					)}
					{(CoursesTableData?.skillAdvisor_Courses?.length === 0 ||
						CoursesTableData?.CourseTotalItems === 0) && (
						<>
							<div className="flex flex-col text-center items-center mx-auto py-10">
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt={"No data available for the selected criteria"}
								/>
								<p className="text-xs+ text-[#020A12]/60">
									{"No data available for the selected criteria"}
								</p>
							</div>
						</>
					)}
				</>
			}
		</>
	);
};

export default SubscriptionsCoursesTable;
