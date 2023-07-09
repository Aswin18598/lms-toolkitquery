import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { RedirectLinkAssesment } from "~/helpers/RedirectLink";
import { useGetAddFavoriteItemMutation, useGetRemoveFavoriteItemMutation } from "../store";

interface Iprops {
	isLoading: boolean;
	refetch: any;
}

const MyLearningAssessmentDetails = ({ isLoading, refetch }: Iprops) => {
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const UserDetail = getLoggedUser();
	const { CategoryLists, AssessmentProperties } = useAppSelector((state: any) => state.learningReducer);
	const breadcrumTab = location.search?.replace("?", "")?.split("&")[0];

	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();

	const handleFavorites = (ItemID: number, Favorite: number) => {
		if (+Favorite === 0) {
			getAddFavoriteItem({ UserID: UserDetail.UserId, ItemID: ItemID, Type: 2 });
		} else {
			getRemoveFavoriteItem({
				UserID: UserDetail.UserId,
				ItemID: ItemID,
				Type: 2
			});
		}
		setTimeout(() => {
			refetch();
		}, 500);
	};

	return (
		<>
			{isLoading && <Spinner />}
			{!isLoading && (
				<div>
					<div className="flex mt-6">
						{breadcrumTab !== "MyLearning" ? (
							<>
								<Link
									to={navigateLink.learning + "?Catalog-2"}
									className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
								>
									{
										CategoryLists?.find(
											(data: any) => data.CatagoryID === AssessmentProperties.CatagoryID
										)?.MasterCategoryName
									}
								</Link>
								<span>
									<Icon icon="ic:baseline-keyboard-arrow-right" width="16" height="16" />
								</span>
								<Link
									to={navigateLink.learning + "?Catalog-2"}
									className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
								>
									{AssessmentProperties.CategoryName}
								</Link>
							</>
						) : (
							<>
								<Link
									to={navigateLink.learning + "?MyLearning-2"}
									className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
								>
									Assessment
								</Link>
							</>
						)}
						<span>
							<Icon icon="ic:baseline-keyboard-arrow-right" width="16" height="16" />
						</span>
						<span className="text-xs+ space-x-2 text-[#020A12]/54 font-normal">
							{AssessmentProperties.Title}
						</span>
					</div>
					<div className="w-full">
						<div className="flex justify-between bg-white rounded-lg mt-6 px-20 py-14 flex lg:flex-row flex-col">
							<div className="mb-3">
								<div className="text-xs+ text-[#1268B3] font-bold mb-4">
									{AssessmentProperties.CategoryName}
								</div>
								<div className="text-[#020A12] text-3xl font-bold mb-5">
									{AssessmentProperties.Title}
								</div>
								<div className="flex items-center mb-5">
									<div className="mr-2.5">
										<Icon icon="mingcute:paper-line" width="16" height="16" />
									</div>
									<div>
										<span className="text-sm">Assessment ID : </span>
										<span className="text-sm">{AssessmentProperties.AssessmentID}</span>
									</div>
									<div className="mx-4">
										<svg
											width="1"
											height="22"
											viewBox="0 0 1 22"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<line x1="0.5" y1="2.18558e-08" x2="0.499999" y2="22" stroke="#EEEEEE" />
										</svg>
									</div>
									<div className="mr-2.5">
										<Icon icon="fluent:question-circle-12-regular" width="16" height="16" />
									</div>
									<div>
										<span className="text-sm">No. of questions : </span>
										<span className="text-sm">{AssessmentProperties.NumberOfQuestions}</span>
									</div>
								</div>
								<div className="flex items-center mb-6">
									<div className="mr-2.5">
										<Icon icon="mingcute:chart-bar-line" width="16" height="16" />
									</div>
									<div>
										<span className="text-sm">Type :</span>
										<span className="text-sm">{AssessmentProperties.AssessmentType}</span>
									</div>
									<div className="mx-4">
										<svg
											width="1"
											height="22"
											viewBox="0 0 1 22"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<line x1="0.5" y1="2.18558e-08" x2="0.499999" y2="22" stroke="#EEEEEE" />
										</svg>
									</div>
									<div className="mr-2.5">
										<Icon icon="ic:sharp-access-time" width="16" height="16" />
									</div>
									<div>
										<span className="text-sm">Time Limit : </span>
										<span className="text-sm">{AssessmentProperties.TimeLimitMinutes} </span>
									</div>
								</div>
								<div className="flex">
									<button
										className="flex items-center justify-center rounded-md bg-[#1268B3] h-12 mr-6"
										onClick={() =>
											window.location.replace(
												RedirectLinkAssesment(
													AssessmentProperties.AssessmentID,
													locationEndPoint
												)
											)
										}
									>
										<div className="btn text-[#FFFFFF]">Start Assessment</div>
									</button>
									<button
										className="flex items-center justify-center border border-gray-200 rounded-lg h-12 w-12"
										onClick={() =>
											handleFavorites(
												AssessmentProperties.AssessmentID,
												AssessmentProperties.FavoriteNum
											)
										}
									>
										<Icon
											icon={`${
												AssessmentProperties.FavoriteNum !== 0
													? "ri:heart-3-fill"
													: "ri:heart-3-line"
											}`}
											width="16"
											height="16"
											color={`${
												AssessmentProperties.FavoriteNum !== 0 ? "#d85c57" : "#020A12BD"
											}`}
										/>
									</button>
								</div>
							</div>
							<button
								className="bg-white sm:mt-5 mt-0 lg:w-[450px] h-[250px] w-[350px] border rounded-lg shadow-[1px_0px_30px_rgba(0,0,0,0.38)]"
								onClick={() =>
									window.location.replace(
										RedirectLinkAssesment(AssessmentProperties.AssessmentID, locationEndPoint)
									)
								}
							>
								<div className="relative m-1.5 lg:w-[434px] w-[334] h-[235px]  bg-[url('/assets/images/assessment.svg')] border rounded-lg"></div>
							</button>
						</div>
					</div>
					<div className="flex justify-center mx-32">
						<div className="bg-white rounded-lg mt-12 p-8">
							<div className="font-bold text-xl text-[#020A12] mb-5">About the Assessment</div>
							<p className="text-sm">{AssessmentProperties.Overview} </p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default MyLearningAssessmentDetails;
