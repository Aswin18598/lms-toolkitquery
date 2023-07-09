import React, { Fragment, useState } from "react";
import { Spinner, Spinner1 } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
import { useGetCurrentSubscriptionQuery } from "../store";
import Pagination from "./Pagination";

const CurrentSubscription = () => {
	const userDetails = getLoggedUser();
	const [PageNumber, setPageNumber] = useState<number>(1);
	const [PageSize, setPageSize] = useState<number>(10);
	const SubscriptionData = useGetCurrentSubscriptionQuery({
		AccountID: userDetails.AccountId,
		PageNumber: PageNumber,
		PageSize: PageSize
	});

	return (
		<>
			<div className="col-span-12">
				<div className="flex items-center space-x-4 py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
						Current Subscriptions
					</h2>
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
									{SubscriptionData.data?.Data?.currentSubscriptions?.map(
										(item: any, index: number) => (
											<Fragment key={item.index}>
												<tr
													key={index}
													className={`border-y border-transparent border-b-slate-200 dark:border-b-navy-500`}
												>
													<td className="whitespace-wrap px-3 py-4 last:py-4">
														<div className="flex text-left">
															<p className="text-sm font-dmsans text-[#020A12]/60 mx-auto">
																{(PageNumber === 1
																	? 0
																	: PageNumber * PageSize - PageSize) +
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
										)
									)}
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
			</div>
		</>
	);
};

export default CurrentSubscription;
