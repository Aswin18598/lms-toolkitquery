import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/config/store";
import _ from "lodash";
import {
	useGetAddFavoriteItemMutation,
	useGetCertificateInfoQuery,
	useGetRemoveFavoriteItemMutation
} from "../store/query";
import { Spinner } from "~/components/spinner";
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
const LearningAssessmentTable = ({ loader, refetch }: IProps) => {
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
	const { MyLearningAssesmentGridData, MyLearningAssesmentGridDataMessage, CertificateInfo, PageNumber, PageSize } =
		useAppSelector((state: any) => state.learningReducer);
	const [startIndex, setStartIndex] = useState<number>(0);
	const [getAddFavoriteItem] = useGetAddFavoriteItemMutation();
	const [getRemoveFavoriteItem] = useGetRemoveFavoriteItemMutation();

	useEffect(() => {
		setStartIndex(PageNumber === 1 ? 0 : PageNumber * PageSize - PageSize);
	}, [PageNumber, PageSize]);

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
		}, 100);
	};

	const specificAssessment = (assessment: any) => {
		navigate(navigateLink.learningAssesmentDetails + "&" + assessment.ItemID);
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
					<div className="mt-6 overflow-auto">
						{MyLearningAssesmentGridData?.MyLearningGridData?.length > 0 ? (
							<table className="mb-0.5 is-hoverable w-full text-left">
								<thead className="bg-[#E2E8F0]">
									<tr className="border border-slate-150 font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
										<th className=" px-4 py-3 lg:px-5">S NO</th>
										<th className=" px-4 py-3 lg:px-5">TITLE</th>
										<th className=" px-4 py-3 lg:px-5">CATEGORY</th>
										<th className=" px-4 py-3 lg:px-5">STATUS</th>
										<th className=" px-4 py-3 lg:px-5">PERCENTAGE</th>
										<th className=" px-4 py-3 lg:px-5">ACTION</th>
									</tr>
								</thead>
								<tbody className="bg-[#FFFFFF]">
									{MyLearningAssesmentGridData.MyLearningGridData.map((item: any, index: number) => (
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
														onClick={() => specificAssessment(item)}
														title="View Detail"
													>
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.Title}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.CategoryName}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex items-center space-x-2 text-left">
														{item.Progress !== "Not Taken" && (
															<p className="text-sm font-dmsans text-[#020A12]/60">
																<Icon
																	icon={`${
																		item.Result === "Passed"
																			? "mingcute:certificate-fill"
																			: "jam:close-circle"
																	}`}
																	width="16"
																	height="16"
																	color={`${
																		item.Result === "Passed" ? "#4FC666" : "#D85C57"
																	}`}
																/>
															</p>
														)}
														<span>{item.Result ? item.Result : item.Progress}</span>
													</div>
												</td>
												<td className="whitespace-nowrap px-3 py-3 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{item.Progress === "Not Taken" ? 0 : item.Progress}%
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<button
															className="w-4 h-4 my-2 mx-2"
															title={"Favorite"}
															onClick={() => handleFavorites(item.ItemID, item.Favorite)}
														>
															<Icon
																icon={`${
																	item.Favorite !== 0
																		? "ri:heart-3-fill"
																		: "ri:heart-3-line"
																}`}
																color={`${
																	item.Favorite !== 0 ? "#d85c57" : "#020A12BD"
																}`}
															/>
														</button>
														<button
															className="w-4 h-4 my-2 ml-2"
															onClick={() =>
																handleCertficateDownload(+item.EventID, +item.ItemID, 2)
															}
															title={"Certificate"}
															disabled={+item.Progress !== 100}
														>
															<Icon
																className={`w-4 h-4 ${
																	item.Result === "Passed"
																		? "invert-[0%]"
																		: "invert-[80%]"
																}`}
																icon="fluent:certificate-20-regular"
																style={{ color: "rgba(2, 10, 18, 0.74)" }}
															/>
														</button>
														<button
															className="my-2 ml-4"
															onClick={() =>
																window.location.replace(
																	RedirectLinkAssesment(item.ItemID, locationEndPoint)
																)
															}
														>
															<p
																className="text-sm font-dmsans text-[#020A12]/60"
																title="Start Assessment"
															>
																<img
																	src="/assets/images/launch.svg"
																	width="16"
																	height="16"
																/>
															</p>
														</button>
													</div>
												</td>
											</tr>
										</>
									))}
								</tbody>
							</table>
						) : (
							<>
								<div className="flex flex-col text-center items-center mx-auto py-20">
									<img
										className="h-40 my-auto"
										src="assets/images/Tiger_images/tiger-logoutX400.png"
										alt={MyLearningAssesmentGridDataMessage}
									/>
									<p className="text-xs+ text-[#020A12]/60">{MyLearningAssesmentGridDataMessage}</p>
								</div>
							</>
						)}
					</div>
					{MyLearningAssesmentGridData?.MyLearningGridData?.length > 0 ? (
						<Pagination PaginationData={MyLearningAssesmentGridData} count={12} />
					) : null}
				</>
			)}
		</>
	);
};

export default LearningAssessmentTable;
