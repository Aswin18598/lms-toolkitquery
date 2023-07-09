import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import PurchasedList from "./PurchasedList";
import PurchaseHistory from "./PurchaseHistory";
import Subscription from "./Subscription";

const SubscriptionsMenu = ["Purchased", "Purchase History", "Available Subscriptions"];

function SubscriptionsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const categoryMenuTab = +location.search.replace("?", "");

	return (
		<>
			<div className="rounded-lg bg-slate-150 flex px-[6px] w-fit">
				{SubscriptionsMenu.map((menu: any, index: number) => (
					<button
						key={menu}
						onClick={() => {
							navigate(navigateLink.subscriptions + "?" + index);
						}}
						className={`px-[10px] py-[7px] mr-3 text-slate-500 rounded-lg text-[14px] font-bold my-1 ${
							(categoryMenuTab === index || +location.search.replace("?", "")?.split("&")[0] === index) &&
							"bg-white p-4"
						}`}
					>
						{menu}
					</button>
				))}
			</div>
			{categoryMenuTab === 0 && <PurchasedList />}
			{categoryMenuTab === 1 && <PurchaseHistory />}
			{categoryMenuTab === 2 && <Subscription />}
		</>
	);
}

export default SubscriptionsPage;
