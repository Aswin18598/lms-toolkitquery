import { Icon } from "@iconify/react";
import React, { useMemo, useState } from "react";
import { useToggle } from "react-use";

import { Page } from "~/components";
import DataTable from "../../components/DataTable";
import {
	competencyAction,
	useDeleteCompetencyMutation,
	useGetAllCompetencyQuery,
	useLazyGetAllCompetencyQuery
} from "./store";
import { dispatch } from "~/config/store";
import { Spinner } from "~/components/spinner";
import CreateOrUpdate from "./components/CreateOrUpdate";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";

function CompetencyList() {
	const [isAddScreenShown, showAddScreen] = useToggle(false);

	const [getCompetency, competency] = useLazyGetAllCompetencyQuery();
	const [deleteRole, deleteOption]: any = useDeleteCompetencyMutation();

	const [payload, setPayload] = useState({ mode: 1, PageSize: 10 });
	const allCompetency = useGetAllCompetencyQuery("");

	React.useEffect(() => {
		getCompetency(payload);
	}, []);

	const handleDeleteRole = (ID: any) => {
		confirmAlert({
			message: "Are you sure you want to delete this competency?",
			buttons: [
				{
					label: "Yes",
					onClick: async () => {
						await deleteRole({ ID }).unwrap();
						getCompetency(payload);
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
			<button
				title="Edit"
				onClick={() => {
					dispatch(competencyAction.toggleEdit(row));
					showAddScreen(true);
				}}
				className="btn h-7 w-7 p-0 font-medium text-warning hover:bg-warning/20 focus:bg-warning/20 active:bg-warning/25"
			>
				<Icon icon="mingcute:pencil-line" className="w-4.5 h-4.5" />
			</button>
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
				accessor: "ID"
			},
			{
				Header: "Competency Type",
				accessor: "CompetencyTypeName"
			},
			{
				Header: "Competency Name",
				accessor: "Name"
			},
			{
				Header: "action",
				Cell: ({ row }: any) => renderAction(row.original)
			}
		],
		[]
	);
	const Header: any[] = useMemo(
		() => [
			{ label: "ID", key: "ID" },
			{ label: "Competency Name", key: "Name" },
			{ label: "Competency Type", key: "CompetencyTypeName" }
		],
		[]
	);

	return (
		<Page noPadding>
			<section className="flex flex-col h-full w-full">
				<div className="flex items-center flex-col  sm:flex-row justify-between my-5">
					<h2 className="text-base font-medium self-start sm:self-center mb-4 sm:m-0 tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
						Competency Master
					</h2>
					<div className="flex self-start gap-4 ">
						{!allCompetency.isLoading && (
							<CSVLink
								filename="competency.csv"
								data={allCompetency?.data?.Data?.CompetencyListData || []}
								headers={Header}
							>
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
				{competency.isLoading && <Spinner />}
				{/* {(deleteOption.isLoading || competency.isFetching) && (
					<div className="card shadow-sm relative">
						<div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
							<Spinner />
						</div>
					</div>
				)} */}
				{!competency.isLoading && (
					<DataTable
						PageSize={competency?.data?.Data?.PageSize}
						TotalItems={competency?.data?.Data?.TotalItems}
						isLoading={competency.isLoading}
						columns={columns}
						data={competency?.data?.Data?.CompetencyListData || []}
						fetchData={(data: any) => {
							setPayload({ ...payload, ...data });
							getCompetency({ ...payload, ...data });
						}}
					/>
				)}
			</section>

			{isAddScreenShown && (
				<CreateOrUpdate
					onClose={() => {
						showAddScreen(false);
						dispatch(competencyAction.toggleEdit(undefined));
						getCompetency(payload);
					}}
				/>
			)}
		</Page>
	);
}

export default CompetencyList;
