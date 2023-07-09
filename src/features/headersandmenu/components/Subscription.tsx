import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { useGetSubscriptionsQuery } from "~/features/headersandmenu/store";
import { setSelectedSubscriptionsDetailsView } from "~/features/Subscriptions/store";
import { getLoggedUser } from "~/helpers/auth";

const Subscription = () => {
	const { UserId } = getLoggedUser();
	const { isLoading } = useGetSubscriptionsQuery(UserId);
	const { Subscriptions } = useAppSelector((state: any) => state.headersandmenuReducer);
	const [selectedActiveData, SetselectedActiveData] = useState<string[]>([]);
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const navigate = useNavigate();
	const handleShowDetails = () => {
		SetselectedActiveData(Subscriptions?.ActiveSubscriptions);
	};
	useEffect(() => {
		SetselectedActiveData(Subscriptions?.ActiveSubscriptions?.slice(0, 2));
	}, [Subscriptions]);

	const showExpiryDate = (date: any) => {
		const dateformat = new Date(date); // 2009-11-10
		const day = dateformat.getDate();
		const year = dateformat.getFullYear();
		const month = dateformat.toLocaleString("default", { month: "long" });
		return `${day} ${month} ${year}`;
	};

	const handleClick = (SID: number) => {
		dispatch(setSelectedSubscriptionsDetailsView(SID));
		navigate(navigateLink.Subscriptiondetails, { state: { SID: SID } });
	};

	return (
		<div className="w-full h-[90%] pr-4 overflow-x-hidden">
			<div className="w-full flex justify-between">
				<div className="w-[48%] bg-[#F1F5F9] rounded-lg p-3 ">
					<div className="flex justify-between items-center font-bold text-[#334155] text-xl mb-3">
						<div>0{Subscriptions.ActiveCount}</div>
						<div>
							<Icon icon="mingcute:live-photo-fill" width="16" height="16" color="#4FC666" />
						</div>
					</div>
					<div className="text-xl text-[#334155] ">Active</div>
				</div>
				<div className="w-[48%] bg-[#F1F5F9] rounded-lg p-3">
					<div className="flex justify-between items-center font-bold text-[#334155] text-xl mb-3">
						<div>0{Subscriptions.ExpiredCount}</div>
						<div>
							<Icon icon="mingcute:alert-octagon-line" width="16" height="16" color="#FAA41A" />
						</div>
					</div>
					<div className="text-xl text-[#334155] ">Expired</div>
				</div>
			</div>
			<div className="flex items-center space-x-2 mt-3">
				<Icon icon="mingcute:alert-octagon-line" width="16" height="16" color="#FAA41A" />
				<span className="font-bold text-[#334155] text-sm">Expired</span>
			</div>
			{isLoading && <Spinner />}
			{!isLoading &&
				Subscriptions?.ExpiredSubscriptions?.map((ExpiredData: any) => {
					return (
						<div
							className="w-full bg-[#F1F5F9] rounded-lg flex mt-3 cursor-pointer"
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							key={ExpiredData.SalesOrderDetailID}
							onClick={() => handleClick(ExpiredData.SubscriptionID)}
						>
							<div className="w-[30%] flex items-center p-3">
								<img
									src={imageUrl + ExpiredData.Image}
									className="rounded-lg"
									onError={({ currentTarget }) => {
										currentTarget.onerror = null;
										currentTarget.src = "assets/images/user-pic.svg";
									}}
								/>
							</div>
							<div className="w-[70%] p-3 font-bold text-sm ">
								<span className="text-[#334155]">{ExpiredData.SubscriptionName}</span>
								<div className="mt-4 text-[#1268B3]">Renew</div>
							</div>
						</div>
					);
				})}
			<div className="flex items-center justify-between text-sm  mt-3">
				<div className="flex items-center space-x-2">
					<Icon icon="mingcute:live-photo-fill" width="16" height="16" color="#4FC666" />
					<span className="font-bold text-[#334155] ">Active Subscriptions</span>
				</div>
				<div className="text-[#1268B3] cursor-pointer" onClick={handleShowDetails}>
					View All
				</div>
			</div>
			{isLoading && <Spinner />}
			{!isLoading &&
				selectedActiveData?.map((ActiveData: any) => {
					return (
						<div
							className="w-full bg-[#F1F5F9] rounded-lg flex mt-3 cursor-pointer"
							key={ActiveData.SalesOrderDetailID}
							data-bs-dismiss="offcanvas"
							aria-label="Close"
							onClick={() => handleClick(ActiveData.SubscriptionID)}
						>
							<div className="w-[30%] flex items-center p-3">
								<img
									src={imageUrl + ActiveData.Image}
									className="rounded-lg"
									onError={({ currentTarget }) => {
										currentTarget.onerror = null;
										currentTarget.src = "assets/images/user-pic.svg";
									}}
								/>
							</div>
							<div className="w-[70%] p-3 text-sm text-[#334155]">
								<span className="font-bold">{ActiveData.SubscriptionName}</span>
								<div className="mt-4">
									Expires on : {showExpiryDate(ActiveData.ExpireDate.split("T")[0])}
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default Subscription;
