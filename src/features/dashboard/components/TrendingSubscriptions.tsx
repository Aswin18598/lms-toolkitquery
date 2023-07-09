import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { useCartListQuery, useAddToCartMutation } from "../../cart/store";
import { useTrendingSubscriptionByCurrencyCodeQuery } from "~/features/dashboard/store";
import { useGetSubscriptionsDetailsQuery } from "~/features/Subscriptions/store/query";
import { Icon } from "@iconify/react";
import { Spinner } from "~/components/spinner";

interface IProps {
	userId?: string;
	currency?: string;
	isB2C?: boolean;
}

const ResizePlugin = (slider: any) => {
	const observer = new ResizeObserver(function () {
		slider.update();
	});

	slider.on("created", () => {
		observer.observe(slider.container);
	});
	slider.on("destroyed", () => {
		observer.unobserve(slider.container);
	});
};
const TrendingSubscriptions = ({ userId, currency, isB2C }: IProps) => {
	const navigate = useNavigate();
	const [currentSlide, setCurrentSlide] = useState(0);
	const { isLoading } = useTrendingSubscriptionByCurrencyCodeQuery(currency);
	useGetSubscriptionsDetailsQuery(userId);
	const { SubscriptionsDetails } = useAppSelector((state: any) => state.userSubscriptionsReducer);
	const [addCart] = useAddToCartMutation();
	const { trendingSubscription } = useAppSelector((state: any) => state.dashboard);
	const { cartItems } = useAppSelector((state: any) => state.cartReducer);
	const { refetch } = useCartListQuery();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
		{
			initial: 1,
			loop: false,
			slideChanged(s) {
				setCurrentSlide(s.track.details.rel);
			},
			breakpoints: {
				"(min-width: 400px)": {
					slides: { perView: 2, spacing: 24 }
				},
				"(min-width: 992px)": {
					slides: { perView: 3, spacing: 24 }
				},
				"(min-width: 1200px)": {
					slides: { perView: 4, spacing: 24 }
				},
				"(min-width: 1500px)": {
					slides: { perView: 5, spacing: 24 }
				}
			}
		},
		[ResizePlugin]
	);

	const addToCart = async (id: string) => {
		await addCart({ subscriptionId: id, PurchaseType: "Subscription" }).unwrap();
		refetch();
	};

	const checkItemAddedToCart = (subscriptionID: string): boolean => {
		return cartItems.filter((item: any) => item.SubscriptionID === subscriptionID).length > 0;
	};

	const checkItemAlreadyPurchased = (subscriptionID: number): boolean => {
		return (
			SubscriptionsDetails?.filter((item: any) => item.SubscriptionID === subscriptionID.toString()).length > 0
		);
	};

	return (
		<>
			{/* // (user.AccountTypeID !== "2" && (user.UserTypeID === "1" || user.UserTypeID === "2")) || */}
			<div className="w-full">
				<div className="flex items-center justify-between space-x-4 py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
						Trending Subscriptions
					</h2>
					<h2
						className="text-[#1268B3] cursor-pointer"
						onClick={() => navigate(navigateLink.subscriptions + "?" + 2)}
					>
						View All
					</h2>
				</div>
				<div className="relative">
					<div className="flex keen-slider overflow-hidden w-full" ref={sliderRef}>
						{isLoading && <Spinner />}
						{!isLoading &&
							trendingSubscription.map((item: any, index: number) => (
								<div
									key={index}
									className={`bg-white px-5 py-5 border border-gray-200 cursor-pointer rounded-lg  keen-slider__slide number-slide${index} `}
								>
									<img
										className="h-12"
										src={item.Image ? imageUrl + item.Image : "assets/images/user-pic.svg"}
										alt="icon"
										onError={({ currentTarget }) => {
											currentTarget.onerror = null;
											currentTarget.src = "assets/images/user-pic.svg";
										}}
									/>
									<div
										className="mt-3 h-12  text-base font-medium line-clamp-2 text-slate-600 dark:text-navy-100 max-w-[240px]"
										onClick={() =>
											navigate(navigateLink.Subscriptiondetails, {
												state: { SID: item.SubscriptionID }
											})
										}
										title="View Detail"
									>
										{item.SubscriptionName}
									</div>
									<div className="mt-4 text-xs+ space-x-2 dark:text-navy-300">
										{item.CourseCount} courses
									</div>
									<div className="mt-12 after:content-[\u0BF9]">
										<span className="text-[18px] text-primary font-bold leading-[23px] ">
											{currency === "USD" ? "\u0024" : "\u20B9"}
											{item.Price}
										</span>
										/per user
									</div>
									{checkItemAlreadyPurchased(item.SubscriptionID) ? (
										<button
											onClick={() => navigate(navigateLink.subscriptions)}
											className="btn bg-[#EDF3F9] font-medium text-primary  hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-full mt-6 py-3"
										>
											Purchased
										</button>
									) : !checkItemAddedToCart(item.SubscriptionID) ? (
										<button
											onClick={() => addToCart(item.SubscriptionID)}
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
											<div className="ml-1">Add to Cart</div>
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
					{!isLoading && trendingSubscription.length > 5 && currentSlide !== 0 ? (
						<button
							title="Previous"
							className="flex items-center justify-center cursor-pointer shadow-[0px_0px_7px] shadow-[#00000017] bg-white w-[52px] h-[52px] rounded-[50%] top-[50%] absolute translate-y-[-50%] left-[-1.75%]"
							onClick={() => instanceRef?.current?.prev()}
						>
							<Icon icon="majesticons:chevron-left-line" width="24px" height="24px" />
						</button>
					) : null}

					{!isLoading && trendingSubscription.length > 5 ? (
						<button
							title="Next"
							className="flex items-center justify-center cursor-pointer w-[52px] shadow-[0px_0px_7px] shadow-[#00000017] bg-white h-[52px] rounded-[50%] top-[50%] absolute   translate-y-[-50%] right-[-1.75%]"
							onClick={() => instanceRef?.current?.next()}
						>
							<Icon icon="majesticons:chevron-right-line" width="24px" height="24px" />
						</button>
					) : null}
				</div>
			</div>
		</>
	);
};

export default TrendingSubscriptions;
