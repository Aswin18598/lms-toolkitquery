import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";
import { dispatch, useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { useAddToCartMutation, useCartListQuery } from "~/features/cart/store/query";
import { Spinner } from "~/components/spinner";
import { useEffect } from "react";
import {
	setSelectedSubscription,
	setSelectedSubscriptionsDetailsView,
	useGetSubscriptionsDetailsQuery
} from "../store";
interface Iprops {
	setLoader: any;
	loader: any;
	AvailableData: any;
}
function AvailableSubscriptions({ setLoader, loader, AvailableData }: Iprops): JSX.Element {
	const { UserId, Currency } = getLoggedUser();
	const navigate = useNavigate();
	useGetSubscriptionsDetailsQuery(UserId);
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const { AvailableSubscription, SearchText, SubscriptionsDetails } = useAppSelector(
		(state: any) => state.userSubscriptionsReducer
	);
	// const AvailableData = useGetAvailableSubscriptionQuery({ CountryCode: "IN", CategoryID: CatagoryID });
	const { cartItems } = useAppSelector((state: any) => state.cartReducer);
	const [addCart] = useAddToCartMutation();
	const { refetch } = useCartListQuery();

	const addToCart = async (id: string) => {
		await addCart({ subscriptionId: id, PurchaseType: "Subscription" }).unwrap();
		AvailableData.refetch();
		refetch();
	};

	const checkItemAddedToCart = (subscriptionID: string): boolean => {
		return cartItems.filter((item: any) => item.SubscriptionID === subscriptionID).length > 0;
	};

	useEffect(() => {
		setLoader(false);
	}, [AvailableData.refetch]);

	useEffect(() => {
		setLoader(false);
	}, [AvailableSubscription]);

	useEffect(() => {
		setLoader(AvailableData.isLoading);
	}, [AvailableData.isLoading]);

	const specificSubscriptiondetails = (Subscriptiondetails: any) => {
		dispatch(setSelectedSubscriptionsDetailsView(Subscriptiondetails.SID));
		navigate(navigateLink.Subscriptiondetails, { state: { SID: Subscriptiondetails.SID } });
	};

	const checkItemAlreadyPurchased = (subscriptionID: number): boolean => {
		return (
			SubscriptionsDetails?.filter((item: any) => item.SubscriptionID === subscriptionID.toString()).length > 0
		);
	};
	useEffect(() => {
		if (SearchText !== "") {
			const SubscriptionDatas = AvailableSubscription?.filter((subscription: any) => {
				if (subscription.Name.toLowerCase().includes(SearchText.toLowerCase())) {
					return subscription.Name.toLowerCase().includes(SearchText.toLowerCase());
				}
			});
			dispatch(setSelectedSubscription(SubscriptionDatas));
		} else {
			AvailableData.refetch();
		}
	}, [SearchText]);

	return (
		<>
			{loader && <Spinner />}
			{!loader &&
				(AvailableSubscription?.length > 0 ? (
					<div className="grid grid-cols-2 justify-items-stretch lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{AvailableSubscription?.map((item: any, index: number) => (
							<div
								key={index}
								className={`bg-white px-5 py-5 border border-gray-200  rounded-lg  keen-slider__slide number-slide${index} `}
							>
								<img
									className="h-10"
									src={
										item.ImageLocation
											? imageUrl + item.ImageLocation
											: "assets/images/user-pic.svg"
									}
									alt="icon"
									onError={({ currentTarget }) => {
										currentTarget.onerror = null;
										currentTarget.src = "assets/images/user-pic.svg";
									}}
								/>
								<div
									className="mt-3 h-12  text-base font-medium line-clamp-2 text-slate-600 dark:text-navy-100 max-w-[240px] cursor-pointer"
									onClick={() => specificSubscriptiondetails(item)}
									title="View Detail"
								>
									{item.Name}
								</div>
								<div className="mt-4 text-xs+ space-x-2 dark:text-navy-300">
									{item.CourseCount} courses
								</div>
								<div className="mt-12 after:content-[\u0BF9]">
									<span className="text-[18px] text-primary font-bold leading-[23px] ">
										{Currency === "USD" ? "\u0024" : "\u20B9"}
										{item.Price}
									</span>
									/per user
								</div>
								{checkItemAlreadyPurchased(item.SID) ? (
									<button className="btn bg-[#EDF3F9] font-medium text-primary  hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-full mt-6 py-3">
										Purchased
									</button>
								) : !checkItemAddedToCart(item.SID) ? (
									<button
										onClick={() => addToCart(item.SID)}
										className="btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-full mt-6 py-3"
									>
										<svg
											width="17"
											height="17"
											viewBox="0 0 17 17"
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
										className="btn bg-[#EDF3F9] font-medium text-primary  hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-full mt-6 py-3"
									>
										View Cart
									</button>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col text-center items-center mx-auto py-10">
						<img
							className="h-40 my-auto"
							src="assets/images/Tiger_images/tiger-logoutX400.png"
							alt="No record found"
						/>
						<p className="text-xs+ text-[#020A12]/60">No subscription exists for the given criteria</p>
					</div>
				))}
		</>
	);
}

export default AvailableSubscriptions;
