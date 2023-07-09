import { useEffect } from "react";
import { Modal, Price } from "~/components";
import { dispatch, useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { selectPlan, toggleSelectPlan, useSelectPlanQuery } from "../store";

function SelectPlan() {
	const user = getLoggedUser();
	const { selectedCart } = useAppSelector((state: any) => state.cartReducer);
	const { isLoading, isFetching, data, refetch } = useSelectPlanQuery({
		SubscriptionID: selectedCart.SubscriptionID,
		CourseType: "Essentials"
	});

	useEffect(() => {
		refetch();
		// eslint-disable-next-line
	}, [selectedCart]);

	return (
		<Modal
			title={
				<div className="flex items-center gap-2 font-semibold text-sm+">
					<h1>Select Plan</h1>
					<span className="bg-gray-200 w-1.5 h-1.5 rounded-full" />
					<p className="font-medium text-sm">{selectedCart.Title}</p>
				</div>
			}
			className="max-w-2xl"
			onCancel={() => dispatch(toggleSelectPlan(undefined))}
		>
			<section className="flex flex-col gap-4 px-5 pt-5 pb-5">
				{(isLoading || isFetching) &&
					[1, 2, 3].map(key => (
						<div key={key} className="flex w-full h-20">
							<div className="flex items-center justify-betweeen p-4 gap-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200">
								<div className="flex flex-col flex-1 space-y-2 w-5/6">
									<div className="skeleton animate-wave h-3 w-3/6 rounded bg-slate-150 dark:bg-navy-500" />
									<div className="skeleton animate-wave h-3 w-full rounded bg-slate-150 dark:bg-navy-500" />
								</div>
								<div className="skeleton animate-wave h-3 w-1/6 rounded bg-slate-150 dark:bg-navy-500" />
							</div>
						</div>
					))}
				{!isLoading &&
					!isFetching &&
					data?.Data.map((plan: any) => (
						<div key={plan.Name} className="flex w-full">
							<label className="flex items-center justify-betweeen p-4 gap-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/20 hover:border-primary hover:bg-primary/20">
								<input
									onChange={() => dispatch(selectPlan(plan))}
									type="radio"
									name="plan"
									value={plan.Name}
									className="hidden peer"
								/>
								<div className="flex flex-col gap-1 flex-1">
									<h1 className="flex items-center gap-3 font-medium text-primary">
										<span>{plan.Name}</span>
										<span className="hidden rounded-full px-2.5 py-1 text-xs font-normal bg-primary text-white">
											Most Popular
										</span>
									</h1>
									<p>{plan.PlanDesc}</p>
								</div>
								<p className="font-medium space-x-0.5 text-primary">
									<Price price={plan[user?.Currency]} />
								</p>
							</label>
						</div>
					))}
				<section className="flex items-center justify-end mt-2">
					<div className="flex text-right gap-2">
						<button
							onClick={() => dispatch(toggleSelectPlan(undefined))}
							className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:active:bg-navy-300/25"
						>
							Cancel
						</button>
						<button className="btn h-8 rounded-full bg-primary text-xs+ font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
							Add to Cart
						</button>
					</div>
				</section>
			</section>
		</Modal>
	);
}

export default SelectPlan;
