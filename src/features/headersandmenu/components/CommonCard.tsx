import { Icon } from "@iconify/react";
import { useState } from "react";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import { useGetSubscriptionsQuery } from "../store";
import Favorites from "./Favorites";
import Subscription from "./Subscription";
interface Iprops {
	isFavorites: boolean;
	setIsFavorites: any;
	handleIcon: any;
}
const CommonCard = ({ isFavorites, setIsFavorites, handleIcon }: Iprops) => {
	const user = getLoggedUser();
	useGetSubscriptionsQuery(user.UserId);

	return (
		<>
			{isFavorites ? <Favorites handleIcon={handleIcon} /> : <Subscription />}
			{!checkIsB2B() && (
				<div className="flex flex-col items-center pt-3">
					<div className="bg-[white] flex fixed justify-evenly items-center w-36 h-10 rounded-full shadow-md">
						<div
							className={`w-12 h-8 rounded-full ${
								isFavorites ? "bg-[#F5F7F9]" : ""
							} flex  justify-center items-center`}
							title="Favorites"
							onClick={() => setIsFavorites(!isFavorites)}
						>
							<Icon
								icon={`${isFavorites ? "ri:heart-3-fill" : "ri:heart-3-line"}`}
								color={` ${isFavorites ? "#1268B3" : ""}`}
							/>
						</div>
						{
							// (user.AccountTypeID !== "2" && (user.UserTypeID === "1" || user.UserTypeID === "2")) ||
							!checkIsB2B() && (
								<div
									className={`w-12 h-8 rounded-full ${
										!isFavorites ? "bg-[#F5F7F9]" : ""
									}  flex  justify-center items-center`}
									title="Subscriptions"
									onClick={() => setIsFavorites(!isFavorites)}
								>
									<Icon
										icon={`${!isFavorites ? "mingcute:book-3-fill" : "mingcute:book-3-line"}`}
										color={` ${!isFavorites ? "#1268B3" : ""}`}
									/>
								</div>
							)
						}
					</div>
				</div>
			)}
		</>
	);
};

export default CommonCard;
