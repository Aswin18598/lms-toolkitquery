import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/spinner";
import _ from "lodash";
import { dispatch, useAppSelector } from "~/config/store";
import { useGetPurchasedHistoryQuery, useGetDownloadInvoiceMutation } from "../store/query";
import { setSelectedPageNumber, setSelectedPageSize, setSelectedSubscriptionsDetailsView } from "../store";
import { getLoggedUser } from "~/helpers/auth";
import { notify } from "~/helpers";
import Pagination from "./Pagination";
import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";

function PurchaseHistory() {
	const { UserId } = getLoggedUser();
	const navigate = useNavigate();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const { PageNumber, PageSize } = useAppSelector((state: any) => state.userSubscriptionsReducer);
	const { isLoading, refetch } = useGetPurchasedHistoryQuery({
		UserID: UserId,
		PageNumber: PageNumber,
		PageSize: PageSize
	});
	const { PurchasedHistory, PurchasedHistoryMessage } = useAppSelector(
		(state: any) => state.userSubscriptionsReducer
	);
	const [DownloadInvoice] = useGetDownloadInvoiceMutation();

	useEffect(() => {
		dispatch(setSelectedPageNumber(pageNumber));
		dispatch(setSelectedPageSize(pageSize));
		setTimeout(() => {
			refetch();
		}, 500);
	}, [pageNumber, pageSize]);

	const handleInvoiceDownload = async (OrderId: string) => {
		await DownloadInvoice(OrderId)
			.unwrap()
			.then((invoiceData: any) => {
				const a = document.createElement("a");
				if (invoiceData.Data.InvoiceType === "URL") {
					a.setAttribute("href", invoiceData.Data.ShortURL);
				} else if (invoiceData.Data.InvoiceType === "FILE") {
					a.setAttribute("href", "data:application/octet-stream;base64," + invoiceData.Data.FileContent);
					a.setAttribute("download", invoiceData.Data.FileName);
				}
				a.setAttribute("target", "_blank");
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			})
			.catch((error: any) => {
				notify("competency_error_message", error.data);
			});
	};
	const specificSubscriptiondetails = (Subscriptiondetails: any) => {
		dispatch(setSelectedSubscriptionsDetailsView(Subscriptiondetails.SubscriptionID));
		navigate(navigateLink.Subscriptiondetails, { state: { SID: Subscriptiondetails.SubscriptionID } });
	};

	return (
		<>
			{isLoading && (
				<div className="mx-auto my-40">
					<Spinner />
				</div>
			)}
			{!isLoading && (
				<>
					{PurchasedHistory?.usersPurchasedHistories?.length > 0 ? (
						<>
							<table className="mb-0.5 is-hoverable w-full text-left mt-5">
								<thead className="bg-[#E2E8F0]">
									<tr className="font-inter font-medium text-sm text-[#020A1299]/60 rounded-t-lg">
										<th className=" px-4 py-3 lg:px-5 rounded-tl-lg">#</th>
										<th className=" px-4 py-3 lg:px-5">SUBSCRIPTION</th>
										<th className=" px-4 py-3 lg:px-5">PURCHASE DATE</th>
										<th className=" px-4 py-3 lg:px-5">EXPIRY DATE</th>
										<th className=" px-4 py-3 lg:px-5">ACTION</th>
									</tr>
								</thead>
								<tbody>
									{PurchasedHistory.usersPurchasedHistories.map((history: any) => {
										return (
											<tr className="border border-b-slate-200" key={history.SNo}>
												<td className="whitespace-nowrap px-5 py-4 last:py-4">{history.SNo}</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div
														className="flex text-left cursor-pointer"
														onClick={() => specificSubscriptiondetails(history)}
														title="View Detail"
													>
														<p className=" text-sm font-dmsans text-[#020A12]/60">
															{history.SubscriptionName}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className=" text-sm font-dmsans text-[#020A12]/60">
															{history.PurchaseDate}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className=" text-sm font-dmsans text-[#020A12]/60">
															{history.ExpireDate}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<button
															className={
																"flex flex-row p-2 border border-b-slate-200 rounded-full " +
																(history.InvoiceType === "None" && "cursor-not-allowed")
															}
															disabled={history.InvoiceType === "None"}
															onClick={() =>
																handleInvoiceDownload(history.SalesOrderDetailID)
															}
														>
															<Icon
																className="w-5 h-5 mr-2"
																icon="material-symbols:download"
																color="#1268b3"
															/>{" "}
															<p className=" text-sm font-bold text-[#1268B3] mr-2">
																Invoice
															</p>
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							{PurchasedHistory?.TotalPages > 0 && (
								<Pagination
									PaginationData={PurchasedHistory}
									pageNumber={pageNumber}
									setPageNumber={setPageNumber}
									pageSize={pageSize}
									setPageSize={setPageSize}
								/>
							)}
						</>
					) : (
						<>
							<div className="flex flex-col text-center items-center mx-auto py-12">
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt={PurchasedHistoryMessage}
								/>
								<p className="text-xs+ text-[#020A12]/60">{PurchasedHistoryMessage}</p>
							</div>
						</>
					)}
				</>
			)}
		</>
	);
}

export default PurchaseHistory;
