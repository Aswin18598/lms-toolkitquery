import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const AuthorCourseDetailApi = api.injectEndpoints({
	endpoints: builder => ({
		getCoursesCanCopy: builder.query({
			query: params => ({
				url: generatePath(endPoints.author.courseBuilder.coursesCanCopy, params)
			})
		}),
		getCoursesCanCopyCSV: builder.query({
			query: params => ({
				url: generatePath(endPoints.author.courseBuilder.coursesCanCopy, params)
			})
		}),
		getCoursesCategory: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.author.courseBuilder.categories, {
						UserID: userDetails.UserId,
						Type: "3"
					})
				};
			}
		}),
		getCoursesSubCategory: builder.query({
			query: ({ UserID, CategoryID }) => ({
				url: endPoints.author.courseBuilder.subCategories
					.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":Type", "3")
			})
		})
	})
});

export const {
	useGetCoursesCanCopyQuery,
	useGetCoursesCategoryQuery,
	useGetCoursesSubCategoryQuery,
	useGetCoursesCanCopyCSVQuery
} = AuthorCourseDetailApi;
