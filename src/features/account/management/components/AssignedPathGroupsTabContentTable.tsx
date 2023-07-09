import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { IAssignedGroupsForLearningPath } from "../@types";
import {
	useAssignedGroupForLearningPathQuery,
	useRemoveGroupFromLpMutation,
	useUnAssignedGroupsForLearningPathQuery
} from "../store";
interface IAssignedPathGroupsTabContentTableProps {
	isAssignedGroupForLearningFetching: boolean;
	assignedGroupsForLearningPath: IAssignedGroupsForLearningPath;
	assignedGroupsForLearningPathEmptyMessage: string;
	text: string;
}
function AssignedPathGroupsTabContentTable(props: IAssignedPathGroupsTabContentTableProps) {
	const [assignedGroupPageNumber, setAssignedGroupPageNumber] = useState(1);
	const [assignedGroupPageSize, setAssignedGroupPageSize] = useState(10);
	const location = useLocation();
	const { refetch } = useAssignedGroupForLearningPathQuery({
		PathID: location.state?.PathID,
		PageNumber: assignedGroupPageNumber,
		PageSize: assignedGroupPageSize
	});
	const {
		isAssignedGroupForLearningFetching,
		assignedGroupsForLearningPath,
		assignedGroupsForLearningPathEmptyMessage,
		text
	} = props;
	const [removeGroup, { isLoading }] = useRemoveGroupFromLpMutation();
	const { refetch: refetchGroupLists } = useUnAssignedGroupsForLearningPathQuery({
		PageNumber: 1,
		PageSize: 10,
		PathID: location.state?.PathID
	});
	const handleDeleteRemoveGroup = async (group: { GroupID: number; GroupName: string }) => {
		try {
			await removeGroup({ GroupID: group.GroupID, PathID: location.state?.PathID });
			refetchGroupLists();
		} catch (error) {
			console.error("error", error);
		}
	};
	useEffect(() => {
		refetch();
	}, [assignedGroupPageNumber, assignedGroupPageSize]);

	if (isAssignedGroupForLearningFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isAssignedGroupForLearningFetching && !assignedGroupsForLearningPath?.AssignedGroupByPathID?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={assignedGroupsForLearningPathEmptyMessage}
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
								Group ID
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Group Name
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{assignedGroupsForLearningPath?.AssignedGroupByPathID.filter(group =>
							group.GroupName.toLowerCase().includes(text.toLowerCase())
						).map((assignedGroup, i) => (
							<tr className="border-b-2 border-slate-200" key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">
									{assignedGroup.GroupID}
								</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">
									{assignedGroup.GroupName}
								</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<Tippy content={"Delete"} placement={"bottom"}>
										<div className="w-fit">
											<Icon
												icon={"material-symbols:delete-outline-rounded"}
												className={"cursor-pointer"}
												height={20}
												width={20}
												onClick={() => handleDeleteRemoveGroup(assignedGroup)}
											/>
										</div>
									</Tippy>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				PaginationData={{
					TotalPages: assignedGroupsForLearningPath.TotalPages,
					TotalItems: assignedGroupsForLearningPath.TotalItems
				}}
				isTableView={true}
				pageNumber={assignedGroupPageNumber}
				pageSize={assignedGroupPageSize}
				setPageNumber={setAssignedGroupPageNumber}
				setPageSize={setAssignedGroupPageSize}
			/>
		</>
	);
}

export default AssignedPathGroupsTabContentTable;
