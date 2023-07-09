import { Icon } from "@iconify/react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import CertificateDownload from "~/helpers/CertificateDownload";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";
import { setCertificateDataToEmpty } from "../store";
import {
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetRemoveFavoriteItemMutation
} from "../store/query";
import Pagination from "./Pagination";

interface IProps {
	calculateWidth: any;
	loader: boolean;
	refetch: any;
}

export default function LearningCoursesTable({ calculateWidth, loader, refetch }: IProps) {
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const UserDetail = getLoggedUser();
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const [startIndex, setStartIndex] = useState<number>(0);
	const certificateData: any = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const { MyLearningCourseGridData, MyLearningCourseGridDataMessage, CertificateInfo, PageNumber, PageSize } =
		useAppSelector((state: any) => state.learningReducer);
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		setStartIndex(PageNumber === 1 ? 0 : PageNumber * PageSize - PageSize);
	}, [PageNumber, PageSize]);

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
		}, 100);
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
				<div className="whitespace-nowrap mx-auto py-3 sm:px-5">
					<div className="mx-auto my-28">
						<Spinner />
					</div>
				</div>
			)}
			{!loader && (
				<>
					<div className="mt-6 overflow-auto">
						{MyLearningCourseGridData?.MyLearningGridData?.length > 0 ? (
							<>
								<table className="mb-0.5 is-hoverable w-full text-left">
									<thead className="bg-[#E2E8F0]">
										<tr className="border border-slate-150 font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">S NO</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">TITLE</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">CATEGORY</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">LESSONS</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">PROGRESS</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">TIME TO SPEND</th>
											<th className="whitespace-nowrap px-4 py-3 lg:px-5">ACTION</th>
										</tr>
									</thead>
									<tbody className="bg-[#FFFFFF]">
										{MyLearningCourseGridData.MyLearningGridData.map((item: any, index: number) => (
											<>
												<tr className={"border border-slate-150"} key={index}>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className="ml-2 text-sm font-dmsans text-[#020A12]/60">
																{startIndex + index + 1}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div
															className="flex text-left cursor-pointer"
															onClick={() => specificCourse(item)}
															title="View Detail"
														>
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item?.Title}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-1  sm:px-5">
														<div className="flex text-left">
															<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
																{item?.CategoryName}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item?.LessonsCompleted + "/" + item?.LessonsTotal}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-3 py-3 sm:px-5">
														<div className="flex w-full flex-nowrap items-center mt-4 text-xs+">
															<div className="progress w-3/4 rounded-full h-1.5 bg-[#E9EEF5] flex text-left mr-1">
																<div
																	className={`relative h-1.5 ${calculateWidth(
																		+item.Progress
																	)} overflow-auto rounded-full bg-[#1268B3]`}
																></div>
															</div>
															<span className="w1/4">
																{item.Progress === "Not Started" ? 0 : +item.Progress}%
															</span>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item?.tTime}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
														<div className="flex text-left">
															<button
																className="w-4 h-4 my-2 ml-2"
																onClick={() =>
																	handleFavorites(item.ItemID, item.Favorite)
																}
																title="Favorite"
															>
																<Icon
																	icon={`${
																		item?.Favorite !== 0
																			? "ri:heart-3-fill"
																			: "ri:heart-3-line"
																	}`}
																	color={`${
																		item?.Favorite !== 0 ? "#d85c57" : "#020A12BD"
																	}`}
																/>
															</button>
															<button
																className="w-4 h-4  my-2 ml-2"
																onClick={() =>
																	handleCertficateDownload(
																		+item.EventID,
																		+item.ItemID,
																		1
																	)
																}
																title="Certificate"
																disabled={+item?.Progress !== 100}
															>
																<Icon
																	className={`w-4 h-4 ${
																		+item?.Progress === 100
																			? "invert-[0%]"
																			: "invert-[80%]"
																	}`}
																	icon="fluent:certificate-20-regular"
																	style={{ color: "rgba(2, 10, 18, 0.74)" }}
																/>
															</button>
															<button
																className="my-2 ml-2"
																onClick={() =>
																	window.location.replace(
																		RedirectLinkCourse(
																			item.ItemID,
																			locationEndPoint
																		)
																	)
																}
															>
																<p
																	className="text-sm font-dmsans text-[#020A12]/60"
																	title="Launch Course"
																>
																	<img
																		src="/assets/images/launch.svg"
																		width="16"
																		height="16"
																	/>
																</p>
															</button>
															{UserDetail.AccountType !== 2 && (
																<button
																	className={`w-8 h-8 rounded-full ${
																		item?.ILT === 1
																			? "cursor-pointer invert-[0%]"
																			: "cursor-default invert-[80%]"
																	}`}
																	title={"ILT"}
																	disabled={item?.ILT === 0}
																	onClick={() => navigate(navigateLink.training)}
																>
																	<Icon
																		className="w-4 h-4 my-2 ml-2"
																		icon="ic:outline-date-range"
																		style={{ color: "rgba(2, 10, 18, 0.74)" }}
																	/>
																</button>
															)}
														</div>
													</td>
												</tr>
											</>
										))}
									</tbody>
								</table>
							</>
						) : (
							<>
								<div className="flex flex-col text-center items-center mx-auto py-20">
									<img
										className="h-40 my-auto"
										src="/assets/images/Tiger_images/tiger-logoutX400.png"
										alt={MyLearningCourseGridDataMessage}
									/>
									<p className="text-xs+ text-[#020A12]/60">{MyLearningCourseGridDataMessage}</p>
								</div>
							</>
						)}
					</div>
					{MyLearningCourseGridData?.MyLearningGridData?.length > 0 ? (
						<Pagination PaginationData={MyLearningCourseGridData} count={12} />
					) : null}
				</>
			)}
		</>
	);
}
