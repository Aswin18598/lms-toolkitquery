import { useEffect, useState } from "react";
import { useLazyCompetencyLPByRoleStructureQuery } from "../../management/containers/role-structure/store";

const RoleSkillMappingExpectedList = ({ RoleId, RoleStructureId, from }: any) => {
	const [skills, setSkills] = useState<any[]>([]);
	const [getCompetencyLPByRoleStructure, CompetencyLPByRoleStructureOptions] =
		useLazyCompetencyLPByRoleStructureQuery();

	useEffect(() => {
		if (RoleId !== "" && RoleStructureId !== "") {
			getCompetencyLPByRoleStructure({ RoleStructureID: RoleStructureId, RoleID: RoleId });
		}
	}, [RoleId, RoleStructureId]);

	useEffect(() => {
		if (CompetencyLPByRoleStructureOptions?.data?.Data?.RoleStructureCompetency) {
			setSkills(CompetencyLPByRoleStructureOptions?.data?.Data?.RoleStructureCompetency);
		}
	}, [CompetencyLPByRoleStructureOptions]);

	return (
		<>
			<div className="block">
				<div className="flex items-center justify-between mb-2">
					<span>{`Expected Competency List ${from}`}</span>
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
									COMPETENCY TYPE
								</th>
							</tr>
						</thead>
						<tbody>
							{skills.length === 0 && (
								<tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
									<td colSpan={6} className="whitespace-nowrap px-4 py-3 text-center sm:px-5">
										{`No competency list for the selected ${from} and Role Structure`}
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
												{comp.CompetencyName}
											</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{comp.CompetencyLevelName}
											</td>
											<td className="whitespace-nowrap px-4 py-3 sm:px-5">
												{comp.CompetencyTypeName}
											</td>
										</tr>
									))}
								</>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default RoleSkillMappingExpectedList;
