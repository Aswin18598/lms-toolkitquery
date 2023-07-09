import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SubscriptionsPage from "./components/SubscriptionsPage";
import { navigateLink } from "~/config/api/links";
import SubscriptionDetails from "./components/SubscriptionDetails";

function Subscriptions() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.pathname === "/subscriptions" && !location.search.includes("?")) {
			navigate("/subscriptions?0");
		}
	}, [location]);

	const detailViewPage = location.search?.split("&")[1];

	return (
		<section id="Subscriptions" className="main w-full px-[var(--margin-x)] mt-8 flex flex-col">
			<div className="flex items-start w-full space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-bold text-slate-800 dark:text-navy-50 lg:text-2xl">Subscriptions</h2>
			</div>
			<SubscriptionsPage />
			{detailViewPage === navigateLink.Subscriptiondetails?.split("&")[1] && <SubscriptionDetails />}
		</section>
	);
}

export default Subscriptions;
