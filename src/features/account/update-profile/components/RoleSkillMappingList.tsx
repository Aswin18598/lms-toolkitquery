import Select from "react-select";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { useList, useToggle } from "react-use";

import { Modal } from "~/components";
import { useGetCompetencyLevelQuery, useGetCompetencyQuery } from "../../management/containers/role-structure/store";
import { useEffect, useState } from "react";

export function RoleAndSkillMappingList({ data, getData }: any) {
	const [on, toggle] = useToggle(false);
	const [skills, skill] = useList<any>([]);
	const competency = useGetCompetencyQuery({ Mode: 1 });
	const competencyLevel = useGetCompetencyLevelQuery({ Mode: 1 });
	const [isEdit, setIsEdit] = useState<string>("");
	const [FromValue, setFromValue] = useState<any>({
		CompetencyId: 0,
		CompetencyLevelId: 0,
		ExpYear: 0,
		ExpMonth: 0,
		LastWorkedDate: undefined
	});

	const { register, handleSubmit, control, reset, setValue, formState, getValues } = useForm({
		mode: "onChange",
		defaultValues: {
			CompetencyId: 0,
			CompetencyLevelId: 0,
			ExpYear: 0,
			ExpMonth: 0,
			LastWorkedDate: undefined
		}
	});
	const { errors } = formState;

	const onSubmit = async (formData: any) => {
		const updatedSkills = [...skills, formData];
		if (isEdit) {
			console.log(isEdit);
			skill.updateAt(Number(isEdit), formData);
		} else skill.set(updatedSkills);
		setIsEdit("");
		toggle();
		reset();
	};

	useEffect(() => {
		skill.set(data);
	}, [data]);

	useEffect(() => {
		console.log(skills);
		getData(skills);
	}, [skills]);

	return (
		<>
			<div className="block">
				<div className="flex items-center justify-between">
					<span>Competency</span>
					<button
						onClick={toggle}
						className="btn space-x-1 text-sm font-medium text-primary hover:text-underline"
					>
						<Icon icon="mingcute:close-line" className="w-3 h-3 rotate-45" />
						<span>Add new</span>
					</button>
				</div>
				<div className="is-scrollbar-hidden min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
					<table className="is-hoverable w-full text-left">
						<thead>
							<tr>
								<th className="whitespace-nowrap bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									#
								</th>
								<th className="whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									COMPETENCY
								</th>
								<th className="whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									COMPETENCY LEVEL
								</th>
								<th className="whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									EXPERIENCE
								</th>
								<th className="whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									LAST WORKED
								</th>
								<th className="whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									ACTION
								</th>
							</tr>
						</thead>
						<tbody>
							{skills.length === 0 && (
								<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
									<td colSpan={6} className="whitespace-nowrap px-4 py-3 text-center sm:px-5">
										No Data
									</td>
								</tr>
							)}
							{skills.length !== 0 && (
								<>
									{skills.map((comp: any, index: number) => (
										<tr
											key={index}
											className="border border-transparent border-b-slate-200 dark:border-b-navy-500"
										>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">{index + 1}</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{comp.CompetencyId?.Name || comp?.CompetencyName}
											</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{comp.CompetencyLevelId?.Name || comp?.CompetencyLevelName}
											</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{`${comp?.ExpYear || 0}y ${comp?.ExpMonth || 0}m`}
											</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{comp.LastWorkedDate.replace("T00:00:00", "")}
											</td>
											<td className="flex gap-2 whitespace-nowrap px-4 py-3 sm:px-5 text-center">
												<button
													onClick={() => {
														reset({
															ExpMonth: comp.ExpMonth,
															ExpYear: comp.ExpYear,
															CompetencyId:
																competency.data?.Data?.CompetencyListData?.find(
																	(c: any) => c.ID === comp.CompetencyId
																),
															CompetencyLevelId: competencyLevel.data?.Data?.find(
																(c: any) => c.ID === comp.CompetencyLevelId
															),
															LastWorkedDate: comp.LastWorkedDate.replace("T00:00:00", "")
														});
														setIsEdit(index.toString());
														toggle();
													}}
												>
													<Icon icon="mingcute:edit-2-line" />
												</button>
												<button onClick={() => skill.removeAt(index)}>
													<Icon icon="mingcute:delete-2-line" />
												</button>
											</td>
										</tr>
									))}
								</>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{on && (
				<Modal onCancel={toggle} className="max-w-lg" title={`${isEdit ? "Update" : "Add"} New Competency`}>
					<section className="flex flex-col gap-4 p-4">
						<div className="space-y-3">
							<label className="block">
								<span className="text-sm">Competency</span>
								<Controller
									name="CompetencyId"
									control={control}
									rules={{ required: true }}
									render={({ field: { onChange, ...restField } }) => (
										<Select
											{...restField}
											className="flex-1 CompetencyId"
											maxMenuHeight={150}
											menuPosition="fixed"
											options={competency.data?.Data?.CompetencyListData}
											getOptionLabel={(option: any) => option.Name}
											getOptionValue={(option: any) => option.Name}
											isLoading={competency.isLoading}
											onChange={(option: any) => {
												setValue("CompetencyId", option);
												setFromValue({ ...FromValue, CompetencyId: option });
											}}
										/>
									)}
								/>
							</label>
							{FromValue.CompetencyId === 0 && <span className="text-sm text-red-600">* Required</span>}
							<label className="block">
								<span className="text-sm">Competency Level</span>
								<Controller
									name="CompetencyLevelId"
									control={control}
									rules={{ required: true }}
									render={({ field: { onChange, ...restField } }) => (
										<Select
											{...restField}
											className="flex-1"
											maxMenuHeight={150}
											menuPosition="fixed"
											options={competencyLevel.data?.Data}
											getOptionLabel={(option: any) => option.CompetencyId}
											getOptionValue={(option: any) => option.CompetencyId}
											isLoading={competencyLevel.isLoading}
											onChange={(option: any) => {
												setValue("CompetencyLevelId", option);
												setFromValue({ ...FromValue, CompetencyLevelId: option });
											}}
										/>
									)}
								/>
							</label>
							{FromValue.CompetencyLevelId === 0 && (
								<span className="text-sm text-red-600">* Required</span>
							)}
							<div className="flex flex-col">
								<span className="text-sm">Exprience</span>
								<div className="flex space-x-3">
									<label className="mt-1 flex -space-x-px">
										<input
											className="form-input border-r-0 rounded-l-md w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary"
											placeholder="1"
											type="text"
											{...register("ExpYear")}
										/>
										<div className="flex items-center justify-center rounded-r-md border border-slate-300 bg-slate-150 px-3.5 font-inter text-slate-800">
											<span className="text-sm">Year</span>
										</div>
									</label>
									<label className="mt-1 flex -space-x-px">
										<input
											className="form-input w-full border-r-0 rounded-l-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary"
											placeholder="0"
											type="text"
											{...register("ExpMonth")}
										/>
										<div className="flex items-center justify-center rounded-r-lg border border-slate-300 bg-slate-150 px-3.5 font-inter text-slate-800">
											<span className="text-sm">Month</span>
										</div>
									</label>
								</div>
							</div>
							<label className="block">
								<span className="text-sm">Last Worked {getValues("LastWorkedDate")}</span>
								<input
									className="form-input rounded-md w-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary"
									placeholder=""
									type="date"
									{...register("LastWorkedDate")}
									onChange={(e: any) =>
										setFromValue({ ...FromValue, LastWorkedDate: e.target.value })
									}
								/>
								{!FromValue.LastWorkedDate && <span className="text-sm text-red-600">* Required</span>}
							</label>
						</div>
						<div className="mt-4 text-right space-x-2">
							<button
								onClick={toggle}
								className="btn h-8 rounded-full text-xs+ font-medium text-slate-700 hover:bg-slate-300/20 active:bg-slate-300/25"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit(onSubmit)}
								className="disabled:cursor-not-allowed btn h-8 rounded-full bg-primary text-xs+ font-medium text-white"
								disabled={
									!!!FromValue.LastWorkedDate ||
									FromValue.CompetencyLevelId === 0 ||
									FromValue.CompetencyId === 0
								}
							>
								{`${isEdit ? "Update" : "Add"}`}
							</button>
						</div>
					</section>
				</Modal>
			)}
		</>
	);
}
