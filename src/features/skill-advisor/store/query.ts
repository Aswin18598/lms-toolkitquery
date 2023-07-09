import { generatePath } from "react-router-dom";

import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

import { Params } from "../@types";

export const SkillAdvisorApi = api.injectEndpoints({
	endpoints: builder => ({
		getUserTypeRoles: builder.query<any, void>({
			query: () => ({ url: endPoints.skillAdvisor.UserTypeRoles })
		}),
		getSoftwareList: builder.query<any, string>({
			query: RoleID => ({ url: generatePath(endPoints.skillAdvisor.SkillAdvisorCategories, { RoleID: RoleID }) })
		}),
		getSubscriptionsList: builder.query<any, Params>({
			query: params => {
				const CountryCode = localStorage.getItem("location");
				return {
					url: generatePath(endPoints.skillAdvisor.Subscriptions, {
						RoleID: params.RoleID,
						ToolID: params.CategoryID,
						CountryCode
					})
				};
			}
		}),
		getCoursesList: builder.query<any, Params>({
			query: params => ({ url: `${generatePath(endPoints.skillAdvisor.Courses, params)}?pageSize=100` })
		}),
		getAssessmentsList: builder.query<any, Params>({
			query: params => ({ url: `${generatePath(endPoints.skillAdvisor.Assessments, params)}?pageSize=100` })
		})
	})
});

export const {
	useGetUserTypeRolesQuery,
	useGetSoftwareListQuery,
	useGetSubscriptionsListQuery,
	useGetCoursesListQuery,
	useGetAssessmentsListQuery
} = SkillAdvisorApi;
