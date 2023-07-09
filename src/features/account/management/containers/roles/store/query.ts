import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const RolesApi = api.injectEndpoints({
	endpoints: builder => ({
		getAllRoles: builder.query({
			query: params => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.management.roles.list, { UserId }), params };
			}
		}),
		getRoleById: builder.query({
			query: RoleId => {
				return {
					url: generatePath(endPoints.account.management.roles.get, {
						RoleId
					})
				};
			}
		}),
		createOrUpdate: builder.mutation({
			query: body => ({
				url: endPoints.account.management.roles.createOrUpdate,
				method: "POST",
				body
			})
		}),
		addPublicRole: builder.mutation({
			query: body => ({
				url: endPoints.account.management.roles.addPublicRole,
				method: "POST",
				body
			})
		}),
		deleteRole: builder.mutation({
			query: body => {
				const { UserId } = getLoggedUser();
				return {
					url: endPoints.account.management.roles.delete,
					method: "DELETE",
					body: { ...body, UserId }
				};
			}
		})
	})
});

export const {
	useGetAllRolesQuery,
	useLazyGetAllRolesQuery,
	useLazyGetRoleByIdQuery,
	useCreateOrUpdateMutation,
	useAddPublicRoleMutation,
	useDeleteRoleMutation
} = RolesApi;
