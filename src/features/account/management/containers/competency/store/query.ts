import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const CompetencyApi = api.injectEndpoints({
	endpoints: builder => ({
		getAllCompetency: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.competency.list, { UserId }), params };
			}
		}),
		getCompetencyById: builder.query({
			query: RoleId => {
				return {
					url: generatePath(endPoints.account.management.competency.get, {
						RoleId
					})
				};
			}
		}),
		createOrUpdateCompetency: builder.mutation({
			query: body => {
				return {
					url: endPoints.account.management.competency.createOrUpdate,
					method: "POST",
					body
				};
			}
		}),
		deleteCompetency: builder.mutation({
			query: body => {
				const { UserId } = getLoggedUser();
				return {
					url: endPoints.account.management.competency.delete,
					method: "DELETE",
					body: { ...body, UserId }
				};
			}
		})
	})
});

export const {
	useGetAllCompetencyQuery,
	useLazyGetAllCompetencyQuery,
	useLazyGetCompetencyByIdQuery,
	useCreateOrUpdateCompetencyMutation,
	useDeleteCompetencyMutation
} = CompetencyApi;
