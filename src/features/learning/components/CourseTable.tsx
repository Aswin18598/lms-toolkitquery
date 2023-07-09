import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import CertificateDownload from "~/helpers/CertificateDownload";
import { RedirectLinkAssesment, RedirectLinkCourse } from "~/helpers/RedirectLink";
import {
	setCertificateDataToEmpty,
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetRemoveFavoriteItemMutation
} from "../store";
import { LearningPathCourseImg } from "./LearningPathCourseImg";
import LearningPathLaunch from "./LearningPathLaunch";

const CourseTable = ({
	clickHide,
	courseDetails,
	refetch
}: {
	clickHide: Function;
	courseDetails: any;
	refetch: any;
}) => {
	const location = useLocation();
	const UserDetail = getLoggedUser();
	const dispatch = useDispatch();
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const navigate = useNavigate();
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();
	const { CertificateInfo } = useAppSelector((state: any) => state.learningReducer);

	const handleFavorites = (ItemID: number, Favorite: number) => {
		if (+Favorite === 0) {
			getAddFavoriteItem({ UserID: +UserDetail.UserId, ItemID: ItemID, Type: 1 });
		} else {
			getRemoveFavoriteItem({
				UserID: +UserDetail.UserId,
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
			if (CertificateInfo?.ItemID !== 0 && CertificateInfo?.UserName?.length > 0) {
				CertificateDownload(CertificateInfo);
				dispatch(setCertificateDataToEmpty([]));
				setEventId(-1);
				setItemId(0);
				setMode(0);
			}
		}, 1000);
	}, [CertificateInfo]);

	return (
		<tr className="border-y border-transparent border-b-slate-200 text-[#020A12]/60">
			<td colSpan={6}>
				<div className="bg-white rounded-lg">
					<table className="is-hoverable w-full text-left">
						<thead>
							<tr className="text-sm font-dmsans m-4 font-medium">
								<th className=" px-4 py-3 lg:px-5">TYPE</th>
								<th className=" px-4 py-3 lg:px-5">NAME</th>
								<th className=" px-4 py-3 lg:px-5">LAST ACCESS</th>
								<th className=" px-4 py-3 lg:px-5">TIME SPENT</th>
								<th className=" px-4 py-3 lg:px-5">START DATE</th>
								<th className=" px-4 py-3 lg:px-5">DUE DATE</th>
								<th className=" px-4 py-3 lg:px-5">PROGRESS</th>
								<th className=" px-4 py-3 lg:px-5">ACTION</th>
							</tr>
						</thead>
						<tbody>
							{courseDetails?.map((course: any, index: number) => (
								<tr className="border-y border-transparent border-b-slate-200" key={course.CourseName}>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<LearningPathCourseImg course={course} />
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<button
											className="flex text-left"
											onClick={() =>
												navigate(
													course.Type === "Course"
														? navigateLink.LearningCoursedetail + "&" + course.CourseID
														: navigateLink.learningAssesmentDetails + "&" + course.CourseID
												)
											}
											title="View Detail"
										>
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.CourseName}</p>
										</button>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.LastAccess}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-1  sm:px-5">
										<div className="flex text-left">
											<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
												{course.Duration}
											</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.StartDate}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.DueDate}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">
												{course.Progress}{" "}
												{!isNaN(+(course.Progress + "0")) && course.Progress !== "" && "%"}
											</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left justify-start mr-4">
											<button
												className="mr-2 text-sm font-dmsans text-[#020A12]/60"
												title={"Favorite"}
												onClick={() => handleFavorites(course.CourseID, course.Favorite)}
											>
												<Icon
													icon={`${
														course.Favorite === 1 ? "ri:heart-3-fill" : "ri:heart-3-line"
													}`}
													width="16"
													height="16"
													color={`${course.Favorite === 1 ? "#d85c57" : "#020A12BD"}`}
												/>
											</button>
											<button
												className="text-sm font-dmsans text-[#020A12]/60"
												title={"Certificate"}
												onClick={e =>
													handleCertficateDownload(
														+course.EventID,
														+course.CourseID,
														course.Type === "Course" ? 1 : 2
													)
												}
												disabled={+course?.Progress !== 100}
											>
												<Icon
													icon="fluent:certificate-24-regular"
													className={` ${
														+course.Progress === 100
															? "invert-[0%]"
															: "cursor-default invert-[80%]"
													}`}
													width="16"
													height="16"
													style={{ color: "rgba(2, 10, 18, 0.74)" }}
												/>
											</button>
											{course.Type === "Course" &&
												UserDetail.AccountType !== 2 &&
												course.ILT > 0 && (
													<button
														className="w-8 h-8 rounded-full"
														title={"ILT"}
														onClick={() =>
															navigate(navigateLink.dashboard, { state: "ILT" })
														}
														disabled={course?.ILT === 0}
													>
														<Icon
															className="w-4 h-4 my-2 ml-2"
															icon="ic:outline-date-range"
															style={{ color: "rgba(2, 10, 18, 0.74)" }}
														/>
													</button>
												)}
											<LearningPathLaunch course={course} />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<button className="btn font-bold float-right m-6 text-xs+ text-[#1268B3]" onClick={() => clickHide()}>
					Hide
				</button>
			</td>
		</tr>
	);
};
export default CourseTable;
