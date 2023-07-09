import { Icon } from "@iconify/react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

import {
	useAddOrEditRoleSkillMappingMutation,
	useGetRoleSkillMappingQuery,
	useGetRolesQuery,
	useLazyGetRoleLearningPathQuery,
	useLazyGetAllRoleStructureQuery,
	useLazyCompetencyLPByRoleStructureQuery
} from "../../management/containers/role-structure/store";
import { UpdateProfileContent } from "../components";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import { Spinner } from "~/components/spinner";
import { RoleAndSkillMappingList } from "../components/RoleSkillMappingList";
import { useEffect, useState } from "react";
import RoleStructureView from "../components/RoleStructureView";
import RoleSkillMappingExpectedList from "../components/RoleSkillMappingExpectedList";

function RoleAndSkillMapping() {
	const modeForRolesAPI = !checkIsB2B() ? 2 : 1;
	const modeForRoleStructureAPI = !checkIsB2B() ? 4 : 3;
	const roles = useGetRolesQuery({ Mode: modeForRolesAPI, PageSize: 0 });
	const roleSkillMapping = useGetRoleSkillMappingQuery({ Mode: 1 });
	const [selectedRoleStructure, setSelectedRoleStructure] = useState<any>(undefined);
	const [getStructure, roleStructure] = useLazyGetAllRoleStructureQuery();
	const [saveRoleSkillMapping, option] = useAddOrEditRoleSkillMappingMutation();
	const [getLearningPath, learningPathOption] = useLazyGetRoleLearningPathQuery();
	const [competencyMapData, setCmpetencyMapData] = useState([]);
	const [competencyData, setCmpetencyData] = useState({
		RoleId: "",
		RoleStructureId: "",
		TargetRoleId: ""
	});
	const { handleSubmit, control, setValue, getValues, formState, reset } = useForm({
		mode: "onChange",
		defaultValues: {
			RoleId: "",
			RoleStructureId: "",
			TargetRoleId: ""
		}
	});
	const { errors } = formState;

	const onSubmit = (formData: any) => {
		const roleSkillMapId = roleSkillMapping.data?.Data?.UserRoleMap?.at(0)?.Id || 0;
		const user = getLoggedUser();

		const roleSkillMappingPayload: any = {
			RoleId: Number(formData.RoleId),
			RoleStructureId: Number(formData.RoleStructureId),
			TargetRoleId: Number(formData.TargetRoleId),
			UserCompetencyMapData: competencyMapData.map((data: any) => ({
				...data,
				LastWorkedDate: data.LastWorkedDate,
				CompetencyMapId: 0,
				UserID: user.UserId,
				CompetencyId: data?.CompetencyId?.ID || data?.CompetencyId,
				CompetencyLevelId: data?.CompetencyLevelId?.ID || data?.CompetencyLevelId
			}))
		};
		if (roleSkillMapId) roleSkillMappingPayload.Id = roleSkillMapId;
		// console.log(roleSkillMappingPayload);
		saveRoleSkillMapping(roleSkillMappingPayload);
	};

	useEffect(() => {
		if (roleSkillMapping.data?.Data) {
			const rollSkill = roleSkillMapping.data?.Data?.UserRoleMap.at(0);
			const rollSkillMap = {
				RoleStructureId: rollSkill?.RoleStructureId,
				RoleId: rollSkill?.RoleId,
				TargetRoleId: rollSkill?.TargetRoleId
			};
			if (rollSkill?.RoleId) {
				getStructure({ RoleId: rollSkill?.RoleId, Mode: modeForRoleStructureAPI, PageSize: 0 })
					.unwrap()
					.then(resp => {
						const roles = resp?.Data?.RolesStructureListData?.find(
							(role: any) => role.ID === rollSkill?.RoleStructureId
						);
						console.log(
							resp?.Data?.RolesStructureListData?.find(
								(role: any) => role.ID === rollSkill?.RoleStructureId
							)
						);
						setSelectedRoleStructure({
							title: roles.Name,
							roleStructure: JSON.parse(roles?.ResponseJSON)
						});
					});
			}
			if (rollSkill?.TargetRoleId) {
				getLearningPath({
					Mode: 2,
					RoleIds: `${rollSkill?.RoleId},${rollSkill?.TargetRoleId}`
				});
			}
			setCmpetencyMapData(roleSkillMapping.data?.Data?.UserCompetencyMapList);
			reset(rollSkillMap);
			setCmpetencyData(rollSkillMap);
		}
	}, [roleSkillMapping]);

	// useEffect(() => {
	// 	setCmpetencyData(getValues());
	// }, [formState]);
	console.log("rendering");

	return (
		<UpdateProfileContent
			onSave={handleSubmit(onSubmit)}
			onCancel={() => console.log("refetch")}
			title="Role & Competency Mapping"
			isLoading={option.isLoading || roleSkillMapping.isLoading}
		>
			<div className="mb-3 flex items-center gap-3">
				<h6 className="text-[#475569] font-semibold">Current role</h6>
				{selectedRoleStructure && <RoleStructureView {...selectedRoleStructure} />}
			</div>
			<div className="mt-4 space-y-3">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="block">
						<span>My current role*</span>
						<Controller
							name="RoleId"
							control={control}
							render={({ field: { value, ...resetField } }) => (
								<Select
									{...resetField}
									maxMenuHeight={150}
									menuPosition="fixed"
									options={roles.data?.Data?.RolesListData}
									getOptionLabel={(option: any) => option.RoleName}
									getOptionValue={(option: any) => option.ID}
									isLoading={roles.isLoading}
									className="mt-1.5"
									value={roles.data?.Data?.RolesListData?.find((c: any) => c.ID === value)}
									onChange={(option: any) => {
										setValue("RoleId", option.ID);
										getStructure({ RoleId: option.ID, Mode: modeForRoleStructureAPI, PageSize: 0 });
										setCmpetencyData({ ...competencyData, RoleId: option.ID });
									}}
								/>
							)}
						/>
					</label>
					<label className="block">
						<span>Role structure</span>
						<Controller
							name="RoleStructureId"
							control={control}
							render={({ field: { value, ...restField } }) => (
								<Select
									{...restField}
									placeholder="Select"
									maxMenuHeight={150}
									menuPosition="fixed"
									options={roleStructure.data?.Data?.RolesStructureListData}
									getOptionLabel={(option: any) => option.Name}
									getOptionValue={(option: any) => option.ID}
									isLoading={roleStructure.isLoading || roleStructure.isFetching}
									value={roleStructure.data?.Data?.RolesStructureListData?.find(
										(c: any) => c.ID === value
									)}
									className="mt-1.5"
									onChange={(option: any) => {
										setSelectedRoleStructure({
											title: option.Name,
											roleStructure: JSON.parse(option.ResponseJSON)
										});
										setValue("RoleStructureId", option.ID);
										setCmpetencyData({ ...competencyData, RoleStructureId: option.ID });
									}}
								/>
							)}
						/>
					</label>
				</div>
				<RoleSkillMappingExpectedList
					RoleId={competencyData.RoleId}
					RoleStructureId={competencyData.RoleStructureId}
					from={"Current Role"}
				/>
				<RoleAndSkillMappingList data={competencyMapData} getData={(data: any) => setCmpetencyMapData(data)} />
			</div>
			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
			<div>
				<div className="mb-3 flex items-center gap-3">
					<h6 className="text-[#475569] font-semibold">Target Role</h6>
					{selectedRoleStructure && (
						<RoleStructureView
							source={getValues("RoleId")}
							target={getValues("TargetRoleId")}
							isTargetRole
							{...selectedRoleStructure}
						/>
					)}
				</div>
				<div className="mt-4 space-y-4">
					<label className="block">
						<span>Target Role </span>
						<Controller
							name="TargetRoleId"
							control={control}
							render={({ field: { value, ...restField } }) => (
								<Select
									{...restField}
									maxMenuHeight={150}
									menuPosition="fixed"
									options={roles.data?.Data?.RolesListData}
									getOptionLabel={(option: any) => option.RoleName}
									getOptionValue={(option: any) => option.ID}
									isLoading={roles.isLoading}
									className="mt-1.5"
									value={roles.data?.Data?.RolesListData?.find((c: any) => c.ID === value)}
									onChange={(option: any) => {
										setValue("TargetRoleId", option.ID);
										getLearningPath({
											Mode: 2,
											RoleIds: `${getValues("RoleId")},${option.ID}`
										});
										setCmpetencyData({ ...competencyData, TargetRoleId: option.ID });
									}}
								/>
							)}
						/>
					</label>
					<RoleSkillMappingExpectedList
						RoleId={competencyData.TargetRoleId}
						RoleStructureId={competencyData.RoleStructureId}
						from={"Target Role"}
					/>
					<div className="flex flex-col border rounded-lg p-4 gap-4 border-slate-200 dark:border-navy-500">
						<h3 className="flex items-center gap-2 font-semibold">
							<Icon icon="mingcute:list-check-3-fill" className="w-6 h-6 text-primary" />
							<span>Learning Path for Target Role</span>
						</h3>
						<div className="flex flex-wrap gap-3">
							{(learningPathOption.isLoading || learningPathOption.isFetching) && <Spinner />}
							{!learningPathOption.isLoading && !learningPathOption.isFetching && (
								<>
									{learningPathOption.data?.Data?.length === 0 && <span>-</span>}
									{learningPathOption.data?.Data?.map((path: any, index: number) => (
										<span
											key={index}
											className="btn bg-slate-150 text-sm rounded-full font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80"
										>
											{path.LearningPathName}
										</span>
									))}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</UpdateProfileContent>
	);
}

export default RoleAndSkillMapping;
