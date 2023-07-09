import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { Modal } from "~/components";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
import { useAddEditStructureMutation, useLazyGetAllRoleStructureQuery } from "../store";

function ImportPublicRole() {
	const [isOpen, toggle] = useToggle(false);
	const [selectedRole, setSelectedRole] = useState<any>(undefined);

	const [getRoleStructure, roleStructure] = useLazyGetAllRoleStructureQuery();
	const [saveStructure, saveStructureOption] = useAddEditStructureMutation();

	const onSubmit = async () => {
		const { UserId } = getLoggedUser();
		await saveStructure({
			RoleStructureLevelMapData: [],
			RoleCompetencyLevelMapData: [],
			RoleCompetencyLPMapData: [],
			...selectedRole,
			Mode: 2,
			UserID: +UserId
		});
		getRoleStructure({ Mode: 1, PageNumber: 1, PageSize: 10 });
		toggle();
	};

	useEffect(() => {
		getRoleStructure({ Mode: 2, PageSize: 0, RoleId: 0 });
	}, [isOpen]);

	return (
		<>
			<button
				onClick={() => {
					toggle();
					setSelectedRole(undefined);
				}}
				className="btn space-x-2 rounded-full bg-white border font-medium hover:bg-primary/60 hover:text-white"
			>
				<Icon icon="mingcute:download-2-line" className="w-4 h-4 rotate-180" />
				<span>Import Public Role Structure</span>
			</button>
			{isOpen && (
				<Modal title="Public Role Structures Available to Import" className="max-w-xl">
					{roleStructure.isLoading && <Spinner />}
					{!roleStructure.isLoading && (
						<section className="flex flex-col gap-4">
							<div className="is-scrollbar-hidden min-w-full overflow-x-auto">
								<table className="is-hoverable w-full text-left">
									<thead>
										<tr>
											<th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												#
											</th>
											<th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												Role Structure ID
											</th>
											<th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
												Role Structure Name
											</th>
										</tr>
									</thead>
									<tbody>
										{!roleStructure.data?.Data?.RolesStructureListData && (
											<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
												<td
													colSpan={3}
													className="text-center whitespace-nowrap px-4 py-5 sm:px-5"
												>
													no data
												</td>
											</tr>
										)}
										{roleStructure.data?.Data?.RolesStructureListData?.map((role: any) => (
											<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
												<td className="whitespace-nowrap px-4 py-3 sm:px-5">
													<input
														checked={selectedRole?.ID === role.ID}
														onChange={() => setSelectedRole(role)}
														name="selectedRole"
														className="form-checkbox is-basic h-5 w-5 rounded border-slate-400/70 checked:bg-slate-500 checked:border-slate-500 hover:border-slate-500 focus:border-slate-500 dark:border-navy-400 dark:checked:bg-navy-400"
														type="checkbox"
													/>
												</td>
												<td className="whitespace-nowrap px-4 py-3 sm:px-5">{role.ID}</td>
												<td className="whitespace-nowrap px-4 py-3 sm:px-5">{role.Name}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="mt-3 text-right space-x-2 p-5">
								<button
									onClick={toggle}
									className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
								>
									Cancel
								</button>
								{roleStructure.data?.Data?.RolesStructureListData && (
									<button
										disabled={saveStructureOption.isLoading}
										onClick={() => onSubmit()}
										className="btn h-8 rounded-full bg-primary text-xs+ font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
									>
										Import
									</button>
								)}
							</div>
						</section>
					)}
				</Modal>
			)}
		</>
	);
}

export default ImportPublicRole;
