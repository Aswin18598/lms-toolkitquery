import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { useAddToCartMutation, useCartListQuery } from "~/features/cart/store";
import { getLoggedUser } from "~/helpers/auth";
import { setSelectedSubscriptionsDetailsView, useGetSubscriptionDetailViewQuery } from "../store";
import SubscriptionsAssessmentsTable from "./SubscriptionsAssessmentsTable";
import SubscriptionsCoursesTable from "./SubscriptionsCoursesTable";

const SubscriptionDetails = () => {
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const location = useLocation();
	const navigate = useNavigate();
	const UserDetail = getLoggedUser();
	const { SubscriptionsDetailsView } = useAppSelector((state: any) => state.userSubscriptionsReducer);
	const SubscriptionsDetailsViewData = useGetSubscriptionDetailViewQuery({
		SubscriptionID: location.state.SID || SubscriptionsDetailsView,
		UserID: UserDetail.UserId,
		PageNumber: pageNumber,
		PageSize: pageSize
	});
	dispatch(setSelectedSubscriptionsDetailsView(location.state.SID));
	const details = ["Course", "Assessment"];
	const [selectedCatalog, setSelectedCatalog] = useState(details[0]);
	const { cartItems } = useAppSelector((state: any) => state.cartReducer);
	const [addCart] = useAddToCartMutation();
	const { refetch } = useCartListQuery();
	const checkItemAddedToCart = (subscriptionID: string): boolean => {
		return cartItems.filter((item: any) => item.SubscriptionID === subscriptionID).length > 0;
	};
	const addToCart = async (id: string) => {
		await addCart({ subscriptionId: id, PurchaseType: "Subscription" }).unwrap();
		refetch();
	};

	useEffect(() => {
		SubscriptionsDetailsViewData.refetch();
	}, [pageNumber, pageSize]);

	return (
		<>
			{SubscriptionsDetailsViewData.isFetching && (
				<div className="mx-auto my-40">
					<Spinner />
				</div>
			)}
			{!SubscriptionsDetailsViewData.isFetching && (
				<>
					<div className="flex mt-6">
						<div className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"></div>

						<div className="text-xs+ space-x-2 text-[#020A12]/54 font-bold">Subscriptions</div>

						<span>
							<Icon icon="ic:baseline-keyboard-arrow-right" width="16" height="16" />
						</span>
						<span className="text-xs+ space-x-2 text-[#020A12]/54 font-bold">
							{SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.Name}
						</span>
					</div>
					<div className="justify-between bg-[#fff] rounded-lg min-h-44 mt-6 p-5 flex lg:flex-row flex-col mb-3">
						<div
							className={`flex items-center justify-center relative lg:aspect-[2/1] lg:w-2/12 m-auto h-fit rounded-lg`}
						>
							<img
								src={
									imageUrl + SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.Image
								}
								alt={SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.Name}
								className="w-full h-full object-contain aspect-[2/1]"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = "assets/images/user-pic.svg";
								}}
							/>
						</div>
						<div className="flex flex-col justify-start mx-5 lg:w-8/12">
							<div className="font-bold text-xl mb-1 leading-1">
								{SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.Name}
							</div>
							<div className="font-normal text-sx+">
								{SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.Desc}
							</div>
						</div>
						<div className="flex justify-center mt-2 lg:m-auto lg:w-2/12 m-auto">
							{SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.SubscriptionStatus !==
								"Active" &&
								(!checkItemAddedToCart(
									SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.SID
								) ? (
									<button
										className="btn items-center bg-[#1268B3] text-[#FFFFFF] w-54 h-14"
										onClick={() =>
											addToCart(
												SubscriptionsDetailsViewData.data?.Data?.skillAdvisor_Subscription?.SID
											)
										}
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M6.50032 14.6673C6.96056 14.6673 7.33366 15.0404 7.33366 15.5007C7.33366 15.9609 6.96056 16.334 6.50032 16.334C6.04009 16.334 5.66699 15.9609 5.66699 15.5007C5.66699 15.0404 6.04009 14.6673 6.50032 14.6673ZM12.3337 14.6673C12.7939 14.6673 13.167 15.0404 13.167 15.5007C13.167 15.9609 12.7939 16.334 12.3337 16.334C11.8734 16.334 11.5003 15.9609 11.5003 15.5007C11.5003 15.0404 11.8734 14.6673 12.3337 14.6673ZM1.91285 0.193176L2.00037 0.2507L3.4235 1.31804C3.66719 1.50081 3.85473 1.74575 3.96798 2.02498L4.01832 2.16732H14.723C15.6837 2.16732 16.4361 2.97426 16.3877 3.91702L16.3768 4.04071L15.996 7.0869C15.7595 8.979 14.2717 10.4604 12.3964 10.7024L12.2076 10.7224L6.1137 11.2302L6.32997 12.1674H13.5837C14.0439 12.1674 14.4171 12.5405 14.4171 13.0007C14.4171 13.428 14.0953 13.7803 13.6809 13.8285L13.5837 13.8341H6.32997C5.59953 13.8341 4.96007 13.3595 4.74188 12.6732L4.70598 12.5422L2.4235 2.65138L1.00037 1.58403C0.632183 1.30789 0.557566 0.785559 0.833708 0.417367C1.06737 0.10582 1.47729 0.00446615 1.82095 0.147948L1.91285 0.193176ZM14.723 3.83398H4.40688L5.73503 9.58932L12.0692 9.06148C13.2473 8.96332 14.1956 8.05332 14.3422 6.88023L14.723 3.83398Z"
												fill="white"
											/>
										</svg>
										<span className="ml-1">Add to Cart</span>
									</button>
								) : (
									<button
										onClick={() => navigate(navigateLink.cart)}
										className="btn items-center bg-[#EDF3F9] text-[#1268B3] w-54 h-14"
									>
										View Cart
									</button>
								))}
						</div>
					</div>
					<div className="rounded-lg bg-slate-150 flex px-[6px] w-fit">
						{details.map((menu: any) => (
							<button
								key={menu}
								onClick={() => {
									setSelectedCatalog(menu);
									setPageNumber(1);
									setPageSize(10);
								}}
								className={`px-[10px] py-[7px] mr-3 text-slate-500 rounded-lg text-[14px] font-bold my-1 ${
									selectedCatalog === menu && "bg-white p-4"
								}`}
							>
								{menu}
							</button>
						))}
					</div>
					<div className="flex gap-4 my-6 flex-col justify-center">
						{(selectedCatalog === details[0] && (
							<SubscriptionsCoursesTable
								CoursesTableData={SubscriptionsDetailsViewData.data?.Data}
								pageNumber={pageNumber}
								setPageNumber={setPageNumber}
								pageSize={pageSize}
								setPageSize={setPageSize}
							/>
						)) ||
							(selectedCatalog === details[1] && (
								<SubscriptionsAssessmentsTable
									AssessmentsTableData={SubscriptionsDetailsViewData.data?.Data}
									pageNumber={pageNumber}
									setPageNumber={setPageNumber}
									pageSize={pageSize}
									setPageSize={setPageSize}
								/>
							))}
					</div>
				</>
			)}
		</>
	);
};

export default SubscriptionDetails;
