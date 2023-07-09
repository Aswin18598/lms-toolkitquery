import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

const getGenerateUrl = (params: any) => {
	const user: any = getLoggedUser();
	const defaultParams = {
		UserId: user?.UserId || "-1",
		topicId: "-1",
		catagoryId: "-1",
		subCategoryId: "-1",
		skillLevelId: "-1",
		rating: "-1",
		searchText: "-1"
	};

	return { ...defaultParams, ...params };
};

export const CatalogApi = api.injectEndpoints({
	endpoints: builder => ({
		getCatalog: builder.query<any, any>({
			query: (options: any) => {
				return {
					url: generatePath(endPoints.catalog.list, getGenerateUrl(options?.filter) || {}),
					params: options?.params || { PageNumber: 1, PageSize: 20 }
				};
			}
		}),
		getCatalogDetails: builder.query<any, string | undefined>({
			query: courseId => {
				return {
					url: generatePath(endPoints.catalog.details, { courseId })
				};
			}
		}),
		getCatalogCurriculum: builder.query<any, string | undefined>({
			query: courseId => {
				const user: any = getLoggedUser();
				return {
					url: generatePath(endPoints.catalog.curriculum, {
						userId: user?.UserId || "-1",
						courseId,
						percentage: 100
					})
				};
			}
		}),
		getCourseCategories: builder.query<any, void>({
			query: () => ({ url: generatePath(endPoints.catalog.category) })
		}),
		getCategories: builder.query<any, void>({
			query: () => ({ url: generatePath(endPoints.common.categories, { categoryId: -1 }) })
		}),
		getSubCategories: builder.query<any, string>({
			query: categoryID => {
				return { url: generatePath(endPoints.common.subCategories, { categoryID }) };
			}
		}),
		getCategoriesTopics: builder.query<any, string>({
			query: categoryID => {
				return { url: generatePath(endPoints.common.categoriesTopics, { categoryID }) };
			}
		})
	})
});

export const {
	useGetCatalogQuery,
	useGetCatalogDetailsQuery,
	useGetCatalogCurriculumQuery,
	useGetCategoriesQuery,
	useGetSubCategoriesQuery,
	useGetCategoriesTopicsQuery
} = CatalogApi;
