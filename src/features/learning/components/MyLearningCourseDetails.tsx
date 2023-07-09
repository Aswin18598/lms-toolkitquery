import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import CertificateDownload from "~/helpers/CertificateDownload";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";
import {
	setCertificateDataToEmpty,
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetFilterCoursesInitialQuery,
	useGetRemoveFavoriteItemMutation
} from "../store";
import AvailableCourse from "./AvailableCourse";
import CourseLessons from "./CourseLessons";
import DiscussionForum from "./DiscussionForum";
import { LearningCourseILT } from "./LearningCourseILT";
import MylearningOverView from "./MylearningOverView";
import RelatedCourses from "./RelatedCourses";
import Timeago from "react-timeago";

var widthRange: { [key: string]: string } = {
	"1-8": "w-1/12",
	"9-16": "w-2/12",
	"17-24": "w-3/12",
	"25-32": "w-4/12",
	"33-40": "w-5/12",
	"41-49": "w-6/12",
	"50-58": "w-7/12",
	"59-67": "w-8/12",
	"68-75": "w-9/12",
	"76-82": "w-10/12",
	"83-91": "w-11/12",
	"92-100": "w-full"
};

function calculateWidth(progress: any): string {
	for (var key in widthRange) {
		const range = key.split("-");
		if (range[0] <= progress && progress <= range[1]) {
			return widthRange[key];
		}
	}
	return "w-0";
}
const SubscriptionAction = "Launch Course";

interface Iprops {
	refetch: any;
}

