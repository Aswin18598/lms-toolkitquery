import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import {
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetRemoveFavoriteItemMutation
} from "../store/query";
import { getLoggedUser } from "~/helpers/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import Pagination from "./Pagination";
import CertificateDownload from "~/helpers/CertificateDownload";
import { useDispatch } from "react-redux";
import { setCertificateDataToEmpty } from "../store";
import { RedirectLinkAssesment } from "~/helpers/RedirectLink";

interface IProps {
	loader: boolean;
	refetch: any;
}
const LearningAssessmentCard = ({ loader, refetch }: IProps) => {
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const UserDetail = getLoggedUser();
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const { MyLearningAssesmentGridData, MyLearningAssesmentGridDataMessage, CertificateInfo } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;

	const specificAssessment = (assessment: any) => {
		navigate(navigateLink.learningAssesmentDetails + "&" + assessment.ItemID);
	};
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

	const handleCertficateDownload = (event: number, item: number, type: number) => {
		setEventId(event);
		setItemId(item);
		setMode(type);
		certificateData?.refetch();
	};

	useEffect(() => {
		setTimeout(() => {
			if (itemId !== 0 && CertificateInfo?.UserName?.length > 0) {
				CertificateDownload(CertificateInfo);
				dispatch(setCertificateDataToEmpty([]));
				setEventId(-1);
				setItemId(0);
				setMode(0);
			}
		}, 1000);
	}, [CertificateInfo]);

	return (
		<>
			{loader && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!loader && (
				<>
					{MyLearningAssesmentGridData?.MyLearningGridData?.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 my-4">
								{MyLearningAssesmentGridData.MyLearningGridData.map((course: any, index: number) => (
									<div
										key={course.ItemID}
										className={
											"bg-white border border-gray-200  pt-4 px-4 rounded-lg keen-slider__slide number-slide" +
											index
										}
									>
										<div className="w-full flex justify-between items-center h-12 mb-3.5">
											{/* {course.InitialGraphic ? (
												<img
													className="w-12 h-full rounded-lg cursor-pointer"
													src={imageUrl + course.InitialGraphic}
													alt="sample_learn"
													onError={({ currentTarget }) => {
														currentTarget.onerror = null;
														currentTarget.src = "assets/images/user-pic.svg";
													}}
												/>
											) : ( */}

											<div className="cursor-pointer w-12 h-full rounded-lg border">
												<Icon
													icon="mingcute:paper-line"
													width="24"
													height="24"
													className="cursor-pointer m-2.5"
												/>
											</div>
											{/* )} */}
											<div className="flex">
												<button
													onClick={() =>
														handleCertficateDownload(+course.EventID, +course.ItemID, 2)
													}
													title={"Certificate"}
													disabled={+course.Progress !== 100}
													className={classNames("cursor-default w-8 h-8 mr-4 rounded-full ", {
														"cursor-pointer bg-[#F8FAFC]": +course.Progress === 100
													})}
												>
													<Icon
														className={classNames("w-4 h-4 my-2 ml-2 ", {
															"cursor-pointer invert-[0%]": course.Result === "Passed",
															"cursor-default invert-[80%]": course.Progress !== "Passed"
														})}
														icon="fluent:certificate-20-regular"
														style={{ color: "rgba(2, 10, 18, 0.74)" }}
													/>
												</button>
												<button
													className={`w-8 h-8 rounded-full ${
														course.Favorite !== 0 ? "bg-[#FAEBEE]" : " bg-[#F8FAFC]"
													}`}
													title={"Favorite"}
													onClick={() => handleFavorites(course.ItemID, course.Favorite)}
												>
													{course.Favorite !== 0 ? (
														<Icon
															className="w-4 h-4 my-2 ml-2"
															icon="ri:heart-3-fill"
															color="#d85c57"
														/>
													) : (
														<Icon
															className="w-4 h-4 my-2 ml-2"
															icon="ri:heart-3-line"
															color="#020A12BD"
														/>
													)}
												</button>
											</div>
										</div>
										<button title="View Detail" onClick={() => specificAssessment(course)}>
											<div className="flex items-center space-x-1">
												<p className="text-lg font-medium text-left mb-2 px-1 text-slate-700 line-clamp-1 bg-[#E2F5FF80] text-[#1268B3]">
													{course.CategoryName}
												</p>
											</div>
											<p className="text-xs+ text-slate-500 space-x-2 text-left font-bold line-clamp-1 cursor-pointer">
												{course.Title}
											</p>
										</button>
										<div className="flex justify-between">
											<div className="flex items-center text-xs+ space-x-2 font-normal font-dmsans my-4">
												{course.Progress === "Not Taken" ? (
													<span className="ml-0">{course.Progress}</span>
												) : (
													<>
														<span>
															{course.Result === "Passed" ? (
																<Icon
																	className="w-4 h-4"
																	icon="mingcute:certificate-fill"
																	color="#4FC666"
																/>
															) : (
																<Icon
																	className="w-4 h-4"
																	icon="jam:close-circle"
																	color="#D85C57"
																/>
															)}
														</span>{" "}
														<span>{course.Result}</span>
														<span className="border rounded-full w-1.5 h-1.5 ml-4 bg-[#C7CFD761]"></span>
														<span className="ml-4">{course.Progress}%</span>
													</>
												)}
											</div>
											<button
												onClick={() =>
													window.location.replace(
														RedirectLinkAssesment(course.ItemID, locationEndPoint)
													)
												}
												title="Start Assessment"
											>
												<img src="/assets/images/launch.svg" width="20" height="20" />
											</button>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="flex  flex-col text-center items-center mx-auto py-20">
							<img
								className="h-40 my-auto"
								src="assets/images/Tiger_images/tiger-logoutX400.png"
								alt={MyLearningAssesmentGridDataMessage}
							/>
							<p className="text-xs+ text-[#020A12]/60">{MyLearningAssesmentGridDataMessage}</p>
						</div>
					)}
					<Pagination PaginationData={MyLearningAssesmentGridData} count={12} />
				</>
			)}
		</>
	);
};

export default LearningAssessmentCard;
