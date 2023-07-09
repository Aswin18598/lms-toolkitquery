import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { dashboardApi } from "~/features/dashboard/store";
import { notify } from "~/helpers";
const {
	getCourseList,
	trendingSubscriptionByCurrencyCode,
	getCatalogList,
	getCourseListInProgress,
	getTranscriptList,
	getLeaderBoard,
	getScorecard,
	getRecommendedCourseList,
	getPeersCourseList,
	getLearningPath,
	getUpcomingEventsTodayList,
	getUpcomingEventsWeekList,
	getUpcomingEventsMonthList,
	getTimeSpent,
	getTimeSpentGraph,
	getPopularRoles,
	getPopularRolesGraph,
	getProfileData,
	getHeroSectionDetails,
	getGetLinkedinAccess
} = dashboardApi.endpoints;

const rejectedMatches = isAnyOf(
	getCourseList.matchRejected,
	trendingSubscriptionByCurrencyCode.matchRejected,
	getCatalogList.matchRejected
);

const slice = createSlice({
	name: "dashbarod",
	initialState: {
		courseList: [],
		trendingSubscription: [],
		catalogList: [],
		courseListInProgress: [],
		transcriptList: [],
		leaderBoard: [],
		scorecard: [],
		recommendedCourseList: [],
		peersCourseList: [],
		learningPath: [],
		upcomingEventsTodayList: [],
		upcomingEventsWeekList: [],
		upcomingEventsMonthList: [],
		timeSpent: [],
		timeSpentGraph: [],
		popularRoles: [],
		popularRolesGraph: [],
		ProfileData: [],
		HeroSectionDetails: [],
		GetLinkedinAccess: [],

		courseListMessage: "",
		trendingSubscriptionMessage: "",
		catalogListMessage: "",
		courseListInProgressMessage: "",
		transcriptListMessage: "",
		leaderBoardMessage: "",
		scorecardMessage: "",
		recommendedCourseListMessage: "",
		peersCourseListMessage: "",
		learningPathMessage: "",
		upcomingEventsTodayListMessage: "",
		upcomingEventsWeekListMessage: "",
		upcomingEventsMonthListMessage: "",
		timeSpentMessage: "",
		timeSpentGraphMessage: "",
		popularRolesMessage: "",
		popularRolesGraphMessage: "",
		ProfileDataMessage: "",
		HeroSectionDetailMessage: "",
		GetLinkedinAccessMessage: ""
	},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(getCourseList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.courseList = Data;
				state.courseListMessage = Message;
			})
			.addMatcher(trendingSubscriptionByCurrencyCode.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.trendingSubscription = Data;
				state.trendingSubscriptionMessage = Message;
			})
			.addMatcher(getCatalogList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.catalogList = Data;
				state.catalogListMessage = Message;
			})
			.addMatcher(getCourseListInProgress.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.courseListInProgress = Data;
				state.courseListInProgressMessage = Message;
			})
			.addMatcher(getTranscriptList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.transcriptList = Data;
				state.transcriptListMessage = Message;
			})
			.addMatcher(getLeaderBoard.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.leaderBoard = Data;
				state.leaderBoardMessage = Message;
			})
			.addMatcher(getScorecard.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.scorecard = Data;
				state.scorecardMessage = Message;
			})
			.addMatcher(getRecommendedCourseList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.recommendedCourseList = Data;
				state.recommendedCourseListMessage = Message;
			})
			.addMatcher(getPeersCourseList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.peersCourseList = Data;
				state.peersCourseListMessage = Message;
			})
			.addMatcher(getLearningPath.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.learningPath = Data;
				state.learningPathMessage = Message;
			})
			.addMatcher(getUpcomingEventsTodayList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.upcomingEventsTodayList = Data;
				state.upcomingEventsTodayListMessage = Message;
			})
			.addMatcher(getUpcomingEventsWeekList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.upcomingEventsWeekList = Data;
				state.upcomingEventsWeekListMessage = Message;
			})
			.addMatcher(getUpcomingEventsMonthList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.upcomingEventsMonthList = Data;
				state.upcomingEventsMonthListMessage = Message;
			})
			.addMatcher(getTimeSpent.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.timeSpent = Data;
				state.timeSpentMessage = Message;
			})
			.addMatcher(getTimeSpentGraph.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.timeSpentGraph = Data;
				state.timeSpentGraphMessage = Message;
			})
			.addMatcher(getPopularRoles.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.popularRoles = Data;
				state.popularRolesMessage = Message;
			})
			.addMatcher(getPopularRolesGraph.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.popularRolesGraph = Data;
				state.popularRolesGraphMessage = Message;
			})
			.addMatcher(getProfileData.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.ProfileData = Data;
				state.ProfileDataMessage = Message;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const payload = action.payload;
				if (payload?.data) notify("dashboard_error_messages", payload?.data);
			})
			.addMatcher(getHeroSectionDetails.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.HeroSectionDetails = Data;
				state.HeroSectionDetailMessage = Message;
			})
			.addMatcher(getGetLinkedinAccess.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.GetLinkedinAccess = Data;
			});
	}
});

export const dashbarodAction = slice.actions;
const reducer = { dashboard: slice.reducer };
addRootReducer(reducer);
