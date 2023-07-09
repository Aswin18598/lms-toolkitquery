import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

const AccountIDStr = ":AccountID";

export const AdminDashboardApi = api.injectEndpoints({
	endpoints: builder => ({
		getLoginMonths: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.account.AdminDashboard.LoginMonths, {
						AccountID: userDetails.AccountId,
						GroupID: 0
					})
				};
			}
		}),
		getTopUsers: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.account.AdminDashboard.TopUsers, {
						AccountID: userDetails.AccountId,
						Num: 10,
						GroupID: 0
					})
				};
			}
		}),
		getUserScoreCards: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.account.AdminDashboard.UserScoreCards, {
						AccountID: userDetails.AccountId
					})
				};
			}
		}),
		getCurrentSubscription: builder.query({
			query: params => ({
				url: generatePath(endPoints.account.AdminDashboard.CurrentSubscription, params)
			})
		}),
		getTopCourses: builder.query({
			query: params => ({
				url: generatePath(endPoints.account.AdminDashboard.topCourses, params)
			})
		}),
		getTopAssessments: builder.query({
			query: params => ({
				url: generatePath(endPoints.account.AdminDashboard.topAssessments, params)
			})
		}),
		getDownloadUserReport: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.account.AdminDashboard.downloadUserReport, {
						AccountID: userDetails.AccountId
					})
				};
			}
		}),
		UserRoleReport: builder.mutation({
			query: FileName => ({
				url: endPoints.ReportAdmin.UserRoleReport,
				method: "POST",
				body: {
					FileName: FileName
				}
			})
		}),
		UserRoleReportExcel: builder.mutation({
			query: FileName => ({
				url: endPoints.ReportAdmin.UserRoleReportExcel,
				method: "POST",
				body: {
					FileName: FileName
				}
			})
		}),
		DowloadUserRoleReport: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.ReportAdmin.DowloadUserRoleReport, {
						UserID: userDetails.UserId,
						AccountId: 0
					})
				};
			}
		}),
		UserRoleStructureMapList: builder.query({
			query: () => {
				const userDetails = getLoggedUser();
				return {
					url: generatePath(endPoints.ReportAdmin.UserRoleStructureMapList, {
						UserID: userDetails.UserId,
						AccountId: 0,
						PageNumber: 1,
						PageSize: 0
					})
				};
			}
		})
	})
});

export const {
	useGetLoginMonthsQuery,
	useGetTopUsersQuery,
	useGetUserScoreCardsQuery,
	useGetCurrentSubscriptionQuery,
	useGetTopCoursesQuery,
	useGetTopAssessmentsQuery,
	useGetDownloadUserReportQuery,
	useUserRoleReportMutation,
	useUserRoleReportExcelMutation,
	useDowloadUserRoleReportQuery,
	useUserRoleStructureMapListQuery
} = AdminDashboardApi;
