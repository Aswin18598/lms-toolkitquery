import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { IUnAssignedGroupsForLearningPath } from "../@types";
import {
	useAssignGroupToLearningPathMutation,
	useGroupListForLearningPathQuery,
	useUnAssignedGroupsForLearningPathQuery
} from "../store";
interface IGroupsTabContentTableProps {
	isUnAssignedGroupFetching: boolean;
	unAssignedGroupsForLearningPath: IUnAssignedGroupsForLearningPath;
	text: string;
}
function GroupsTabContentTable(props: IGroupsTabContentTableProps) {
	const location = useLocation();
	const { isUnAssignedGroupFetching, unAssignedGroupsForLearningPath, text } = props;
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<any>(10);
	const { refetch: refetchGroupLists } = useUnAssignedGroupsForLearningPathQuery({
		PageNumber: pageNumber,
		PageSize: pageSize,
		PathID: location.state?.PathID
	});
	const [assignGroupToLearningPath, { isLoading }] = useAssignGroupToLearningPathMutation();
	const handleAssignGroupToLearningPath = async (group: { GroupID: number; GroupName: string }) => {
		try {
			await assignGroupToLearningPath({ GroupID: group.GroupID, PathID: location.state?.PathID }).unwrap();
			refetchGroupLists();
		} catch (error) {
			console.error("error", error);
		}
	};
	useEffect(() => {
		refetchGroupLists();
		return () => {
			if (pageNumber !== 1) setPageNumber(1);
			if (pageSize !== 10) setPageNumber(10);
		};
	}, [pageNumber, pageSize]);
	if (isUnAssignedGroupFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isUnAssignedGroupFetching && !unAssignedGroupsForLearningPath?.UnAssignedGroupByPathID?.length)
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
						{unAssignedGroupsForLearningPath?.UnAssignedGroupByPathID?.filter(group =>
							group.GroupName.toLowerCase().includes(text.toLowerCase())
						).map((g, i) => (
							<tr className="border-b-2 border-slate-200 last-of-type:border-none" key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{g.GroupID}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{g.GroupName}</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<Tippy content={"Add"} placement={"bottom"}>
										<div className="w-fit">
											<Icon
												icon={"material-symbols:add-circle-outline-rounded"}
												className={"cursor-pointer"}
												height={20}
												width={20}
												onClick={() => handleAssignGroupToLearningPath(g)}
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
					TotalItems: unAssignedGroupsForLearningPath.TotalItems,
					TotalPages: unAssignedGroupsForLearningPath.TotalPages
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

export default GroupsTabContentTable;
