import { Icon } from "@iconify/react";
import { useEffect, useRef, useState, Fragment } from "react";
import ElementPopper from "react-element-popper";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { useGetCheckTrialUserQuery, useGetSubscriptionsQuery } from "~/features/headersandmenu/store";
import { getLoggedUser } from "~/helpers/auth";
import {
	setSelectedSubscriptionsDetailsView,
	useCancelSubscriptionMutation,
	useReactivateSubscriptionMutation,
	useGetCurrentSubscriptionQuery
} from "../store";
import { toast } from "react-hot-toast";
import { useAddToCartMutation, useCartListQuery } from "~/features/cart/store";
import { ISubscriptionDetails } from "../@types";
import { Spinner } from "~/components/spinner";
import Pagination from "./Pagination";

function PurchasedList() {
	const userDetails = getLoggedUser();
	const [PageNumber, setPageNumber] = useState<number>(1);
	const [PageSize, setPageSize] = useState<number>(10);
	const { UserId } = getLoggedUser();
	const navigate = useNavigate();
	const CartList = useCartListQuery();
	const trialUser = useGetCheckTrialUserQuery(UserId);
	const [addCart] = useAddToCartMutation();
	const [CancelSubscriptionQuery] = useCancelSubscriptionMutation();
	const [ReactivateSubscriptionQuery] = useReactivateSubscriptionMutation();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const { refetch, isFetching } = useGetSubscriptionsQuery(UserId);
	const { Subscriptions } = useAppSelector((state: any) => state.headersandmenuReducer);
	const [shareOption, setShareOption] = useState<boolean>(false);
	const [shareOptionIndex, setShareOptionIndex] = useState<string>("");
	const ref: any = useRef();

	const SubscriptionData = useGetCurrentSubscriptionQuery({
		AccountID: userDetails.AccountId,
		PageNumber: PageNumber,
		PageSize: PageSize
	});

	const handleShare = (subId: string) => {
		setShareOption(true);
		setShareOptionIndex(shareOptionIndex === subId ? "" : subId);
	};

	const handleMailto = () => {
		setShareOption(false);
		setShareOptionIndex("");
	};

	const specificSubscriptiondetails = (Subscriptiondetails: any) => {
		dispatch(setSelectedSubscriptionsDetailsView(Subscriptiondetails.SubscriptionID));
		navigate(navigateLink.Subscriptiondetails, { state: { SID: Subscriptiondetails.SubscriptionID } });
	};

	const handleCancelSubscription = (SalesOrderDetailID: string) => {
		CancelSubscriptionQuery(SalesOrderDetailID)
			.unwrap()
			.then((res: any) => toast.success(res.Message))
			.catch((err: any) => toast.error(err.data.Message))
			.finally(() =>
				setTimeout(() => {
					refetch();
					trialUser.refetch();
				}, 5000)
			);
	};

	const handleReActivateSubscription = (SalesOrderDetailID: string) => {
		ReactivateSubscriptionQuery(SalesOrderDetailID)
			.unwrap()
			.then((res: any) => toast.success(res.Message))
			.catch((err: any) => toast.error(err.data.Message))
			.finally(() =>
				setTimeout(() => {
					refetch();
					trialUser.refetch();
				}, 5000)
			);
	};

	const handleRenewalSubscription = async (subscriptionDetails: ISubscriptionDetails) => {
		try {
			await addCart({
				PurchaseType: subscriptionDetails.PurchaseType,
				subscriptionId: subscriptionDetails.SubscriptionID
			}).unwrap();
			refetch();
			CartList.refetch();
			trialUser.refetch();
		} catch (error: any) {
			console.error("error", error);
		}
	};

	useEffect(() => {
		function handleClickOutside(e: any) {
			console.log(e.target.classList);

			if (!(e.target.classList.contains("handleMailto") || e.target.classList.contains("handleShare"))) {
				setShareOption(false);
				setShareOptionIndex("");
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<>
			{isFetching && (
				<div className="mx-auto my-40">
					<Spinner />
				</div>
			)}
			{!isFetching && (
				<>
					<div className="flex flex-wrap gap-6 pt-5">
						<h2 className="text-base w-full font-bold text-slate-800 dark:text-navy-50 pb-5 lg:text-xl">
							Expired
						</h2>
						{Subscriptions?.ExpiredSubscriptions?.length > 0 ? (
							Subscriptions?.ExpiredSubscriptions.map((expiredData: ISubscriptionDetails) => (
								<div className="flex flex-col w-full lg:flex-row p-4 border rounded-lg bg-[#FFFFFF] justify-between align-content-center">
									<div className="flex flex-row justify-between lg:w-5/12">
										<div className="flex pr-4">
											<div className="w-28 aspect-[2/1] h-14 object-contain flex justify-center items-center">
												<img
													className="rounded-xl"
													src={imageUrl + expiredData.Image}
													alt="expired"
													onError={({ currentTarget }) => {
														currentTarget.onerror = null;
														currentTarget.src = "assets/images/user-pic.svg";
													}}
												/>
											</div>

											<div className="flex flex-col justify-around pl-4">
												<button
													className="text-base text-left color-[#020A12BD] font-bold"
													onClick={() => specificSubscriptiondetails(expiredData)}
													title="View Detail"
												>
													{expiredData.SubscriptionName}
												</button>
												<div className="flex flex-row items-center">
													<span className=" line-clamp-1">
														{expiredData?.CourseCount ? expiredData?.CourseCount : "0"}{" "}
														courses
													</span>{" "}
													<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
													<span className="ml-0 line-clamp-1">
														{expiredData?.AssessmentCount
															? expiredData?.AssessmentCount
															: "0"}{" "}
														assessments
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-row justify-between mt-5 lg:mt-0 lg:w-7/12">
										<div className="flex flex-col justify-center items-start">
											<span className="text-[#D85C57] font-bold">Expired</span>
											<span>Ends In : {expiredData.ExpireDate.split("T")[0]}</span>
										</div>
										<div className="flex flex-col justify-center items-start">
											{/* <span>1 year plan</span> */}
											<span>
												{(expiredData.Currency === "INR" ? "\u20B9" : "\u0024") +
													expiredData.Price}
											</span>
										</div>
										<ElementPopper
											ref={ref}
											offsetX={0}
											offsetY={0}
											active={shareOption && shareOptionIndex === expiredData.SalesOrderDetailID}
											popper={
												<div className="flex flex-col gap-4 bg-white rounded-lg p-3 border border-slate-300">
													<a
														href={
															"mailto:?subject=Subscription&body=Hi,%0D%0A%0D%0A I am sharing the below Subscription to you.%0D%0A%0D%0A" +
															window.location.href +
															"%0D%0A%0D%0ARegards,%0D%0ATeam iGETIT"
														}
														target="_self"
														onClick={handleMailto}
														className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
													>
														<Icon icon="mingcute:mail-send-line" width="16" height="16" />
														<span>Share</span>
													</a>
													{expiredData.RenewSubscription === "Yes" && (
														<button
															className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
															onClick={() => handleRenewalSubscription(expiredData)}
														>
															<Icon
																icon="wpf:renew-subscription"
																width="16"
																height="16"
																className="text-success"
															/>
															<span>Renew</span>
														</button>
													)}
													{expiredData.ReacitivateSubscription === "Yes" && (
														<button
															className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
															onClick={() =>
																handleReActivateSubscription(
																	expiredData.SalesOrderDetailID
																)
															}
														>
															<Icon
																icon="ic:round-autorenew"
																width="20"
																height="20"
																className="text-success"
															/>
															<span>Re-Activate</span>
														</button>
													)}
												</div>
											}
											position={"left-start"}
											containerClassName="flex flex-row items-center handleMailto"
											containerStyle={{ display: "flex", height: "100%" }}
											element={
												<button
													className="handleShare flex justify-center cursor-pointer px-4 z-10"
													title="More"
													onClick={() => handleShare(expiredData.SalesOrderDetailID)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														aria-hidden="true"
														role="img"
														className="w-6 h-6 z-0 handleShare iconify iconify--mdi"
														width="1em"
														height="1em"
														preserveAspectRatio="xMidYMid meet"
														viewBox="0 0 24 24"
													>
														<path
															className="handleShare"
															fill="currentColor"
															d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2Z"
														></path>
													</svg>
												</button>
											}
										/>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col text-center items-center mx-auto">
								{/* <img
							className="h-40 my-auto"
							src="assets/images/Tiger_images/tiger-logoutX400.png"
							alt="No record found"
						/> */}
								<p className="text-xs+ text-[#020A12]/60">
									No expired subscription exists for the given criteria.
								</p>
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-6 pt-5">
						<h2 className="text-base w-full font-bold text-slate-800 dark:text-navy-50 pb-5 lg:text-xl">
							Active
						</h2>
						{Subscriptions?.ActiveSubscriptions?.length > 0 ? (
							Subscriptions?.ActiveSubscriptions?.map((activeData: ISubscriptionDetails) => (
								<div className="flex w-full flex-col lg:flex-row p-4 border rounded-lg bg-[#FFFFFF] justify-between align-content-center mb-4">
									<div className="flex flex-row lg:w-5/12">
										{/* <div className="flex "> */}
										<div className="w-28 aspect-[2/1] h-14 object-contain flex justify-center items-center">
											<img
												className="rounded-xl"
												src={imageUrl + activeData.Image}
												alt="Active"
												onError={({ currentTarget }) => {
													currentTarget.onerror = null;
													currentTarget.src = "assets/images/user-pic.svg";
												}}
											/>
										</div>

										<div className="flex flex-col justify-around pl-4">
											<button
												className="text-base text-left color-[#020A12BD] font-bold"
												onClick={() => specificSubscriptiondetails(activeData)}
												title="View Detail"
											>
												{activeData.SubscriptionName}
											</button>
											<div className="flex flex-row items-center">
												<span className=" line-clamp-1">
													{activeData?.CourseCount ? activeData?.CourseCount : "0"} courses
												</span>{" "}
												<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
												<span className="ml-0 line-clamp-1">
													{activeData?.AssessmentCount ? activeData?.AssessmentCount : "0"}{" "}
													assessments
												</span>
											</div>
										</div>
										{/* </div> */}
									</div>
									<div className="flex flex-row justify-between mt-5 lg:mt-0 lg:w-7/12">
										<div className="flex flex-col justify-center items-start">
											<span className="text-[#4FC666] font-bold">Active</span>
											<span>Ends In: {activeData.ExpireDate.split("T")[0]}</span>
										</div>
										<div className="flex flex-col justify-center items-start">
											{/* <span>1 year plan</span> */}
											<span>
												{(activeData.Currency === "INR" ? "\u20B9" : "\u0024") +
													activeData.Price}
											</span>
										</div>
										<ElementPopper
											ref={ref}
											offsetX={0}
											offsetY={0}
											active={shareOption && shareOptionIndex === activeData.SalesOrderDetailID}
											// zIndex={20}
											popper={
												<div className="flex flex-col gap-4 bg-white rounded-lg p-3 border border-slate-300">
													<a
														href={
															"mailto:?subject=Subscription&body=Hi,%0D%0A%0D%0A I am sharing the below Subscription to you.%0D%0A%0D%0A" +
															window.location.href +
															"%0D%0A%0D%0ARegards,%0D%0ATeam iGETIT"
														}
														target="_self"
														onClick={handleMailto}
														className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
													>
														<Icon icon="mingcute:mail-send-line" width="16" height="16" />
														<span>Share</span>
													</a>
													{activeData.CancelSubscription === "Yes" && (
														<button
															className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
															onClick={() =>
																handleCancelSubscription(activeData.SalesOrderDetailID)
															}
														>
															<Icon
																icon="material-symbols:cancel-outline-rounded"
																width="16"
																height="16"
																className="text-error"
															/>
															<span>Cancel</span>
														</button>
													)}
													{activeData.RenewSubscription === "Yes" && (
														<button
															className="btn cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
															onClick={() => handleRenewalSubscription(activeData)}
														>
															<Icon
																icon="wpf:renew-subscription"
																width="16"
																height="16"
																className="text-success"
															/>
															<span>Renew</span>
														</button>
													)}
												</div>
											}
											position={"left-start"}
											containerClassName="handleMailto flex flex-row items-center"
											containerStyle={{ display: "flex", height: "100%" }}
											element={
												<button
													className="handleShare flex justify-center cursor-pointer px-4 z-10"
													title="More"
													onClick={() => handleShare(activeData.SalesOrderDetailID)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														aria-hidden="true"
														role="img"
														className="w-6 h-6 z-0 handleShare iconify iconify--mdi"
														width="1em"
														height="1em"
														preserveAspectRatio="xMidYMid meet"
														viewBox="0 0 24 24"
													>
														<path
															className="handleShare"
															fill="currentColor"
															d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2Z"
														></path>
													</svg>
												</button>
											}
										/>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col text-center items-center mx-auto">
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt="No record found"
								/>
								<p className="text-xs+ text-[#020A12]/60">
									No Active Subscriptions exists for the given criteria.
								</p>
							</div>
						)}
					</div>
				</>
			)}

			<div className="col-span-12">
				<div className="flex items-center space-x-4 py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
						Current Subscriptions
					</h2>
				</div>
			</div>
			{SubscriptionData.isFetching && (
				<div className="flex flex-col bg-white rounded-lg border border-gray-200 text-center items-center mx-auto py-16">
					<Spinner />
				</div>
			)}
			{!SubscriptionData.isFetching && SubscriptionData.data?.Data?.currentSubscriptions?.length > 0 && (
				<>
					<div className="grid-cols-12 grid bg-white rounded-lg overflow-x-scroll scrollbar-hide border border-gray-200">
						<table className="col-span-12 is-hoverable w-full">
							<thead>
								<tr>
									<th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-3 py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
										#
									</th>
									<th className="whitespace-nowrap bg-slate-200 px-1 lg:px-auto py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100 text-left">
										SUBSCRIPTION NAME
									</th>
									<th className="whitespace-nowrap bg-slate-200 px-1 lg:px-auto py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100 text-left">
										FULLFILLMENT ID
									</th>
									<th className="whitespace-nowrap bg-slate-200 px-1 lg:px-auto py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
										QUANTITY
									</th>
									<th className="whitespace-nowrap bg-slate-200 px-1 lg:px-auto py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100">
										REMAINING
									</th>
									<th className="whitespace-nowrap bg-slate-200 px-1 lg:px-auto py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100 text-left">
										EXPIRY DATE
									</th>
								</tr>
							</thead>
							<tbody className="bg-white">
								{SubscriptionData.data?.Data?.currentSubscriptions?.map((item: any, index: number) => (
									<Fragment key={item.index}>
										<tr
											key={index}
											className={`border-y border-transparent border-b-slate-200 dark:border-b-navy-500`}
										>
											<td className="whitespace-wrap px-3 py-4 last:py-4">
												<div className="flex text-left">
													<p className="text-sm font-dmsans text-[#020A12]/60 mx-auto">
														{(PageNumber === 1 ? 0 : PageNumber * PageSize - PageSize) +
															index +
															1}
													</p>
												</div>
											</td>
											<td className="whitespace-wrap  px-1 lg:px-auto py-4 last:py-2">
												<div className="flex items-center">
													<p className="text-sm font-dmsans text-[#020A12]/60">
														{item.BundleName}
													</p>
												</div>
											</td>
											<td className="whitespace-wrap  px-1 lg:px-auto py-4 last:py-2">
												<div className="flex items-center">
													<p className="text-sm font-dmsans text-[#020A12]/60">
														{item.FulfillmentID}
													</p>
												</div>
											</td>
											<td className="whitespace-wrap  px-1 lg:px-auto py-4 last:py-2">
												<div className="flex items-center">
													<p className="text-sm font-dmsans text-[#020A12]/60 mx-auto">
														{item.TotalQuantity}
													</p>
												</div>
											</td>
											<td className="whitespace-wrap  px-1 lg:px-auto py-4 last:py-2">
												<div className="flex items-center">
													<p className="text-sm font-dmsans text-[#020A12]/60 mx-auto">
														{item.RemainingQuantity}
													</p>
												</div>
											</td>
											<td className="whitespace-wrap  px-1 lg:px-auto py-4 last:py-2">
												<div className="flex items-center">
													<p className="text-sm font-dmsans text-[#020A12]/60">
														{item.ExpireDate}
													</p>
												</div>
											</td>
										</tr>
									</Fragment>
								))}
							</tbody>
						</table>
					</div>
					<Pagination
						PaginationData={SubscriptionData.data?.Data}
						pageNumber={PageNumber}
						setPageNumber={setPageNumber}
						pageSize={PageSize}
						setPageSize={setPageSize}
					/>
				</>
			)}
			{!SubscriptionData.isFetching &&
				(SubscriptionData.data?.Data?.currentSubscriptions?.length === 0 ||
					SubscriptionData.data?.Data?.TotalItems === 0) && (
					<div className="flex flex-col bg-white rounded-lg border border-gray-200 text-center items-center mx-auto py-16">
						<p className="text-sm font-dmsans text-[#020A12]/60">{SubscriptionData.data?.Message}</p>
					</div>
				)}
		</>
	);
}

export default PurchasedList;
