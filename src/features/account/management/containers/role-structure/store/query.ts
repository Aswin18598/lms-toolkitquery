import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const RoleStructureApi = api.injectEndpoints({
	endpoints: builder => ({
		getAllRoleStructure: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.roleStructure.all, { UserId }), params };
			}
		}),
		getStructure: builder.query<any, string | null>({
			query: id => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.roleStructure.get, { id }), params: { UserID: UserId, Mode: 2 } };
			}
		}),
		getRoles: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.roles.list, { UserId }), params };
			}
		}),
		getCompetency: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.competency.list, { UserId }), params };
			}
		}),
		getCompetencyType: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.competency.type, { UserId }), params };
			}
		}),
		getCompetencyLevel: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.competency.levelList, { UserId }), params };
			}
		}),
		getRoleSkillMapping: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return {
					url: generatePath(endPoints.account.management.roles.getRoleSkillMapping, { UserId }),
					params
				};
			}
		}),
		getRoleLearningPath: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return {
					url: generatePath(endPoints.account.management.roles.roleLearningPath, { UserId }),
					params
				};
			}
		}),
		addOrEditRoleSkillMapping: builder.mutation({
			query: body => {
				const { UserId } = getLoggedUser();
				return {
					url: generatePath(endPoints.account.management.roles.addOrEditRoleSkillMapping),
					method: "POST",
					body: {
						...body,
						UserID: UserId
					}
				};
			}
		}),
		addEditStructure: builder.mutation({
			query: body => {
				return { url: generatePath(endPoints.roleStructure.addEditStructure), method: "POST", body };
			}
		}),
		deleteStructure: builder.query({
			query: ID => {
				const { UserId } = getLoggedUser();
				return {
					url: generatePath(endPoints.roleStructure.delete),
					method: "delete",
					body: { UserID: UserId, ID }
				};
			}
		}),
		CompetencyLPByRoleStructure: builder.query({
			query: ({ RoleStructureID, RoleID }) => {
				const { UserId } = getLoggedUser();
				return {
					url: generatePath(endPoints.roleStructure.CompetencyLPByRoleStructure, {
						RoleStructureID: RoleStructureID,
						RoleID: RoleID,
						UserID: UserId,
						CompetencyID: 0,
						Mode: 1
					})
				};
			}
		})
	})
});

export const {
	useGetAllRoleStructureQuery,
	useLazyGetAllRoleStructureQuery,
	useGetRolesQuery,
	useGetCompetencyQuery,
	useGetCompetencyLevelQuery,
	useAddEditStructureMutation,
	useLazyGetStructureQuery,
	useLazyDeleteStructureQuery,
	useGetRoleSkillMappingQuery,
	useAddOrEditRoleSkillMappingMutation,
	useLazyGetRoleLearningPathQuery,
	useGetCompetencyTypeQuery,
	useLazyGetCompetencyQuery,
	useLazyCompetencyLPByRoleStructureQuery
} = RoleStructureApi;
