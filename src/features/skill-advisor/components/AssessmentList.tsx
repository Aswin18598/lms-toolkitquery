import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import { useGetAssessmentsListQuery } from "../store";

function AssessmentList() {
	const plan: any = useAppSelector((store: any) => store.skillAdvisor.plan);
	const { data, isLoading } = useGetAssessmentsListQuery({
		CategoryID: plan.SID_Y
	});
	if (isLoading) return <Spinner />;
	if (!data?.Data || data?.Data?.skillAdvisor_Assessments?.length === 0)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<p className="text-xs+ text-[#020A12]/60">{"No Assessments are mapped to this subscription"}</p>
			</div>
		);
	return (
		<div className="card">
			<div className="is-scrollbar-hidden min-w-full overflow-x-auto" x-data="pages.tables.initExample1">
				<table className="is-hoverable w-full text-left">
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
					<tbody>
						{data?.Data?.skillAdvisor_Assessments.map((course: any) => (
							<tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
								<td className="text-center whitespace-nowrap px-4 py-3 sm:px-5">
									{course.AssessmentID}
								</td>
								<td className="whitespace-nowrap px-4 py-3 sm:px-5">{course.Title}</td>
								<td className="text-center whitespace-nowrap px-4 py-3 sm:px-5">
									{course.NumberOfQuestions}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default AssessmentList;
