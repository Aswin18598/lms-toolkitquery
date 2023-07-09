import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export const AuthorDashboardApi = api.injectEndpoints({
	endpoints: builder => ({
		getAuthorScoreCards: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.author.AuthorDashboard.AuthorScoreCards, {
						UserID: userDetails.UserId,
						AccountID: userDetails.AccountId
					})
				};
			}
		}),
		getAuthorLoginMonths: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.author.AuthorDashboard.LoginMonths, {
						AccountID: userDetails.AccountId,
						GroupID: 0
					})
				};
			}
		}),
		getAuthorTopUsers: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.author.AuthorDashboard.TopUsers, {
						AccountID: userDetails.AccountId,
						Num: 10,
						GroupID: 0
					})
				};
			}
		}),
		getAuthorTopCourses: builder.query({
			query: params => ({
				url: generatePath(endPoints.author.AuthorDashboard.TopCourses, params)
			})
		}),
		getAuthorTopAssessments: builder.query({
			query: params => ({
				url: generatePath(endPoints.author.AuthorDashboard.TopAssessments, params)
			})
		})
	})
});

export const {
	useGetAuthorLoginMonthsQuery,
	useGetAuthorTopUsersQuery,
	useGetAuthorScoreCardsQuery,
	useGetAuthorTopCoursesQuery,
	useGetAuthorTopAssessmentsQuery
} = AuthorDashboardApi;
