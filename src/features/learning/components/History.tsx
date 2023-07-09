import { Fragment, useEffect, useState } from "react";
import _ from "lodash";
import { Icon } from "@iconify/react";
import {
	setCertificateDataToEmpty,
	setSelectedPageSize,
	useGetCertificateInfoQuery,
	useGetUserHistoryGridDataQuery
} from "../store";
import { useAppSelector } from "~/config/store";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import Pagination from "./Pagination";
import CertificateDownload from "~/helpers/CertificateDownload";
import { useDispatch } from "react-redux";
import { RedirectLinkAssesment, RedirectLinkCourse } from "~/helpers/RedirectLink";
import Tippy from "@tippyjs/react";

function History() {
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const { UserHistoryGridData, UserHistoryGridDataMessage, PageNumber, PageSize, CertificateInfo } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const dispatch = useDispatch();
	const UserDetail = getLoggedUser();
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const { isFetching, refetch } = useGetUserHistoryGridDataQuery(
		{
			UserID: UserDetail.UserId,
			PageNumber: PageNumber,
			PageSize: PageSize
		},
		{ skip: PageSize === 12 }
	);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(setSelectedPageSize(10));
	}, []);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [PageNumber, PageSize]);

	const handleClick = (Type: string, ItemID: number) => {
		if (Type === "Course") {
			navigate(navigateLink.LearningCoursedetail + "&" + ItemID);
		} else {
			navigate(navigateLink.learningAssesmentDetails + "&" + ItemID);
		}
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
			{isFetching && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!isFetching && (
				<>
					{UserHistoryGridData?.UserHistoryGridData?.length > 0 ? (
						<>
							<div className="col-span-12 bg-white overflow-x-auto rounded-lg border">
								<table className="is-hoverable w-full text-left">
									<thead>
										<tr className="bg-[#E2E8F0]">
											<th className="whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800 px-5 py-3">
												TYPE
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800 py-3">
												TITLE
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800 py-3">
												CATEGORY
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800 py-3">
												LAST ACCESS
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800">
												PROGRESS
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800">
												TIME SPENT
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 font-semibold uppercase text-slate-800">
												ACTION
											</th>
										</tr>
									</thead>
									<tbody>
										{UserHistoryGridData?.UserHistoryGridData?.map((item: any, index: number) => (
											<Fragment key={item.SNo + " " + index}>
												<tr
													className={`border-transparent border-b-slate-200`}
													key={item.ItemID}
												>
													<td className="whitespace-nowrap px-4 py-3 sm:px-5">
														{item.Type !== "Course" ? (
															<div className="w-8 h-8 bg-[#FFFDE6] rounded-md flex">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-4 w-4 text-[#FAA41A] m-2"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																>
																	<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
																	<line x1="9" y1="7" x2="13" y2="7" />{" "}
																	<line x1="9" y1="11" x2="13" y2="11" />
																</svg>
															</div>
														) : (
															<div className="w-8 h-8 bg-[#F5F7F9] rounded-md flex">
																<svg
																	width="12"
																	height="13"
																	viewBox="0 0 12 13"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																	className="m-2.5"
																>
																	<path
																		d="M9.33463 0.333984C10.3998 0.333984 11.3346 1.20065 11.3346 2.33398V11.0007C11.3346 12.134 10.4013 13.0007 9.33463 13.0007H2.0013C1.29839 13.0007 0.667969 12.3673 0.667969 11.6673V1.66732C0.667969 0.96441 1.3013 0.333984 2.0013 0.333984H9.33463ZM9.33463 1.66732H4.66797V11.6673H9.33463C9.67653 11.6673 10.0013 11.4073 10.0013 11.0007V2.33398C10.0013 1.9921 9.67463 1.66732 9.33463 1.66732ZM3.33464 1.66732H2.0013V11.6673H3.33464V1.66732Z"
																		fill="#1268B3"
																	/>
																</svg>
															</div>
														)}
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<button
															className="flex text-left "
															onClick={() => handleClick(item.Type, item.ItemID)}
															title="View Detail"
														>
															<p className="text-sm font-dmsans font-bold text-[#020A12]/60">
																{item.Title}
															</p>
														</button>
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.Category}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.LastAccess}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.Progress} %
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60">
																{item.tTime}
															</p>
														</div>
													</td>
													<td className="whitespace-nowrap py-4 last:py-4">
														<div className="flex text-left">
															<button
																onClick={() =>
																	handleCertficateDownload(
																		+item.EventID,
																		+item.ItemID,
																		item.Type === "Course" ? 1 : 2
																	)
																}
																disabled={+item.Progress !== 100}
															>
																<p
																	className="text-sm font-dmsans text-[#020A12]/60"
																	title="Certificate"
																>
																	<Icon
																		icon="fluent:certificate-24-regular"
																		className={` ${
																			item.Progress < 100 ? "invert-[80%]" : ""
																		}`}
																		width="16"
																		height="16"
																		style={{
																			color: "rgba(2, 10, 18, 0.74)"
																		}}
																	/>
																</p>
															</button>
															<button
																className="pl-5"
																onClick={() =>
																	window.location.replace(
																		item.Type === "Course"
																			? RedirectLinkCourse(
																					item.ItemID,
																					locationEndPoint
																			  )
																			: RedirectLinkAssesment(
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
															{item.Type === "Course" &&
																UserDetail.AccountType !== 2 &&
																item.ILT === 1 && (
																	<button
																		className="w-8 h-8 rounded-full"
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
											</Fragment>
										))}
									</tbody>
								</table>
							</div>
							<Pagination PaginationData={UserHistoryGridData} />
						</>
					) : (
						<>
							<div className="flex flex-col text-center items-center mx-auto py-20">
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt={UserHistoryGridDataMessage}
								/>
								<p className="text-xs+ text-[#020A12]/60">{UserHistoryGridDataMessage}</p>
							</div>
						</>
					)}
				</>
			)}
		</>
	);
}
export default History;
