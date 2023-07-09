import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { useAddToCartMutation, useCartListQuery } from "~/features/cart/store";
import { useGetCategoriesListQuery } from "~/features/learning/store";
import { getLoggedUser } from "~/helpers/auth";
import { setSelectedCatagoryID } from "../store";
import {
	useGetAvailableSubscriptionQuery,
	useGetProfessionalBundleQuery,
	useGetSubscriptionsDetailsQuery
} from "../store/query";
import AvailableSubscriptions from "./AvailableSubscriptions";
import FilterSectionCategory from "./FilterSectionCategory";
import SearchBar from "./SearchBar";

function Subscription() {
	const { Currency, UserId } = getLoggedUser();
	const navigate = useNavigate();
	const location = useLocation();
	useGetSubscriptionsDetailsQuery(UserId);
	useGetProfessionalBundleQuery(Currency === "INR" ? "IN" : "US");
	useGetCategoriesListQuery("");

	const { ProfessionalBundle, CatagoryID, SubscriptionsDetails } = useAppSelector(
		(state: any) => state.userSubscriptionsReducer
	);
	const { CategoryLists } = useAppSelector((state: any) => state.learningReducer);
	const [selectedCatogery, setSelectedCatogery] = useState<number>(+CatagoryID);
	const [loader, setLoader] = useState<boolean>(false);
	const [skip, setSkip] = useState<boolean>(!!location?.state?.CategoryID);
	const AvailableData = useGetAvailableSubscriptionQuery(
		{ CountryCode: Currency === "INR" ? "IN" : "US", CategoryID: CatagoryID },
		{
			skip:
				selectedCatogery === 0 ||
				(skip && location?.state?.CategoryID && location?.state?.CategoryID !== CatagoryID)
		}
	);

	useEffect(() => {
		dispatch(setSelectedCatagoryID(+selectedCatogery));
	}, [selectedCatogery]);

	useEffect(() => {
		if (location?.state?.CategoryID && CategoryLists.length > 0) {
			const categoryIdKey =
				CategoryLists.filter((data: any) => data.CategoryID === location.state.CategoryID).length > 0
					? location.state.CategoryID
					: -1;
			dispatch(setSelectedCatagoryID(categoryIdKey));
			setSelectedCatogery(categoryIdKey);
		}
	}, [location, CategoryLists]);

	useEffect(() => {
		return () => {
			dispatch(setSelectedCatagoryID(-1));
			setSelectedCatogery(-1);
		};
	}, []);

	const { cartItems } = useAppSelector((state: any) => state.cartReducer);
	const [addCart] = useAddToCartMutation();
	const { refetch } = useCartListQuery();

	const addToCart = async (id: string) => {
		await addCart({ subscriptionId: id, PurchaseType: "Subscription" }).unwrap();
		refetch();
	};
	const checkItemAddedToCart = (subscriptionID: string): boolean => {
		return cartItems.filter((item: any) => item.SubscriptionID === subscriptionID).length > 0;
	};
	const checkItemAlreadyPurchased = (subscriptionID: number): boolean => {
		return (
			SubscriptionsDetails?.filter((item: any) => item.SubscriptionID === subscriptionID?.toString()).length > 0
		);
	};
	const bundles = ["Seimens PLM", "Autodesk", "Dassaults systems", "PTC", "Premium industry skills"];

	return (
		<>
			<div className="gap-4 py-5 lg:py-6">
				<h2 className="text-xl py-5 lg:py-6 font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
					Professional Bundle
				</h2>
				<div className="flex justify-between lg:flex-row flex-col gap-4 bg-white rounded-lg p-5 shadow-[-5px_0px_0px_0px_#1268B3]">
					<div className="flex sm:flex-row flex-col lg:w-4/6 items-center justify-between">
						<div className="sm:w-2/12 w-20">
							<img src="assets/images/subs-books-gif.gif" />
						</div>
						<div className="w-10/12 2xl:w-full flex sm:pr-0 pr-4 flex-col">
							<span className="font-bold">All - in - One Professional Bundle</span>
							<span className="text-sm">
								For users looking to access ALL of the i GET IT course library. Take any or all of the
								courses during your subscription period.
							</span>
							<div className="flex flex-wrap items-center text-sm mt-8 gap-2">
								{bundles.map((data: any) => (
									<div className="flex items-center gap-1">
										<Icon
											icon="material-symbols:check-circle-outline-rounded"
											width="16"
											height="16"
											color="#1268B3"
										/>
										<span>{data}</span>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="flex flex-row items-center justify-around lg:w-2/6 text-[#1268B3]">
						<div className="flex">
							{Currency === "USD" ? "\u0024" : "\u20B9"}
							<span className="line-clamp-1">{ProfessionalBundle.Price} / Yr</span>
						</div>
						{checkItemAlreadyPurchased(ProfessionalBundle.SID) ? (
							<button className="btn bg-[#EDF3F9] text-[#1268B3] rounded-md h-12 mr-6">Purchased</button>
						) : !checkItemAddedToCart(ProfessionalBundle.SID) ? (
							<button
								className="flex btn text-[#FFFFFF] rounded-md bg-[#1268B3] h-12"
								onClick={() => addToCart(ProfessionalBundle.SID)}
							>
								<Icon
									icon="material-symbols:shopping-cart-outline-rounded"
									width="16"
									height="16"
									color="#FFFFFF"
								/>
								<span className="line-clamp-1">Add to Cart</span>
							</button>
						) : (
							<button
								className="btn text-[#1268B3] bg-[#EDF3F9] rounded-md h-12 mr-6"
								onClick={() => navigate(navigateLink.cart)}
							>
								View Cart
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="flex  justify-between flex-wrap gap-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Subscriptions</h2>
				<div className="flex justify-between flex-wrap gap-4">
					<div className="w-[220px]">
						<SearchBar setLoader={setLoader} />
					</div>
					<div className="w-[220px]">
						<FilterSectionCategory
							setCategoryIdAndShow={setSelectedCatogery}
							selectedCatagoryID={selectedCatogery}
							setLoader={setLoader}
							setSkip={setSkip}
						/>
					</div>
				</div>
			</div>
			<AvailableSubscriptions loader={loader} setLoader={setLoader} AvailableData={AvailableData} />
		</>
	);
}

export default Subscription;
