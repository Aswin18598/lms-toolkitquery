import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Modal } from "~/components";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { useGetCompetencyTypeQuery } from "../../role-structure/store";
import { Competency } from "../@types";
import { useCreateOrUpdateCompetencyMutation } from "../store";

function CreateOrUpdate({ onClose }: any) {
	const [CreateOrUpdateCompetency, option] = useCreateOrUpdateCompetencyMutation();
	const competency = useAppSelector((state: any) => state.accountManagementRole);
	const competencyType = useGetCompetencyTypeQuery({ Mode: 1 });

	const { register, handleSubmit, control, setValue, reset } = useForm<Competency>({
		mode: "onChange"
	});

	const onSubmit: SubmitHandler<Competency> = async formData => {
		const { UserId } = getLoggedUser();
		const _competency: Competency = {
			...formData,
			CompetencyTypeId: +formData.CompetencyTypeId,
			UserID: +UserId,
			IsMandatory: Number(formData.IsMandatory),
			IsPublic: 0
		};

		if (competency.isEditMode) _competency.ID = competency.competency?.ID;

		await CreateOrUpdateCompetency(_competency).unwrap();
		onClose();
	};

	useEffect(() => {
		if (competency?.competency) {
			reset({
				CompetencyTypeId: competency?.competency?.CompetencyTypeId,
				CompetencyName: competency?.competency?.Name,
				IsMandatory: competency?.competency?.IsMandatory
			});
		}
		// eslint-disable-next-line
	}, [competency]);

	return (
		<Modal title={`${competency.isEditMode ? "Update" : "Create"} Competency`}>
			<section className="flex flex-col gap-4 p-5 select-none">
				<div className="space-y-3">
					<label className="block">
						<span className="text-sm">Competency Type</span>
						{/* <select
							className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary"
							{...register("CompetencyTypeId", { required: true })}
						>
							<option value={1}>Technical</option>
							<option value={2}>Behavorial</option>
						</select> */}

						<Controller
							name="CompetencyTypeId"
							control={control}
							render={({ field: { value, ...resetField } }) => (
								<Select
									{...resetField}
									maxMenuHeight={150}
									menuPosition="fixed"
									options={competencyType.data?.Data}
									getOptionLabel={(option: any) => option.CompetencyTypeName}
									getOptionValue={(option: any) => option.ID}
									isLoading={competencyType.isLoading}
									value={competencyType.data?.Data?.find((c: any) => c.ID === value)}
									onChange={(option: any) => {
										setValue("CompetencyTypeId", option.ID);
									}}
								/>
							)}
						/>
					</label>
					<label className="block">
						<FloatingLabelInput register={register("CompetencyName", { required: true })} />
					</label>
					<label className="inline-flex items-center space-x-2 select-none">
						<input
							type="checkbox"
							className="form-checkbox is-basic h-4 w-4 rounded border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
							{...register("IsMandatory")}
						/>
						<span>Is Mandatory</span>
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
						{competency.isEditMode ? "Update" : "Create"}
					</button>
				</div>
			</section>
		</Modal>
	);
}

export default CreateOrUpdate;
