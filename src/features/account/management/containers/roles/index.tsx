import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useToggle } from "react-use";
import { CSVLink } from "react-csv";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { Page } from "~/components";
import { Spinner } from "~/components/spinner";

import DataTable from "../../components/DataTable";
import CreateOrUpdate from "./components/CreateOrUpdate";
import ImportPublicRole from "./components/ImportPublicRole";
import { useDeleteRoleMutation, useGetAllRolesQuery, useLazyGetAllRolesQuery } from "./store";
import { toast } from "react-hot-toast";

function Roles() {
	const [isAddScreenShown, showAddScreen] = useState(false);
	const [isImportScreenShown, showImportScreen] = useToggle(false);
	const [getRoles, roles] = useLazyGetAllRolesQuery();
	const allRoles = useGetAllRolesQuery({ mode: 1, PageSize: 0 });
	const [deleteRole, deleteOption]: any = useDeleteRoleMutation();
	const [payload, setPayload] = useState({ mode: 1, PageSize: 10 });

	React.useEffect(() => {
		getRoles(payload);
	}, []);

	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				accessor: "ID",
				Cell: ({ row }: any) => <span className="w-10">{row.values.ID}</span>
			},
			{
				Header: "Role Name",
				accessor: "RoleName"
			},
			// {
			// 	Header: "Exprience Level",
			// 	accessor: "TotalExpMonths"
			// },
			{
				Header: "action",
				Cell: ({ row }: any) => renderAction(row.original)
			}
		],
		[]
	);

	const handleDeleteRole = (ID: any) => {
		confirmAlert({
			message: "Are you sure you want to delete this role?",
			buttons: [
				{
					label: "Yes",
					onClick: async () => {
						await deleteRole({ ID })
							.unwrap()
							.then((resp: any) => {
								toast.success(resp.Message || resp.data.Message);
								getRoles(payload);
							})
							.catch((e: any) => toast.error(e.Message || e.data.Message));
					}
				},
				{
					label: "No"
				}
			]
		});
	};

	const renderAction = (role: any) => {
		return (
			<div className="flex space-x-3">
				<button
					title="Edit"
					onClick={() => showAddScreen(role)}
					className="btn h-7 w-7 p-0 font-medium text-warning hover:bg-warning/20 focus:bg-warning/20 active:bg-warning/25"
				>
					<Icon icon="mingcute:pencil-line" className="w-4.5 h-4.5" />
				</button>
				<button
					title="Delete"
					onClick={() => handleDeleteRole(role.ID)}
					className="btn h-7 w-7 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
				>
					<Icon icon="mingcute:delete-2-line" className="w-4.5 h-4.5" />
				</button>
			</div>
		);
	};
	const Header: any[] = useMemo(
		() => [
			{ label: "ID", key: "ID" },
			{ label: "Role Name", key: "RoleName" }
		],
		[]
	);
	return (
		<Page noPadding>
			<div className="flex items-center justify-between my-5">
				<h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
					Role Master
				</h2>
				<div className="flex gap-4">
					<button
						onClick={() => showImportScreen(true)}
						className="hidden btn space-x-2 rounded-full bg-white border font-medium hover:bg-primary/60 hover:text-white"
					>
						<Icon icon="mingcute:download-2-line" className="w-4 h-4 rotate-180" />
						<span>Import from public roles</span>
					</button>
					{!allRoles.isLoading && (
						<CSVLink filename="roles.csv" data={allRoles?.data?.Data?.RolesListData || []} headers={Header}>
							<button className="btn space-x-2 rounded-full bg-white border font-medium hover:bg-primary/60 hover:text-white">
								<Icon icon="mingcute:download-2-line" className="w-4 h-4" />
								<span>CSV</span>
							</button>
						</CSVLink>
					)}
					<button
						onClick={() => showAddScreen(true)}
						className="btn space-x-2 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90"
					>
						<Icon icon="mingcute:close-line" className="w-4 h-4 -rotate-45" />
						<span>Create</span>
					</button>
				</div>
			</div>
			{(roles.isLoading || deleteOption.isLoading) && <Spinner />}
			{/* {(deleteOption.isLoading || roles.isFetching) && (
				<div className="card shadow-sm flex-1 h-full relative">
					<div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
						<Spinner />
					</div>
				</div>
			)} */}
			{!roles.isLoading && (
				<DataTable
					PageSize={roles?.data?.Data?.PageSize}
					TotalItems={roles?.data?.Data?.TotalItems}
					isLoading={roles.isLoading}
					columns={columns}
					data={roles?.data?.Data?.RolesListData || []}
					fetchData={(data: any) => {
						setPayload({ ...payload, ...data });
						getRoles({ ...payload, ...data });
					}}
				/>
			)}
			{isAddScreenShown && (
				<CreateOrUpdate
					role={isAddScreenShown}
					onClose={(isClose: any) => {
						showAddScreen(false);
						// dispatch(roleAction.toggleRoleEdit(undefined));
						if (!isClose) getRoles(payload);
					}}
				/>
			)}

			{isImportScreenShown && <ImportPublicRole onClose={() => showImportScreen(false)} />}
		</Page>
	);
}

export default Roles;
