import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import {
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetRemoveFavoriteItemMutation
} from "../store/query";
import { navigateLink } from "~/config/api/links";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import CertificateDownload from "~/helpers/CertificateDownload";
import { useDispatch } from "react-redux";
import { setCertificateDataToEmpty } from "../store";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";
import { LearningILT } from "./LearningCourseILT";

interface IProps {
	loader: boolean;
	calculateWidth: any;
	refetchData: any;
}

const LearningCourseCard = ({ calculateWidth, loader, refetchData }: IProps) => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const UserDetail = getLoggedUser();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const { MyLearningCourseGridData, MyLearningCourseGridDataMessage, CertificateInfo } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();

	const handleFavorites = (ItemID: number, Favorite: number) => {
		if (+Favorite === 0) {
			getAddFavoriteItem({ UserID: UserDetail.UserId, ItemID: ItemID, Type: 1 });
		} else {
			getRemoveFavoriteItem({
				UserID: UserDetail.UserId,
				ItemID: ItemID,
				Type: 1
			});
		}
		setTimeout(() => {
			refetchData();
		}, 500);
	};

	const specificCourse = (CourseDetails: any) => {
		navigate(navigateLink.LearningCoursedetail + "&" + CourseDetails.ItemID);
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
					{MyLearningCourseGridData?.MyLearningGridData?.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 my-4">
								{MyLearningCourseGridData.MyLearningGridData.map((course: any, index: number) => (
									<div
										key={course.ItemID}
										className={`bg-white border border-gray-200  pt-4 px-4 rounded-lg keen-slider__slide number-slide${index}`}
									>
										<div className="w-full flex justify-between items-center h-12 mb-3.5">
											<img
												className="w-12 h-full rounded-lg cursor-pointer"
												src={
													course.InitialGraphic
														? imageUrl + course.InitialGraphic
														: "/assets/images/sample_learn.png"
												}
												alt="sample_learn"
												onError={({ currentTarget }) => {
													currentTarget.onerror = null;
													currentTarget.src = "assets/images/sample_learn.png";
												}}
											/>
											<div className="flex">
												<button
													className={`w-8 h-8 mr-4 rounded-full ${
														+course?.Progress === 100
															? "cursor-pointer bg-[#F8FAFC]"
															: "cursor-default "
													}`}
													title={"Certificate"}
													onClick={() =>
														handleCertficateDownload(+course.EventID, +course.ItemID, 1)
													}
													disabled={+course?.Progress !== 100}
												>
													<Icon
														className={`w-4 h-4 my-2 ml-2 ${
															+course?.Progress === 100
																? "cursor-pointer invert-[0%]"
																: "cursor-default invert-[80%]"
														}`}
														icon="fluent:certificate-20-regular"
														style={{ color: "rgba(2, 10, 18, 0.74)" }}
													/>
												</button>
												<button
													id={course?.ItemID + "-" + course?.Type + "-" + course?.Favorite}
													className={`w-8 h-8 rounded-full ${
														course?.Favorite !== 0 ? "bg-[#FAEBEE]" : " bg-[#F8FAFC]"
													}`}
													title={"Favorite"}
													onClick={() => handleFavorites(course.ItemID, course.Favorite)}
												>
													<Icon
														id={
															course?.ItemID + "-" + course?.Type + "-" + course?.Favorite
														}
														className="w-4 h-4 my-2 ml-2"
														icon={`${
															course?.Favorite !== 0
																? "ri:heart-3-fill"
																: "ri:heart-3-line"
														}`}
														color={`${course?.Favorite !== 0 ? "#d85c57" : "#020A12BD"}`}
													/>
												</button>
												<LearningILT course={course} />
											</div>
										</div>
										<button
											title="View Detail"
											className="flex flex-col items-start"
											onClick={() => specificCourse(course)}
										>
											<div className="flex items-center space-x-1">
												<p className="text-lg font-medium text-left mb-2 px-1 text-slate-700 line-clamp-1 bg-[#E2F5FF80] text-[#1268B3]">
													{course.CategoryName}
												</p>
											</div>
											<p className="text-xs+ text-slate-500 space-x-2 text-left font-bold line-clamp-1">
												{course.Title}
											</p>
										</button>
										<div className="flex w-full flex-nowrap items-center mt-4 text-xs+">
											<div className="progress w-11/12 h-1.5 bg-[#E9EEF5] mr-2">
												<div
													className={`relative h-1.5 ${calculateWidth(
														+course?.Progress
													)} overflow-hidden rounded-full bg-[#1268B3]`}
												></div>
											</div>
											<span className="w-1/12">
												{course.Progress === "Not Started" ? 0 : +course?.Progress}%
											</span>
										</div>

										<div className="flex justify-between">
											<div className="flex items-center text-xs+ space-x-2 font-normal font-dmsans my-4">
												<span>
													{course.LessonsCompleted} / {course.LessonsTotal} lessons
												</span>
												<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
												<span>{course.tTime}</span>
											</div>
											<button
												onClick={() =>
													window.location.replace(
														RedirectLinkCourse(course.ItemID, locationEndPoint)
													)
												}
												title="Launch Course"
											>
												<img src="/assets/images/launch.svg" width="20" height="20" />
											</button>
										</div>
									</div>
								))}
							</div>
							<Pagination PaginationData={MyLearningCourseGridData} count={12} />
						</>
					) : (
						<div className="flex flex-col text-center items-center mx-auto py-20">
							<img
								className="h-40 my-auto"
								src="/assets/images/Tiger_images/tiger-logoutX400.png"
								alt={MyLearningCourseGridDataMessage}
							/>
							<p className="text-xs+ text-[#020A12]/60">{MyLearningCourseGridDataMessage}</p>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default LearningCourseCard;
