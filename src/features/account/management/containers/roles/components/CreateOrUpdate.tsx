import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Modal } from "~/components";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { Role, RoleInitialState } from "../@types";
import { useCreateOrUpdateMutation } from "../store";

interface RoleForm {
	RoleName: string;
	TotalExpMonths: number;
}

function CreateOrUpdate({ role, onClose }: any) {
	const [CreateOrUpdate, option] = useCreateOrUpdateMutation();
	// const role: RoleInitialState = useAppSelector((state: any) => state.accountManagementRole);

	const { register, handleSubmit, reset } = useForm<RoleForm>({
		mode: "onChange"
	});

	const onSubmit: SubmitHandler<RoleForm> = async formData => {
		const { UserId } = getLoggedUser();
		const _role: Role = {
			...formData,
			TotalExpMonths: +formData.TotalExpMonths,
			UserID: +UserId,
			IsPublic: 0,
			Status: 1
		};
		if (role) _role.ID = role?.ID;
		await CreateOrUpdate(_role)
			.unwrap()
			.then(() => onClose())
			.catch(e => toast.error(e.data.Message));
	};

	useEffect(() => {
		if (role) reset({ RoleName: role.RoleName, TotalExpMonths: role.TotalExpMonths });
		// eslint-disable-next-line
	}, [role]);

	return (
		<Modal title={`${typeof role !== "boolean" ? "Update" : "Create"} New Role`}>
			<section className="flex flex-col gap-4 p-5">
				<div className="space-y-3">
					<label className="block">
						<FloatingLabelInput register={register("RoleName", { required: true })} />
					</label>
					<label className="hidden">
						<FloatingLabelInput
							name="Experience Level"
							register={register("TotalExpMonths", { required: false })}
						/>
					</label>
				</div>
				<div className="mt-3 text-right space-x-2">
					<button
						disabled={option.isLoading}
						onClick={onClose}
						className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:active:bg-navy-300/25"
					>
						Cancel
					</button>
					<button
						disabled={option.isLoading}
						onClick={handleSubmit(onSubmit)}
						className="btn h-8 rounded-full bg-primary text-xs+ font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
					>
						{typeof role !== "boolean" ? "Update" : "Create"}
					</button>
				</div>
			</section>
		</Modal>
	);
}

export default CreateOrUpdate;
