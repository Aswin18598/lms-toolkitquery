import { Fragment, PropsWithChildren, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { navigateLink } from "~/config/api/links";
import { useAddToCartMutation } from "~/features/cart/store";
import { useAuth } from "~/router/ProtectedRoute";
import { Slider } from "./components/Slider";

export const getPlanJson = (params: any) => {
	const plan: any = {
		SubscriptionID: params.get("subscription_id"),
		PurchaseType: params.get("purchase_type") || "Plan"
	};
	if (params.has("base_plan")) plan.base_plan = params.get("base_plan");
	if (params.has("plan_id")) plan.plan_id = params.get("plan_id");

	return plan;
};

function AuthLayout({ children }: PropsWithChildren<{}>) {
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	const [queryParams] = useSearchParams();
	const [addToCart] = useAddToCartMutation();

	// useEffect(() => {
	// 	const sId = localStorage.getItem("sessionId");
	// 	if (sId !== "null" && !!sId) navigate(navigateLink.dashboard, { replace: true });
	// 	//eslint-disable-next-line
	// }, []);

	useEffect(() => {
		(async () => {
			const SubscriptionID = queryParams.get("subscription_id");
			if (isLoggedIn) {
				if (queryParams.get("redirect_uri")) {
					window.location.href = queryParams.get("redirect_uri") || "/";
					return;
				}
				if (SubscriptionID) {
					await addToCart(getPlanJson(queryParams));
				}
				SubscriptionID
					? navigate(navigateLink.cart)
					: window.location.replace(window.location.origin + navigateLink.dashboard);
				// navigate(SubscriptionID ? navigateLink.cart : navigateLink.dashboard, {
				// 	replace: true
				// });
			}
		})();
	}, [queryParams]);

	if (isLoggedIn && queryParams.get("subscription_id")) return null;
	const website = import.meta.env.VITE_CMS_WEBSITE_URL;
	return (
		<Fragment>
			<Slider />
			<main className="flex w-full flex-col items-center bg-white dark:bg-navy-700 lg:max-w-5xl overflow-auto">
				{children ? children : <Outlet />}
				<div className="my-5 flex justify-center text-sm text-slate-400 dark:text-navy-300">
					<a href={`${website}/privacy-policy-2/`} target="_blank" rel="noreferrer">
						Privacy Notice
					</a>
					<div className="mx-3 my-1 w-px bg-slate-200 dark:bg-navy-500" />
					<a href={`${website}/terms-of-use/`} target="_blank" rel="noreferrer">
						Term of service
					</a>
				</div>
			</main>
		</Fragment>
	);
}

export default AuthLayout;
