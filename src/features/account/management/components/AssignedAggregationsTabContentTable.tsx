import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { IAssignedAggregationsForLearningPath } from "../@types";
import { useAssignedAggregationsForLearningPathQuery, useRemoveAggregationFromLPMutation } from "../store";

interface IAssignedAggregationsTabContentTable {
	isAssignedAggregationsForLearningFetching: boolean;
	assignedAggregationsForLearningPath: IAssignedAggregationsForLearningPath;
	text: string;
}
function AssignedAggregationsTabContentTable(props: IAssignedAggregationsTabContentTable) {
	const { isAssignedAggregationsForLearningFetching, assignedAggregationsForLearningPath, text } = props;
	const location = useLocation();
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { refetch: reFetchAssignedAggregation } = useAssignedAggregationsForLearningPathQuery({
		PathID: location.state?.PathID,
		PageNumber: pageNumber,
		PageSize: pageSize
	});
	const [triggerRemoveAggregation] = useRemoveAggregationFromLPMutation();
	const handleRemoveAggregations = async (agg: { ID: number; PathID: number }) => {
		try {
			const response: any = await triggerRemoveAggregation({
				AggregationID: agg.ID,
				PathID: location.state.PathID
			});
			toast.success(response?.data?.Message, { id: "aggregation_remove_success_message" });
			reFetchAssignedAggregation();
		} catch (error) {
			console.error("error", error);
		}
	};
	useEffect(() => {
		reFetchAssignedAggregation();
	}, [pageNumber, pageSize]);
	if (isAssignedAggregationsForLearningFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (
		!isAssignedAggregationsForLearningFetching &&
		!assignedAggregationsForLearningPath?.LPAssignedAggregations?.length
	)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={"No Records Found"}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				<table className="w-full">
					<thead>
						<tr className="bg-table-header text-left">
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Source
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Title
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{assignedAggregationsForLearningPath?.LPAssignedAggregations?.filter(ag =>
							ag.Title.toLowerCase().includes(text.toLowerCase())
						)?.map((agg, i) => (
							<tr className="border-b-2 border-slate-200" key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{agg.Source}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{agg.Title}</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<div className="w-full flex items-center gap-2">
										<Tippy content={"Delete"} placement={"bottom"}>
											<div className="w-fit">
												<Icon
													icon={"material-symbols:delete-outline-rounded"}
													className={"cursor-pointer"}
													height={20}
													width={20}
													onClick={() => handleRemoveAggregations(agg)}
												/>
											</div>
										</Tippy>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				PaginationData={{
					TotalPages: assignedAggregationsForLearningPath.TotalPages,
					TotalItems: assignedAggregationsForLearningPath.TotalItems
				}}
				isTableView={true}
				pageNumber={pageNumber}
				pageSize={pageSize}
				setPageNumber={setPageNumber}
				setPageSize={setPageSize}
			/>
		</>
	);
}

export default AssignedAggregationsTabContentTable;
