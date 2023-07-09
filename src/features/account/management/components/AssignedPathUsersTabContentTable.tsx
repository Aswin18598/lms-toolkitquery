import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { notify } from "~/helpers";
import { IAssignedUsersForLearningPath } from "../@types";
import {
	useAddLPNotificationMutation,
	useAssignedUsersForLearningPathQuery,
	useRemoveUserFromLpMutation
} from "../store";
interface IAssignedUsersTabContentTableProps {
	isAssignedUsersForLearningFetching: boolean;
	assignedUsersForLearningPath: IAssignedUsersForLearningPath;
	assignedUsersForLearningPathEmptyMessage: string;
	text: string;
	refetchAssignedUsers: () => void;
}
function AssignedPathUsersTabContentTable(props: IAssignedUsersTabContentTableProps) {
	const [assignedUserPageNumber, setAssignedUserPageNumber] = useState(1);
	const [assignedUserPageSize, setAssignedUserPageSize] = useState(10);
	const location = useLocation();
	const { refetch } = useAssignedUsersForLearningPathQuery({
		PageNumber: assignedUserPageNumber,
		PageSize: assignedUserPageSize,
		PathID: location.state?.PathID
	});
	const [removeUser, { isLoading }] = useRemoveUserFromLpMutation();
	const [triggerAddLPNotification, { isLoading: isNotificationSentLoading }] = useAddLPNotificationMutation();
	const {
		isAssignedUsersForLearningFetching,
		assignedUsersForLearningPath,
		assignedUsersForLearningPathEmptyMessage,
		text,
		refetchAssignedUsers
	} = props;
	const handleRemoveUserFromLp = async (user: { UserID?: number | string }) => {
		try {
			await removeUser({ PathID: location.state?.PathID, UserID: user?.UserID });
			refetchAssignedUsers();
		} catch (error) {
			console.error("error", error);
		}
	};
	useEffect(() => {
		refetch();
	}, [assignedUserPageNumber, assignedUserPageSize]);
	const handleSendNotification = () => {
		const remainderData = {
			PathID: location.state?.PathID,
			Message:
				"Your <strong>Assigned Learning</strong> has been updated by a Manager. Please visit the Learning section to begin taking your assigned materials.",
			Link: "/Learning/Catalog#Assigned"
		};
		triggerAddLPNotification({ ...remainderData })
			.then((response: any) => {
				if (response?.data?.Message) {
					toast.success(response?.data?.Message, { id: "notification_sent_success_message" });
				}
				if (response?.error?.data?.Message) {
					notify("notification_sent_error_message", { Message: response?.error?.data?.Message });
				}
			})
			.catch((error: any) => {
				notify("notification_sent_error_message", { Message: error?.error?.data?.Message });
			});
	};
	if (isAssignedUsersForLearningFetching || isNotificationSentLoading)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isAssignedUsersForLearningFetching && !assignedUsersForLearningPath?.AssignedUsersForLearningPaths?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={assignedUsersForLearningPathEmptyMessage}
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
								First Name
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Last Name
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Email
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{assignedUsersForLearningPath?.AssignedUsersForLearningPaths.filter(
							u =>
								u.FirstName.toLowerCase().includes(text.toLowerCase()) ||
								u.LastName.toLowerCase().includes(text.toLowerCase()) ||
								u.Email.toLowerCase().includes(text.toLowerCase())
						).map((assignedUser, i) => (
							<tr className="border-b-2 border-slate-200 " key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">
									{assignedUser.FirstName}
								</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">
									{assignedUser.LastName}
								</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">
									{assignedUser.Email}
								</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<div className="w-full flex justify-between">
										<Tippy content={"Send Notification"} placement={"bottom"}>
											<div className="w-fit">
												<Icon
													icon={"heroicons-outline:speakerphone"}
													width={20}
													height={20}
													className={"cursor-pointer"}
													onClick={handleSendNotification}
												/>
											</div>
										</Tippy>
										<Tippy content={"Delete"} placement={"bottom"}>
											<div className="w-fit">
												<Icon
													icon={"material-symbols:delete-outline-rounded"}
													className={"cursor-pointer"}
													height={20}
													width={20}
													onClick={() => handleRemoveUserFromLp(assignedUser)}
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
					TotalPages: assignedUsersForLearningPath.TotalPages,
					TotalItems: assignedUsersForLearningPath.TotalItems
				}}
				isTableView={true}
				pageNumber={assignedUserPageNumber}
				pageSize={assignedUserPageSize}
				setPageNumber={setAssignedUserPageNumber}
				setPageSize={setAssignedUserPageSize}
			/>
		</>
	);
}

export default AssignedPathUsersTabContentTable;
