import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { useGetAddFavoriteItemMutation, useGetRemoveFavoriteItemMutation } from "~/features/learning/store";
import { useGetPurchasedHistoryQuery } from "~/features/Subscriptions/store";
import { getLoggedUser } from "~/helpers/auth";
import { RedirectLinkAssesment, RedirectLinkCourse } from "~/helpers/RedirectLink";
import { useGetFavoritesQuery } from "../store";

interface Iprops {
	handleIcon: any;
}
const Favorites = ({ handleIcon }: Iprops) => {
	const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
	const location = useLocation();
	const locationEndPoint =
		location.pathname === "/"
			? "dashboard"
			: location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const UserDetail = getLoggedUser();
	const { isFetching, refetch } = useGetFavoritesQuery(UserDetail.UserId);
	const { Favorites } = useAppSelector((state: any) => state.headersandmenuReducer);
	useGetPurchasedHistoryQuery({ UserID: UserDetail.UserId });
	const { PurchasedHistory } = useAppSelector((state: any) => state.userSubscriptionsReducer);
	const navigate = useNavigate();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const handleClick = (Favorite: any) => {
		if (Favorite.Type === "Course") {
			navigate(navigateLink.LearningCoursedetail + "&" + Favorite.ItemID);
		} else {
			navigate(navigateLink.learningAssesmentDetails + "&" + Favorite.ItemID);
		}
	};
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();

	const handleFavorites = (ItemID: number, Favorite: number, Type: string) => {
		const ItemType = Type === "Course" ? 1 : 2;
		if (+Favorite === 0) {
			getAddFavoriteItem({ UserID: UserDetail.UserId, ItemID: ItemID, Type: ItemType });
		} else {
			getRemoveFavoriteItem({
				UserID: UserDetail.UserId,
				ItemID: ItemID,
				Type: ItemType
			});
		}
		setTimeout(() => {
			refetch();
		}, 500);
	};

	useEffect(() => {
		refetch();
	}, [handleIcon]);

	return (
		<div className="h-[90%] w-full overflow-x-hidden">
			<div className="text-sm text-[#334155] font-bold">Favorites</div>
			{isFetching && <Spinner />}
			{!isFetching && (
				<>
					{Favorites.length > 0 ? (
						Favorites?.map((Favorite: any) => {
							return (
								<div
									className="w-[96%] bg-[#F1F5F9] rounded-lg flex mt-3 no-scrollbar cursor-pointer"
									data-bs-dismiss="offcanvas"
									aria-label="Close"
								>
									<div className="w-[30%] p-3">
										<img
											src={
												Favorite.InitialGraphic
													? imageUrl + Favorite.InitialGraphic
													: "assets/images/sample_learn.png"
											}
											className="w-20 h-20 rounded-lg"
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src = "assets/images/sample_learn.png";
											}}
										/>
									</div>
									<div className="w-[70%] p-3 flex flex-col justify-between">
										<span
											className="font-bold text-sm text-[#334155]"
											onClick={() => handleClick(Favorite)}
											title="View Detail"
										>
											{Favorite.Title}
										</span>
										<div className="flex gap-3 items-center justify-end">
											<button
												id={Favorite?.ItemID + "-" + Favorite?.Type + "-" + Favorite?.FavNum}
												className={`w-8 h-8 rounded-full ${
													Favorite?.FavNum !== 0 ? "bg-[#FAEBEE]" : " bg-[#F8FAFC]"
												}`}
												title={"Favorite"}
												onClick={() =>
													handleFavorites(Favorite.ItemID, Favorite.FavNum, Favorite.Type)
												}
											>
												<Icon
													id={
														Favorite?.ItemID + "-" + Favorite?.Type + "-" + Favorite?.FavNum
													}
													className="w-4 h-4 my-2 ml-2"
													icon={`${
														Favorite?.FavNum !== 0 ? "ri:heart-3-fill" : "ri:heart-3-line"
													}`}
													color={`${Favorite?.FavNum !== 0 ? "#d85c57" : "#020A12BD"}`}
												/>
											</button>

											<button
												onClick={() =>
													window.location.replace(
														Favorite.Type === "Course"
															? RedirectLinkCourse(Favorite.ItemID, locationEndPoint)
															: RedirectLinkAssesment(Favorite.ItemID, locationEndPoint)
													)
												}
												title={`${
													Favorite.Type === "Course" ? "Launch Course" : "Start Assessment"
												}`}
												className="flex justify-end text-sm font-dmsans text-[#020A12]/60 text-right"
											>
												<img src="/assets/images/launch.svg" width="20" height="20" />
											</button>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="flex flex-col text-center items-center mx-auto py-20">
							<img className="h-40 my-auto" src="/assets/images/Tiger_images/tiger-logoutX400.png" />
							<p className="text-xs+ text-[#020A12]/60">{"No Favorites Found"}</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};
export default Favorites;
