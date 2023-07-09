import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const searchApi = api.injectEndpoints({
	endpoints: builder => ({
		getGetHiddenCategoriesList: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.search.GetHiddenCategoriesList, {
						AccountID: userDetails.AccountId
					})
				};
			}
		}),
		getGetCourses: builder.query({
			query: ({ DocID, UserID }) => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.search.GetCourses, {
						DocID: DocID,
						UserID: UserID
					})
				};
			}
		}),
		Search: builder.mutation({
			query: body => {
				const { SessionId } = getLoggedUser();
				return {
					url: generatePath(endPoints.search.Search, { SessionID: SessionId }),
					method: "POST",
					body: { ...body }
				};
			}
		}),
		Suggest: builder.mutation({
			query: body => {
				return {
					url: endPoints.search.Suggest,
					method: "POST",
					body: { ...body }
				};
			}
		}),
		GetMoreFacets: builder.mutation({
			query: body => {
				return {
					url: endPoints.search.GetMoreFacets,
					method: "POST",
					body: { ...body }
				};
			}
		})
	})
});

export const {
	useGetGetHiddenCategoriesListQuery,
	useGetGetCoursesQuery,
	useSearchMutation,
	useSuggestMutation,
	useGetMoreFacetsMutation
} = searchApi;
