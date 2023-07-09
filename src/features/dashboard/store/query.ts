import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const dashboardApi = api.injectEndpoints({
	endpoints: builder => ({
		getCourseList: builder.query({
			query: () => ({
				url: endPoints.dashboard.courseList
			})
		}),
		trendingSubscriptionByCurrencyCode: builder.query({
			query: currencyCode => ({
				url: endPoints.dashboard.trendingSubscriptionByCode.replace(":currencyCode", currencyCode)
			})
		}),
		getCatalogList: builder.query({
			query: () => endPoints.dashboard.catalogList
		}),
		getCourseListInProgress: builder.query({
			query: userID => ({
				url: endPoints.dashboard.CourseListInProgress.replace(":userID", userID)
			})
		}),
		getTranscriptList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.TranscriptList.replace(":userID", userID)
			})
		}),
		getLeaderBoard: builder.query({
			query: userID => ({
				url: endPoints.dashboard.LeaderBoard.replace(":userID", userID)
			})
		}),
		getScorecard: builder.query({
			query: userID => ({
				url: endPoints.dashboard.Scorecard.replace(":userID", userID)
			})
		}),
		getRecommendedCourseList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.RecommendedCourseList.replace(":userID", userID)
			})
		}),
		getPeersCourseList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.PeersCourseList.replace(":userID", userID)
			})
		}),
		getLearningPath: builder.query({
			query: userID => ({
				url: endPoints.dashboard.LearningPath.replace(":userID", userID)
			})
		}),
		getUpcomingEventsTodayList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.UpcomingEventsTodayList.replace(":userID", userID)
			})
		}),
		getUpcomingEventsWeekList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.UpcomingEventsWeekList.replace(":userID", userID)
			})
		}),
		getUpcomingEventsMonthList: builder.query({
			query: userID => ({
				url: endPoints.dashboard.UpcomingEventsMonthList.replace(":userID", userID)
			})
		}),
		getTimeSpent: builder.query({
			query: userID => ({
				url: endPoints.dashboard.TimeSpent.replace(":userID", userID)
			})
		}),
		getTimeSpentGraph: builder.query({
			query: userID => ({
				url: endPoints.dashboard.TimeSpentGraph.replace(":userID", userID)
			})
		}),
		getPopularRoles: builder.query({
			query: userID => ({
				url: endPoints.dashboard.PopularRoles.replace(":userID", userID)
			})
		}),
		getPopularRolesGraph: builder.query({
			query: userID => ({
				url: endPoints.dashboard.PopularRolesGraph.replace(":userID", userID)
			})
		}),
		getProfileData: builder.query({
			query: userID => ({
				url: endPoints.dashboard.ProfileData.replace(":userID", userID)
			})
		}),
		getHeroSectionDetails: builder.query({
			query: userID => ({
				url: endPoints.dashboard.HeroSectionDetails.replace(":userID", userID)
			})
		}),
		getGetLinkedinAccess: builder.query({
			query: userID => ({
				url: endPoints.dashboard.GetLinkedinAccess.replace(":userID", userID),
				method: "GET"
			}),
			transformResponse: (response: any) => response.Data
		})
	})
});

export const {
	useGetCourseListQuery,
	useTrendingSubscriptionByCurrencyCodeQuery,
	useGetCatalogListQuery,
	useGetCourseListInProgressQuery,
	useGetTranscriptListQuery,
	useGetLeaderBoardQuery,
	useGetScorecardQuery,
	useGetRecommendedCourseListQuery,
	useGetPeersCourseListQuery,
	useGetLearningPathQuery,
	useGetUpcomingEventsTodayListQuery,
	useGetUpcomingEventsWeekListQuery,
	useGetUpcomingEventsMonthListQuery,
	useGetTimeSpentQuery,
	useGetTimeSpentGraphQuery,
	useGetPopularRolesQuery,
	useGetPopularRolesGraphQuery,
	useGetProfileDataQuery,
	useGetHeroSectionDetailsQuery,
	useGetGetLinkedinAccessQuery
} = dashboardApi;
