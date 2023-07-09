import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const techtipsApi = api.injectEndpoints({
	endpoints: builder => ({
		getTopics: builder.query({
			query: ({
				UserID,
				CategoryID,
				SubCategoryID,
				TopicID,
				SearchInTitle,
				SearchText,
				selectedPageNumber,
				entries
			}) => ({
				url: endPoints.techtips.topics
					.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":SubCategoryID", SubCategoryID)
					.replace(":TopicID", TopicID)
					.replace(":PageNumber", selectedPageNumber)
					.replace(":PageSize", entries)
					.replace(":SearchTag", SearchText)
					.replace(":SearchInTitle", SearchInTitle)
			})
		}),
		getTechTipCategory: builder.query({
			query: UserID => ({
				url: endPoints.quickstarts.categories.replace(":UserID", UserID).replace(":Type", "2")
			})
		}),
		getTechTipSubcategory: builder.query({
			query: ({ UserID, CategoryID }) => ({
				url: endPoints.quickstarts.subCategories
					.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":Type", "2")
				// .concat("", "/2")
			})
		}),
		getTechTipFilterTopic: builder.query({
			query: ({ SubCategoryID }) => ({
				url: endPoints.techtips.filterTopic.replace(":SubCategoryID", SubCategoryID)
			})
		}),
		saveUserPreference: builder.mutation({
			query: payload => ({
				url: endPoints.techtips.saveUserPreference,
				method: "POST",
				body: payload
			})
		}),
		getUserPreferences: builder.query({
			query: UserID => ({
				url: endPoints.techtips.userPreferences.replace(":UserID", UserID)
			})
		})
	})
});

export const {
	useGetTopicsQuery,
	useGetTechTipCategoryQuery,
	useGetTechTipSubcategoryQuery,
	useGetTechTipFilterTopicQuery,
	useSaveUserPreferenceMutation,
	useGetUserPreferencesQuery
} = techtipsApi;
