import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";
import { AdminDashboardApi } from "./query";

const { getLoginMonths, getTopUsers, getUserScoreCards, getCurrentSubscription, getTopCourses, getTopAssessments } =
	AdminDashboardApi.endpoints;

const rejectedMatches = isAnyOf(
	getTopUsers.matchRejected,
	getLoginMonths.matchRejected,
	getTopCourses.matchRejected,
	getTopAssessments.matchRejected,
	getUserScoreCards.matchRejected,
	getCurrentSubscription.matchRejected
);

const slice = createSlice({
	name: "admin_dashboard_error_message",
	initialState: {
		AdminDashboardDetails: [],
		TopAssessments: [],
		TopCourses: [],
		TopCoursesMessage: null,
		TopAssessmentsMessage: null,
		AdminDashboardDetailsMessage: null,
		PageNumber: 1,
		PageSize: 10
	},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(getTopCourses.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TopCoursesMessage = Message;
				state.TopCourses = Data;
			})
			.addMatcher(getTopAssessments.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TopAssessmentsMessage = Message;
				state.TopAssessments = Data;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const payload = action.payload;
				if (payload?.data) notify("admin_dashboard_error_message", payload?.data);
			});
	}
});

export const AdminDashboard = slice.actions;
const reducer = { AdminDashboardReducer: slice.reducer };
addRootReducer(reducer);
