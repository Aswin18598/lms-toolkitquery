import { useEffect, useState } from "react";
import Pagination from "./Pagination";

interface IProps {
	AssessmentsTableData: any;
	pageNumber: number;
	setPageNumber: any;
	pageSize: number;
	setPageSize: any;
}

function SubscriptionsAssessmentsTable({
	AssessmentsTableData,
	pageSize,
	setPageSize,
	pageNumber,
	setPageNumber
}: IProps) {
	const [Data, setData] = useState<any>({});

	useEffect(() => {
		setData({
			TotalPages: AssessmentsTableData.AssessmentTotalPages,
			TotalItems: AssessmentsTableData.AssessmentTotalItems
		});
	}, [AssessmentsTableData]);

	const AssesmentTableData = () =>
		AssessmentsTableData.SkillAdvisor_Assessments.map((data: any) => (
			<tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.AssessmentID}</p>
					</div>
				</td>
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.Title}</p>
					</div>
				</td>
				<td className="whitespace-nowrap px-3 py-3 sm:px-5">
					<div className="flex text-left">
						<p className="text-sm font-dmsans text-[#020A12]/60">{data.NumberOfQuestions}</p>
					</div>
				</td>
			</tr>
		));

	return (
		<>
			{
				<>
					{AssessmentsTableData?.SkillAdvisor_Assessments?.length > 0 && !!AssesmentTableData && (
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
												No Of Questions
											</th>
										</tr>
									</thead>
									<tbody className="bg-[#FFFFFF]">
										<AssesmentTableData />
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
					{(AssessmentsTableData?.SkillAdvisor_Assessments?.length === 0 ||
						AssessmentsTableData.AssessmentTotalPages === 0) && (
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
}

export default SubscriptionsAssessmentsTable;
