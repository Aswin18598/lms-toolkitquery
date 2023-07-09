import { Spinner } from "~/components/spinner";
import RoleDashboard from "./layout/RoleDashboard";
import BasicDashboard from "./layout/BasicDashboard";
import { useUserIsSubscribedQuery } from "~/config/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAddToCartMutation } from "../cart/store";
import { useEffect } from "react";
import { navigateLink } from "~/config/api/links";
import { getPlanJson } from "~/layout/auth";
import { checkIsB2B } from "~/helpers/auth";

function DashboardPage() {
	const navigate = useNavigate();
	const [queryParams] = useSearchParams();
	const [addToCart, addToCartOption] = useAddToCartMutation();
	const { data: isUserSubscribed, isLoading, isError } = useUserIsSubscribedQuery();

	useEffect(() => {
		(async () => {
			if (queryParams.get("redirect_uri")) {
				window.location.href = queryParams.get("redirect_uri") || "/";
				return;
			}
			if (queryParams.has("subscription_id")) {
				await addToCart(getPlanJson(queryParams));
				navigate(navigateLink.cart);
			}
		})();
	}, [queryParams]);

	if (isLoading || isError || addToCartOption.isLoading)
		return (
			<section className="flex flex-col w-full h-full items-center justify-center">
				{(isLoading || addToCartOption) && (
					<div className="mx-auto my-auto">
						<Spinner />
					</div>
				)}
				{!isLoading || (isError && <span className="mx-auto my-auto">Error fetching dashboard</span>)}
			</section>
		);
	return isUserSubscribed || checkIsB2B() ? <RoleDashboard /> : <BasicDashboard />;
}

export default DashboardPage;