const MyLearningCourseDetails = ({ refetch }: Iprops) => {
	const UserDetail = getLoggedUser();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const [details, setDetails] = useState<string[]>(["Overview", "Lessons"]);
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const breadcrumTab = location.search?.replace("?", "")?.split("&")[0];
	const { CourseProperties, CategoryLists, CertificateInfo } = useAppSelector((state: any) => state.learningReducer);
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();
	const [selectedCatalog, setSelectedCatalog] = useState<string>(details[0]);
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const { isLoading } = useGetFilterCoursesInitialQuery({
		TopicID: -1,
		CatagoryID: CourseProperties[0].CategoryID,
		SubCategoryID: -1,
		SkillLevelID: -1,
		Rating: -1,
		SearchText: -1,
		PageNumber: 1,
		PageSize: 40
	});
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	useEffect(() => {
		// UserDetail.AccountTypeID === "8" && setDetails(["Overview", "Lessons", "Discussion Forum"]);
		checkIsB2B() && setDetails(["Overview", "Lessons", "Discussion Forum"]);
	}, []);

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
			{isLoading && <Spinner />}
			{!isLoading &&
				CourseProperties?.length > 0 &&
				CourseProperties.map((SpecificDetails: any, index: number) => (
					<div key={index}>
						<div className="flex my-3">
							<>
								{breadcrumTab !== "MyLearning" ? (
									<>
										<Link
											to={navigateLink.learning + "?Catalog-1"}
											className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
										>
											{
												CategoryLists?.find(
													(data: any) => data.CatagoryID === SpecificDetails.CatagoryID
												)?.MasterCategoryName
											}
										</Link>
										<span>
											<Icon icon="ic:baseline-keyboard-arrow-right" width="16" height="16" />
										</span>
										<Link
											to={navigateLink.learning + "?Catalog-1"}
											className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
										>
											{SpecificDetails.CategoryName}
										</Link>
									</>
								) : (
									<>
										<Link
											to={navigateLink.learning + "?MyLearning-1"}
											className="text-xs+ space-x-2 text-[#020A12]/54 font-bold"
										>
											Course
										</Link>
									</>
								)}
							</>

							<span>
								<Icon icon="ic:baseline-keyboard-arrow-right" width="16" height="16" />
							</span>
							<span className="text-xs+ space-x-2 text-[#020A12]/54 font-bold">
								{SpecificDetails.Title}
							</span>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-3">
							<div className="w-full flex bg-white border rounded-lg py-10 px-5 my-2">
								<div className="w-[100%] flex flex-row items-center">
									<div className="w-[100%] flex flex-row space-x-2 items-center">
										<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
											<Icon icon="mingcute:book-2-line" className="h-4 w-4 m-2" color="#1268B3" />
										</div>
										<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
											{SpecificDetails.LessonsCompleted} / {SpecificDetails.LessonsTotal}
										</div>
										<span className="text-base text-[#020A12] 2xl:text-xl"> Lessons Completed</span>
									</div>
								</div>
							</div>
							<div className="w-full flex bg-white border rounded-lg py-10 px-5 my-2">
								<div className="w-[100%] flex flex-row items-center">
									<div className="w-[100%] flex flex-row space-x-2  items-center">
										<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
											<Icon
												icon="mdi:clock-time-five-outline"
												className="h-4 w-4 m-2"
												width="16"
												height="16"
												color="#1268B3"
											/>
										</div>
										<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
											{SpecificDetails.tTime.split(":")[0] +
												"(h) : " +
												SpecificDetails.tTime.split(":")[1] +
												"(m)"}
										</div>
										<span className="text-base text-[#020A12] 2xl:text-xl"> Learning Time</span>
									</div>
								</div>
							</div>
							<div className="w-full flex bg-white border rounded-lg py-10 px-5 my-2">
								<div className="w-[100%] flex flex-row items-center">
									<div className="w-[100%]">
										<div className="w-[100%] flex flex-row space-x-2  items-center">
											<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
												<Icon
													icon="mingcute:certificate-line"
													className="h-4 w-4 m-2"
													width="16"
													height="16"
													color="#1268B3"
												/>
											</div>

											<div className="progress w-full h-2 bg-[#E9EEF5]">
												<div
													className={`relative h-2 ${calculateWidth(
														SpecificDetails.LearningProgress
													)} overflow-hidden rounded-full bg-[#1268B3]`}
												></div>
											</div>
											<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
												{SpecificDetails.LearningProgress}%
											</div>
											<button
												className={`${
													+SpecificDetails.LearningProgress === 100
														? "cursor-pointer"
														: "cursor-default "
												}`}
												title={` ${
													+SpecificDetails.LearningProgress === 100
														? "Download Certificate"
														: "Certificate InComplete"
												}`}
												onClick={() =>
													handleCertficateDownload(0, +SpecificDetails.CourseID, 1)
												}
												disabled={+SpecificDetails.LearningProgress !== 100}
											>
												<Icon
													className={`w-14 h-14 ml-2 ${
														+SpecificDetails.LearningProgress === 100
															? "cursor-pointer invert-[0%]"
															: "cursor-default invert-[80%]"
													}`}
													icon="fluent:certificate-20-regular"
													style={{ color: "rgba(2, 10, 18, 0.74)" }}
												/>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* {SpecificDetails.SubscriptionAction === SubscriptionAction && (
							<div className="w-full flex bg-white rounded-lg py-10 px-5 mt-6">
								<div className="w-[100%] flex flex-row items-center">
									<div className="w-[100%] flex flex-row space-x-2 items-center">
										<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
											<Icon icon="mingcute:book-2-line" className="h-4 w-4 m-2" color="#1268B3" />
										</div>
										<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
											{SpecificDetails.LessonsCompleted} / {SpecificDetails.LessonsTotal}
										</div>
										<span className="text-base text-[#020A12] 2xl:text-xl"> Lessons Completed</span>
									</div>
									<div className="w-[100%] flex flex-row space-x-2  items-center">
										<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
											<Icon
												icon="mdi:clock-time-five-outline"
												className="h-4 w-4 m-2"
												width="16"
												height="16"
												color="#1268B3"
											/>
										</div>
										<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
											{SpecificDetails.tTime}
										</div>
										<span className="text-base text-[#020A12] 2xl:text-xl"> Time to Spend</span>
									</div>
									<div className="w-[100%]">
										<div className="w-[100%] flex flex-row space-x-2  items-center">
											<div className="w-8 h-8  rounded-full bg-[#F2F8FF]">
												<Icon
													icon="mingcute:certificate-line"
													className="h-4 w-4 m-2"
													width="16"
													height="16"
													color="#1268B3"
												/>
											</div>
											<div className="text-lg font-bold text-[#25313D] 2xl:text-xl">
												{SpecificDetails.LearningProgress}%
											</div>
											<div className="progress w-full h-1.5 bg-[#E9EEF5]">
												<div
													className={`relative h-1.5 ${calculateWidth(
														SpecificDetails.LearningProgress
													)} overflow-hidden rounded-full bg-[#1268B3]`}
												></div>
											</div>
											<img src="/assets/images/learning.svg" alt="image" />
										</div>
									</div>
								</div>
							</div>
						)} */}

						<div className="flex justify-between bg-white border rounded-lg mt-6 p-5 sm:px-20 sm:py-14  lg:flex-row flex-col">
							<div className="mb-3">
								<div className="text-xs+ text-[#1268B3] font-bold mb-4">
									{SpecificDetails.CategoryName}
								</div>
								<div className="text-[#020A12] sm:w-[75%] 2xl:w-[100%] font-bold text-xl mb-5">
									{SpecificDetails.Title}
								</div>
								<div className="grid lg:grid-cols-2 md:gap-3 gap-5 mb-5">
									<div className="flex text-sm 2xl:text-xl items-center gap-2">
										<Icon icon="mingcute:book-2-line" className="w-4 h-4" />
										<span>Course ID : {SpecificDetails.CourseID}</span>
									</div>
									<div className="flex text-sm 2xl:text-xl items-center gap-2">
										<Icon icon="mingcute:time-line" className="w-4 h-4" />
										<span>
											Last updated : <Timeago date={SpecificDetails.LastModifiedDate} />
										</span>
									</div>
								</div>
								<div className="grid lg:grid-cols-2 md:gap-3 gap-5">
									<div className="flex text-sm 2xl:text-xl items-center gap-2">
										<Icon icon="mingcute:chart-bar-line" className="w-4 h-4" />
										<span>{SpecificDetails.SkillLevel}</span>
									</div>
									<div className="flex text-sm 2xl:text-xl items-center gap-2">
										<Icon icon="mingcute:group-line" className="w-4 h-4" />
										<span>{SpecificDetails.Enrolled} + already enrolled</span>
									</div>
								</div>
								<div className="flex gap-2 items-center my-5">
									<div
										className="flex items-center justify-center rounded-md bg-[#1268B3] h-12"
										onClick={() => {
											SpecificDetails.SubscriptionAction !== SubscriptionAction
												? navigate(navigateLink.subscriptions + "?" + 2, {
														state: { CategoryID: SpecificDetails.CategoryID }
												  })
												: window.location.replace(
														RedirectLinkCourse(SpecificDetails.CourseID, locationEndPoint)
												  );
										}}
									>
										{(SpecificDetails.SubscriptionAction === "Launch Course" || !checkIsB2B()) && (
											<button className="btn flex items-center bg-[#1268B3] text-[#FFFFFF] w-48 sm:w-64 h-14">
												{SpecificDetails.SubscriptionAction}
											</button>
										)}
									</div>
									{SpecificDetails.SubscriptionAction === SubscriptionAction && (
										<button
											className="flex items-center justify-center border border-gray-200 rounded-lg p-4 sm:p-0 sm:h-14 sm:w-14"
											onClick={() =>
												handleFavorites(+SpecificDetails.CourseID, +SpecificDetails.FavoriteNum)
											}
										>
											<Icon
												icon={`${
													+SpecificDetails.FavoriteNum !== 0
														? "ri:heart-3-fill"
														: "ri:heart-3-line"
												}`}
												width="16"
												height="16"
												color={`${
													+SpecificDetails.FavoriteNum !== 0 ? "#d85c57" : "#020A12BD"
												}`}
											/>
										</button>
									)}
									<LearningCourseILT SpecificDetails={SpecificDetails} />
								</div>
							</div>
							<button
								className="bg-white sm:mt-5 mt-3 lg:w-[450px] h-[200px] w-[300px] sm:h-[250px] sm:w-[350px] md:w-[400px] border rounded-lg shadow-[1px_0px_30px_rgba(0,0,0,0.38)]"
								onClick={() =>
									window.location.replace(
										RedirectLinkCourse(SpecificDetails.CourseID, locationEndPoint)
									)
								}
							>
								<div className="relative m-1.5 w-full h-full bg-[url('/assets/images/rectanglebg.svg')] border rounded-lg">
									<div className="absolute left-[30%] top-[47%] flex items-center">
										{/* <Icon icon="fa6-solid:circle-play" width="30" height="30" color="#ffffff" /> */}
										<img src="/assets/images/launchwhite.svg" width="30" height="30" />
										<span className="ml-2 text-[#FFFFFF]">About the course</span>
									</div>
								</div>
							</button>
						</div>
						<div className="border-b-2 my-4 flex items-center justify-center">
							{details?.map((menu: any) => (
								<>
									<button
										key={menu}
										onClick={() => setSelectedCatalog(menu)}
										className={`px-[10px] py-[7px] mr-3 text-[13px] font-bold ${
											selectedCatalog === menu &&
											"border-b-2 border-[#1268B3] text-[#1268B3] fold-bold"
										}`}
									>
										{menu}
									</button>
								</>
							))}
						</div>
						<div className="flex gap-4 lg:flex-row flex-col">
							{selectedCatalog !== details[2] ? (
								<>
									<div className="lg:w-9/12">
										{selectedCatalog === details[0] && (
											<MylearningOverView SpecificDetails={SpecificDetails} />
										)}
										{selectedCatalog === details[1] && (
											<CourseLessons SpecificDetails={SpecificDetails} />
										)}
									</div>
									<div className="lg:w-3/12">
										<AvailableCourse SpecificDetails={SpecificDetails} />
										<RelatedCourses />
									</div>
								</>
							) : (
								<DiscussionForum />
							)}
						</div>
					</div>
				))}
		</>
	);
};

export default MyLearningCourseDetails;
