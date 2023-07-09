import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const quickstartsApi = api.injectEndpoints({
	endpoints: builder => ({
		getGrid: builder.query({
			query: ({ UserID, CategoryID, SubCategoryID, PageNumber, SearchText }) => ({
				url: endPoints.quickstarts.grid
					.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":SubCategoryID", SubCategoryID)
					.replace(":PageNumber", PageNumber)
					.concat("", SearchText.length !== 0 ? `&SearchText=${SearchText}` : "")
			})
		}),
		getCategory: builder.query({
			query: UserID => ({
				url: endPoints.quickstarts.categories.replace(":UserID", UserID).replace(":Type", "3")
			})
		}),
		getSubcategory: builder.query({
			query: ({ UserID, CategoryID }) => ({
				url: endPoints.quickstarts.subCategories
					.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":Type", "3")
			})
		}),
		getNotificationFlag: builder.query({
			query: UserID => ({
				url: endPoints.quickstarts.notificationFlag.replace(":UserID", UserID)
			})
		}),
		updateNotificationFlag: builder.mutation({
			query: body => ({
				url: endPoints.quickstarts.updateNotificationFlag,
				method: "PUT",
				body
			})
		})
	})
});

export const {
	useGetGridQuery,
	useGetCategoryQuery,
	useGetSubcategoryQuery,
	useGetNotificationFlagQuery,
	useUpdateNotificationFlagMutation
} = quickstartsApi;
