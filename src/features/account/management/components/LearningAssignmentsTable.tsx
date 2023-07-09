import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import React, { Fragment, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { notify } from "~/helpers";
import { ILearningAssignments } from "../@types";
import { assignedLearning, useAddLPNotificationMutation, useLearningPathActionsInputMutation } from "../store";
import AssignedLearningTableHeader from "./AssignedLearningTableHeader";
import NotificationSentSnackbar from "./NotificationSentSnackbar";

interface ILearningAssignmentsTableProps {
	icons: { icon: string; name: string }[];
	isLearningAssignmentFetching: boolean;
	refetch: () => void;
	assignmentPageNumber: number;
	assignmentPageSize: number;
	setAssignmentPageNumber: React.Dispatch<React.SetStateAction<number>>;
	setAssignmentPageSize: React.Dispatch<React.SetStateAction<number>>;
}
function LearningAssignmentsTable(props: ILearningAssignmentsTableProps) {
	const [isNotificationSent, setIsNotificationSent] = useState(false);
	const navigate = useNavigate();
	const { learningAssignments, learningAssignmentEmptyMessage } = useAppSelector(assignedLearning);
	const [removeLearningPath, { isLoading: isDeleting }] = useLearningPathActionsInputMutation();
	const [triggerAddLPNotification] = useAddLPNotificationMutation();
	const {
		icons,
		isLearningAssignmentFetching,
		refetch,
		assignmentPageNumber,
		assignmentPageSize,
		setAssignmentPageNumber,
		setAssignmentPageSize
	} = props;

	const handleActionItemsClick = (iconName: string, assignments: ILearningAssignments) => {
		if (iconName === "Edit") {
			navigate(`/account/assigned-learning/edit/${assignments.PathID}`, { state: { ...assignments } });
		}
		if (iconName === "Send Notification") {
			const remainderData = {
				PathID: assignments.PathID,
				Message:
					"Your <strong>Assigned Learning</strong> has been updated by a Manager. Please visit the Learning section to begin taking your assigned materials.",
				Link: "/Learning/Catalog#Assigned"
			};
			triggerAddLPNotification({ ...remainderData })
				.then((response: any) => {
					if (response?.data?.Message) {
						setIsNotificationSent(true);
					}
				})
				.catch((error: any) => {
					console.error("error", error);
				});
		}
		if (iconName === "Delete") {
			confirmAlert({
				message: "Are you sure you want to delete this Path?",
				buttons: [
					{
						label: "Yes,Delete",
						onClick: () => {
							removeLearningPath({ Action: "D", TypeID: assignments.TypeID, PathID: assignments.PathID })
								.then((response: any) => {
									if (response?.data?.Message) {
										toast.success(response?.data?.Message, { id: "assignmentsDelete_message" });
										refetch();
									}
									if (response?.error?.data?.Message) {
										notify("assignmentsDelete_error_message", {
											Message: response?.error?.data?.Message
										});
										return undefined;
									}
								})
								.catch(error => {
									console.error(error);
								});
						}
					},
					{
						label: "No"
					}
				]
			});
		}
	};

	if (isLearningAssignmentFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isLearningAssignmentFetching && !learningAssignments?.LearningAssignments?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={learningAssignmentEmptyMessage}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				{isNotificationSent && (
					<NotificationSentSnackbar
						isNotificationSent={isNotificationSent}
						setIsNotificationSent={setIsNotificationSent}
					/>
				)}
				{isDeleting && (
					<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
						<Spinner />
					</section>
				)}
				<table className="w-full text-left">
					<AssignedLearningTableHeader />
					<tbody className="bg-white">
						{learningAssignments?.LearningAssignments?.map(
							(assignments: ILearningAssignments, index: any) => (
								<Fragment key={index}>
									<tr
										className={`border border-transparent border-b-slate-200 dark:border-b-navy-500`}
									>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{`${
														(assignmentPageNumber - 1) * assignmentPageSize + index + 1
													}`.padStart(2, "0")}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.PathID}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.Name}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.CoursesCount}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left">
												<p className="text-sm font-dmsans text-[#020A12]/60">
													{assignments?.AssessmentsCount}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
											<div className="flex text-left gap-8 items-center">
												<div className="flex gap-6 items-center">
													{icons.map((item, i) => (
														<Tippy content={item.name} placement={"bottom"}>
															{item.name === "Download" ? (
																<div>
																	<CSVLink
																		data={[
																			Object.keys(assignments),
																			Object.values(assignments)
																		]}
																		filename={`course${index + 1}-details`}
																		target={"_blank"}
																	>
																		<Icon
																			key={i}
																			icon={item.icon}
																			className={"cursor-pointer"}
																			width={20}
																			height={20}
																		/>
																	</CSVLink>
																</div>
															) : (
																<div>
																	<Icon
																		key={i}
																		icon={item.icon}
																		className={"cursor-pointer"}
																		width={20}
																		height={20}
																		onClick={() =>
																			handleActionItemsClick(
																				item.name,
																				assignments
																			)
																		}
																	/>
																</div>
															)}
														</Tippy>
													))}
												</div>
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
				PaginationData={{
					TotalItems: learningAssignments.TotalItems,
					TotalPages: learningAssignments.TotalPages
				}}
				isTableView={true}
				pageNumber={assignmentPageNumber}
				pageSize={assignmentPageSize}
				setPageNumber={setAssignmentPageNumber}
				setPageSize={setAssignmentPageSize}
			/>
		</>
	);
}

export default LearningAssignmentsTable;
