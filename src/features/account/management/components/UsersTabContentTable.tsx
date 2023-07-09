import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import Pagination from "~/features/Subscriptions/components/Pagination";
import { IUserListForLearningPath } from "../@types";
import { useAssignUserToLearningPathMutation, useLazyUserListForLearningPathQuery } from "../store";
interface IUsersTabContentTableProps {
	isUsersListsForLearningFetching: boolean;
	userListsForLearningPath: {
		UserListByManagers: IUserListForLearningPath[];
		PageNumber: number;
		PageSize: number;
		TotalItems: number;
		TotalPages: number;
	};
	userListsForLearningPathEmptyMessage: string;
	refetchAssignedUsers: () => void;
	pageNumber: number;
	pageSize: number;
	setPageNumber: React.Dispatch<React.SetStateAction<number>>;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
	userSearchText: string;
	userSelectOption: number;
}
function UsersTabContentTable(props: IUsersTabContentTableProps) {
	const {
		isUsersListsForLearningFetching,
		userListsForLearningPath,
		userListsForLearningPathEmptyMessage,
		refetchAssignedUsers,
		pageNumber,
		pageSize,
		setPageNumber,
		setPageSize,
		userSearchText,
		userSelectOption
	} = props;
	const location = useLocation();

	const [assignUserToLearningPath, { isLoading }] = useAssignUserToLearningPathMutation();
	const [triggerFetchAssignableUsers] = useLazyUserListForLearningPathQuery({});
	const handleAssignUserToLearningPath = async (user: IUserListForLearningPath) => {
		try {
			await assignUserToLearningPath({
				UserID: user?.UserID,
				PathID: location.state?.PathID
			}).unwrap();
			refetchAssignedUsers();
		} catch (error) {
			console.error("error", error);
		}
	};
	useEffect(() => {
		if (!userSearchText.length) {
			triggerFetchAssignableUsers({
				GroupID: userSelectOption,
				PageNumber: 1,
				PageSize: 10,
				searchText: ""
			});
		}
	}, [userSearchText]);
	if (isUsersListsForLearningFetching && !userListsForLearningPath?.UserListByManagers?.length)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isUsersListsForLearningFetching && !userListsForLearningPath?.UserListByManagers?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={userListsForLearningPathEmptyMessage}
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
						{userListsForLearningPath?.UserListByManagers?.map((user, i) => (
							<tr className="border-b-2 border-slate-200 " key={i}>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{user.FirstName}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{user.LastName}</td>
								<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{user.Email}</td>
								<td className="font-dmsans text-[#020A12]/60 px-5 py-3 text-center">
									<Tippy content={"Add"} placement={"bottom"}>
										<div className="w-fit">
											<Icon
												icon={"material-symbols:add-circle-outline-rounded"}
												className={"cursor-pointer"}
												height={20}
												width={20}
												onClick={() => handleAssignUserToLearningPath(user)}
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
					TotalItems: userListsForLearningPath.TotalItems,
					TotalPages: userListsForLearningPath.TotalPages
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

export default UsersTabContentTable;
