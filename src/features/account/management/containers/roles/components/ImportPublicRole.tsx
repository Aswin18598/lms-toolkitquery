import { Modal } from "~/components";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
import DataTable from "../../../components/DataTable";
import { Role } from "../@types";
import { useAddPublicRoleMutation, useGetAllRolesQuery } from "../store";

function ImportPublicRole({ onClose }: any) {
	const roles: any = useGetAllRolesQuery({ mode: 2 });
	const [CreateOrUpdate, option] = useAddPublicRoleMutation();

	const onSubmit = async () => {
		const { UserId } = getLoggedUser();
		const _roles: Role[] = roles?.data?.Data?.RolesListData.map((role: any) => {
			return {
				...role,
				UserID: +UserId,
				IsPublic: 0,
				Status: 1
			};
		});
		await CreateOrUpdate(_roles).unwrap();
		onClose();
	};

	return (
		<Modal title="Public roles available to Import" className="max-w-xl">
			{roles.isLoading && <Spinner />}
			{!roles.isLoading && (
				<section className="flex flex-col gap-4">
					<div className="space-y-3">
						<DataTable
							columns={[
								{
									Header: "Role ID",
									accessor: "ID",
									width: 100
								},
								{
									Header: "Role Name",
									accessor: "RoleName"
								}
								// {
								// 	Header: "Experience Level",
								// 	accessor: "TotalExpMonths"
								// }
							]}
							data={roles?.data?.Data?.RolesListData || []}
						/>
					</div>
					<div className="mt-3 text-right space-x-2 p-5">
						<button
							onClick={onClose}
							className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
						>
							Cancel
						</button>
						<button
							onClick={() => onSubmit()}
							disabled={option.isLoading}
							className="btn h-8 rounded-full bg-primary text-xs+ font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
						>
							Import
						</button>
					</div>
				</section>
			)}
		</Modal>
	);
}

export default ImportPublicRole;
