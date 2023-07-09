import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { notify } from "~/helpers";
import { IAssessmentsForLearningPath } from "../@types";
import {
	assignedLearning,
	useAssessmentsForLearningPathQuery,
	useAssignedCoursesAndAssessmentsQuery,
	useLearningPathItemActionMutation
} from "../store";
interface IAssessmentsTabContentTableProps {
	assessmentsForLearningPath: {
		AssessmentsForLearningPath: IAssessmentsForLearningPath[];
		PageNumber: number;
		PageSize: number;
		TotalItems: number;
		TotalPages: number;
	};
	assessmentsForLearningPathEmptyMessage: string;
	isAssessmentsForLearningPathFetching: boolean;
	text: string;
	category: number;
	subCategory: number;
}

function AssessmentsTabContentTable(props: IAssessmentsTabContentTableProps) {
	const location = useLocation();
	const { assignedCoursesAndAssessments } = useAppSelector(assignedLearning);
	const {
		assessmentsForLearningPath,
		assessmentsForLearningPathEmptyMessage,
		isAssessmentsForLearningPathFetching,
		text,
		category,
		subCategory
	} = props;
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const { refetch: refetchAssesments } = useAssessmentsForLearningPathQuery({
		PageNumber: pageNumber,
		PageSize: pageSize,
		CategoryID: category,
		SubcategoryID: subCategory
	});
	const [triggerLPItemAction, { isLoading }] = useLearningPathItemActionMutation();
	const { refetch } = useAssignedCoursesAndAssessmentsQuery({
		PathID: location?.state?.PathID,
		PageNumber: 1,
		PageSize: 10
	});
	const handleAddLpItem = (item: IAssessmentsForLearningPath) => {
		triggerLPItemAction({
			PathID: location?.state?.PathID,
			ItemID: item.ID,
			Action: "ADD",
			ItemSequence:
				assignedCoursesAndAssessments?.LearningPathItems?.length > 0
					? assignedCoursesAndAssessments?.LearningPathItems?.length + 1
					: 1,
			ItemType: 2
		})
			.then((response: any) => {
				if (response?.data?.Message) {
					toast.success(response?.data?.Message, { id: "new_assessment_added" });
				}
				if (response?.error?.data?.Message) {
					notify("addNewLP", { Message: response?.error?.data?.Message });
					return undefined;
				}
				refetch();
			})
			.catch((error: any) => {
				notify("addNewLP", { Message: error?.error?.data?.Message });
			});
	};
	useEffect(() => {
		refetchAssesments();
	}, [pageNumber, pageSize]);
	if (isAssessmentsForLearningPathFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isAssessmentsForLearningPathFetching && !assessmentsForLearningPath?.AssessmentsForLearningPath?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={assessmentsForLearningPathEmptyMessage}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				{isLoading && (
					<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
						<Spinner />
					</section>
				)}
				<table className="w-full">
					<thead>
						<tr className="bg-table-header text-left">
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Assessment ID
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
						{assessmentsForLearningPath?.AssessmentsForLearningPath.filter(co =>
							co.Title.toLowerCase().includes(text.toLowerCase())
						).map((a: IAssessmentsForLearningPath, i: number) => (
							<tr className="border-b-2 border-slate-200" key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{a?.ID}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{a?.Title}</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<div className="w-fit" title="Add">
										<Icon
											icon={"material-symbols:add-circle-outline-rounded"}
											className={"cursor-pointer"}
											height={20}
											width={20}
											onClick={() => handleAddLpItem(a)}
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				PaginationData={{
					TotalPages: assessmentsForLearningPath?.TotalPages,
					TotalItems: assessmentsForLearningPath?.TotalItems
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

export default AssessmentsTabContentTable;
