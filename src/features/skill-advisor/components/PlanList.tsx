import { Icon } from "@iconify/react";
import { Price } from "~/components";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import { State } from "../@types";
import { skillAdvisorAction, useGetSubscriptionsListQuery } from "../store";

function PlanList({ currenctType }: { currenctType: "INR" | "USD" }) {
	const SkillAdvisor: State = useAppSelector((store: any) => store.skillAdvisor);
	const plan = useGetSubscriptionsListQuery(SkillAdvisor.filterValues);
	if (plan.isLoading) {
		return (
			<div className="grid h-full place-content-center">
				<Spinner />
			</div>
		);
	}
	if (!plan.data?.Data) {
		return (
			<div className="grid h-full place-items-center place-content-center">
				<img src="/tiger-thinking-1.png" alt="" width={300} />
				<span className="text-xl">No plans exist for selected role or software</span>
			</div>
		);
	}
	return (
		<>
			<p className="text-lg sm:text-xl">Simplified and straight to the point subscriptions created for you.</p>
			<section className="flex flex-col gap-5 rounded-md my-4">
				{plan.data?.Data.map((plan: any) => (
					<button
						onClick={() => dispatch(skillAdvisorAction.setDetailsPage(plan))}
						key={plan.PlanID}
						className="group bg-white p-3 rounded-md border border-gray-200 flex flex-col sm:items-center sm:flex-row justify-between space-x-3"
					>
						<div className="flex sm:items-center gap-3">
							<div className="relative flex mt-1 sm:m-0">
								<img
									className="w-16 h-16 origin-center object-cover rounded"
									src={
										`${import.meta.env.VITE_APP_IMG_URL}${plan.ImageLocation}` ||
										"/assets/images/continue-learning.png"
									}
									alt="img"
								/>
							</div>
							<div className="flex flex-col flex-1 gap-1">
								<div className="flex items-center space-x-1">
									<p className="flex-1 sm:text-lg text-left font-medium text-slate-600 line-clamp-1 dark:text-navy-100">
										{plan.Name}
									</p>
								</div>
								<div className="flex flex-col gap-2 w-full text-sm sm:gap-5 sm:flex-row">
									<div className="flex items-center space-x-2">
										<span className="btn h-7 w-7 rounded-full bg-info/10 p-0 font-medium text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
											<Icon icon="mingcute:notebook-line" className="w-4 h-4" />
										</span>
										<span>{plan.CourseCount} Courses</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="btn h-7 w-7 rounded-full bg-info/10 p-0 font-medium text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
											<Icon icon="mingcute:paper-line" className="w-4 h-4" />
										</span>
										<span>{plan.AssessmentCount} Assessments</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="btn h-7 w-7 rounded-full bg-info/10 p-0 font-medium text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
											<Icon icon="mingcute:time-line" className="w-4 h-4" />
										</span>
										<span>{plan.OnlineHours} Learning time</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex space-x-5 pt-1">
							<span className="flex">
								<Price currenctType={currenctType} price={plan.YearlyAmount} />
								<sub className="relative top-2 text-xs+">/year</sub>
							</span>
							<div className="btn h-7 w-7 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80">
								<Icon icon="mingcute:arrow-right-line" className="w-4 h-4 -rotate-45" />
							</div>
						</div>
					</button>
				))}
			</section>
		</>
	);
}

export default PlanList;
