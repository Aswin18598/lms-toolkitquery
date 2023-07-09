import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { notify } from "~/helpers";
import { IIntegrationsForLearningPath } from "../@types";
import {
	assignedLearning,
	useAssignedCoursesAndAssessmentsQuery,
	useIntegrationsForLearningPathQuery,
	useLearningPathIntegrationActionMutation,
	useLearningPathItemActionMutation
} from "../store";
interface IIntegrationTabContentTableProps {
	integrationsForLearningPath: {
		IntegrationsForLearningPath: IIntegrationsForLearningPath[];
		PageNumber: number;
		PageSize: number;
		TotalItems: number;
		TotalPages: number;
	};
	integrationsForLearningPathEmptyMessage: string;
	isIntegrationsForLearningFetching: boolean;
	text: string;
	refetchIntegrations: () => void;
}
function IntegrationTabContentTable(props: IIntegrationTabContentTableProps) {
	const {
		integrationsForLearningPath,
		integrationsForLearningPathEmptyMessage,
		isIntegrationsForLearningFetching,
		text,
		refetchIntegrations
	} = props;
	const location = useLocation();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const { assignedCoursesAndAssessments } = useAppSelector(assignedLearning);
	const { refetch } = useIntegrationsForLearningPathQuery({ PageNumber: pageNumber, PageSize: pageSize });
	const { refetch: refetchAssignedCoursesAssessmentsAndAggregations } = useAssignedCoursesAndAssessmentsQuery({
		PathID: location?.state?.PathID,
		PageNumber: 1,
		PageSize: 10
	});
	const [triggerLPItemAction, { isLoading: isAdding }] = useLearningPathItemActionMutation();
	const [removeLearningPathIntegration, { isLoading: isRemoving }] = useLearningPathIntegrationActionMutation();
	useEffect(() => {
		refetch();
	}, [pageNumber, pageSize]);
	const handleAddAggregationToLP = async (aggregation: IIntegrationsForLearningPath) => {
		try {
			const response: any = await triggerLPItemAction({
				Action: "ADD",
				ItemID: aggregation.ID,
				ItemSequence:
					assignedCoursesAndAssessments?.LearningPathItems?.length > 0
						? assignedCoursesAndAssessments?.LearningPathItems?.length + 1
						: 1,
				PathID: location.state?.PathID,
				ItemType: 3
			});
			if (response?.error?.status) {
				notify("assignAggregationToLearningPath_error_message", response?.error?.data);
				return undefined;
			}
			toast.success(response?.data?.Message, { id: "aggregation_added_success_message" });
			refetchAssignedCoursesAssessmentsAndAggregations();
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleRemoveAggregations = async (aggregation: IIntegrationsForLearningPath) => {
		try {
			await removeLearningPathIntegration({
				Action: "D",
				ID: aggregation.ID
			});
			refetchIntegrations();
			refetchAssignedCoursesAssessmentsAndAggregations();
		} catch (error) {
			console.error("error", error);
		}
	};
	if (isIntegrationsForLearningFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isIntegrationsForLearningFetching && !integrationsForLearningPath?.IntegrationsForLearningPath?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={integrationsForLearningPathEmptyMessage}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				{(isAdding || isRemoving) && (
					<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
						<Spinner />
					</section>
				)}
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
						{integrationsForLearningPath.IntegrationsForLearningPath.filter(int =>
							int.Title.toLowerCase().includes(text.toLowerCase())
						).map((integ, i) => (
							<tr className="border-b-2 border-slate-200" key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{integ.Source}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{integ.Title}</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<div className="w-full flex items-center gap-2">
										<Tippy content={"Delete"} placement={"bottom"}>
											<div className="w-fit">
												<Icon
													icon={"material-symbols:delete-outline-rounded"}
													className={"cursor-pointer"}
													height={20}
													width={20}
													onClick={() => handleRemoveAggregations(integ)}
												/>
											</div>
										</Tippy>
										<Tippy content={"Add"} placement={"bottom"}>
											<div className="w-fit">
												<Icon
													icon={"material-symbols:add-circle-outline-rounded"}
													className={"cursor-pointer"}
													height={20}
													width={20}
													onClick={() => handleAddAggregationToLP(integ)}
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
					TotalItems: integrationsForLearningPath.TotalItems,
					TotalPages: integrationsForLearningPath.TotalPages
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

export default IntegrationTabContentTable;
