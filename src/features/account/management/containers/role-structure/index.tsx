import { Page } from "~/components";

import React, { useState } from "react";

import { Icon } from "@iconify/react";
import DataTable from "../../components/DataTable";
import { useLazyGetAllRoleStructureQuery, useLazyDeleteStructureQuery } from "./store";
import { Spinner } from "~/components/spinner";
import { Link } from "react-router-dom";
import ImportPublicRole from "./components/ImportPublicRole";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-hot-toast";

function RoleStructure() {
	const [getRoleStructure, roleStructures] = useLazyGetAllRoleStructureQuery();
	const [deleteQuery, deleteQueryOption] = useLazyDeleteStructureQuery();
	const [payload, setPayload] = useState({ Mode: 1, PageNumber: 1, PageSize: 10 });

	React.useEffect(() => {
		getRoleStructure(payload);
	}, []);

	const handleDeleteRole = (ID: any) => {
		confirmAlert({
			message: "Are you sure you want to delete this Role Structure?",
			buttons: [
				{
					label: "Yes",
					onClick: async () => {
						await deleteQuery(ID)
							.unwrap()
							// .then((resp: any) => toast.success(resp.Message || resp.data.Message))
							.catch((e: any) => toast.error(e.Message || e.data.Message));
						getRoleStructure(payload);
					}
				},
				{
					label: "No"
				}
			]
		});
	};

	const renderAction = (row: any) => (
		<div className="flex space-x-3">
			<Link
				title="Edit"
				to={`/account/management/role-structure-create?edit=${row.ID}`}
				className="btn h-7 w-7 p-0 font-medium text-warning hover:bg-warning/20 focus:bg-warning/20 active:bg-warning/25"
			>
				<Icon icon="mingcute:pencil-line" className="w-4.5 h-4.5" />
			</Link>
			<button
				title="Delete"
				onClick={async () => handleDeleteRole(row.ID)}
				className="btn h-7 w-7 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
			>
				<Icon icon="mingcute:delete-2-line" className="w-4.5 h-4.5" />
			</button>
		</div>
	);
	const columns = React.useMemo(
		() => [
			{
				Header: "ID",
				accessor: "ID",
				Cell: ({ row }: any) => <span className="w-10">{row.values.ID}</span>
			},
			{
				Header: "Structure Name",
				accessor: "Name"
			},
			{
				Header: "Last Edited",
				accessor: "UpdatedDateTime"
			},
			{
				Header: "action",
				Cell: ({ row }: any) => renderAction(row.original)
			}
		],
		[]
	);

	if (roleStructures.isLoading) return <Spinner />;

	if (roleStructures.data?.Data?.TotalItems === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 h-full w-full">
				<h6 className="text-lg text-black">No roles structures, yet...</h6>
				<p className="text-sm">Create you first role structure by clicking the button below</p>
				<Link
					to="/account/management/role-structure-create"
					className="btn space-x-2 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90"
				>
					<Icon icon="mingcute:close-line" className="w-4 h-4 -rotate-45" />
					<span>Create</span>
				</Link>
			</div>
		);
	}

	return (
		<Page isBr={false} noPadding>
			<section className="flex flex-col h-full w-full">
				<div className="flex flex-col sm:flex-row items-center justify-between my-5">
					<h2 className="text-base self-start sm:self-center mb-4 sm:m-0 font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
						Role Structure
					</h2>
					<div className="flex gap-4 ">
						<ImportPublicRole />
						<Link
							to="/account/management/role-structure-create"
							className="btn space-x-2 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90"
						>
							<Icon icon="mingcute:close-line" className="w-4 h-4 -rotate-45" />
							<span>Create</span>
						</Link>
					</div>
				</div>

				{deleteQueryOption.isLoading && (
					<div className="card shadow-sm flex-1 h-full relative">
						<div className="absolute inset-10 z-10 grid place-content-center bg-slate-100/80">
							<Spinner />
						</div>
					</div>
				)}
				<DataTable
					PageSize={roleStructures?.data?.Data?.PageSize}
					TotalItems={roleStructures?.data?.Data?.TotalItems}
					isLoading={roleStructures.isLoading}
					columns={columns}
					data={roleStructures.data?.Data?.RolesStructureListData || []}
					fetchData={(data: any) => {
						setPayload({ ...payload, ...data });
						getRoleStructure({ ...payload, ...data });
					}}
				/>
			</section>
		</Page>
	);
}

export default RoleStructure;
