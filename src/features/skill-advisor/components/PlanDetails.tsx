import { Icon } from "@iconify/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Price } from "~/components";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { useAddToCartMutation } from "~/features/cart/store";
import { getLoggedUser } from "~/helpers/auth";

import { Page } from "../@types";
import { skillAdvisorAction } from "../store";

const plans = [
	{
		name: "Yearly Plan",
		priceKey: "YearlyAmount",
		description: "Access your custom training plan for one-full year.",
		isPopular: true
	},
	{
		name: "Monthly Plan",
		priceKey: "MonthlyAmount",
		description: "Access your custom training plan for one-full month.",
		isPopular: false
	},
	{
		name: "Quarterly Plan",
		priceKey: "QuarterlyAmount",
		description: "Access your custom training plan for 3-full month.",
		isPopular: false
	}
];

function PlanDetails({ currenctType }: { currenctType: "INR" | "USD" }) {
	const plan: any = useAppSelector((store: any) => store.skillAdvisor.plan);
	const [addToCart] = useAddToCartMutation();
	const [selectedPlan, setSelectedPlan] = React.useState("Yearly");
	const navigate = useNavigate();
	const user = getLoggedUser();

	const buyNow = async () => {
		const subscriptionId = plan[`SID_${selectedPlan.charAt(0)}`];
		const PurchaseType = selectedPlan === "Yearly" ? "Plan" : "Subscription";

		if (user?.UserId) {
			await addToCart({
				subscriptionId,
				PurchaseType,
				BasePlan: plan.SID_Y,
				PPlan: plan.PlanID
			}).unwrap();
			navigate(`/cart`, { replace: true });
		} else {
			// localStorage.setItem("skillAdvisor_item", SubscriptionID);
			navigate(
				`${navigateLink.auth.login}?subscription_id=${subscriptionId}&purchase_type=${PurchaseType}&base_plan=${plan.SID_Y}&plan_id=${plan.PlanID}`,
				{ replace: true }
			);
		}
	};

	return (
		<>
			<div className="flex py-2">
				<button
					onClick={() => dispatch(skillAdvisorAction.setCurrentPage(Page.plan))}
					className="no-underline space-x-1 text-left flex cursor-pointer text-primary"
				>
					<Icon icon="mingcute:arrow-left-line" className="w-5 h-5" />
					<span>Back</span>
				</button>
			</div>
			<div className="flex items-center justify-between gap-3">
				<h3 className="sm:text-lg py-1 font-medium text-black">{plan.Name}</h3>
				<button
					onClick={() => buyNow()}
					className="btn w-40 space-x-1 bg-primary text-white text-xs+ rounded-full hover:opacity-80"
				>
					{user?.UserId && <span>Buy Now</span>}
					{!user?.UserId && <span>Sign In to Buy</span>}
					<Icon icon="mingcute:arrow-right-line" className="w-5 h-5" />
				</button>
			</div>
			<section className="my-5 space-y-1">
				<h2 className="text-lg font-semibold">Choose your plan</h2>
				<ul className="grid gap-3 w-full sm:grid-cols-3">
					{plans.map(pl => (
						<li key={pl.priceKey} className="relative">
							<input
								type="radio"
								id={pl.priceKey}
								name="plan"
								value={pl.priceKey.replace("Amount", "")}
								onChange={(e: any) => setSelectedPlan(e?.target.value)}
								className="peer absolute right-5 top-5 w-5 h-5 bg-primary"
								required
								checked={pl.priceKey.replace("Amount", "") === selectedPlan}
							/>
							<label
								htmlFor={pl.priceKey}
								className="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-primary hover:text-gray-600 hover:bg-slate-100"
							>
								<div className="block space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex-1 w-full space-x-3">
											<span className="text-lg font-semibold">{pl.name}</span>
											{pl.isPopular && (
												<span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 rounded-full text-xs+ py-1 px-2">
													Most Popular
												</span>
											)}
										</div>
									</div>
									<Price currenctType={currenctType} price={plan[pl.priceKey]} />
									<p>{pl.description}</p>
								</div>
							</label>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}

export default PlanDetails;
