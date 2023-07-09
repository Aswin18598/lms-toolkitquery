import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { notify } from "~/helpers";
import { AuthorDashboardApi } from "./query";

const { getAuthorLoginMonths, getAuthorTopUsers, getAuthorScoreCards, getAuthorTopCourses, getAuthorTopAssessments } =
	AuthorDashboardApi.endpoints;

const rejectedMatches = isAnyOf(
	getAuthorTopUsers.matchRejected,
	getAuthorLoginMonths.matchRejected,
	getAuthorTopCourses.matchRejected,
	getAuthorTopAssessments.matchRejected,
	getAuthorScoreCards.matchRejected
);
const slice = createSlice({
	name: "authorDashboard",
	initialState: {
		TopAssessments: [],
		TopCourses: [],
		TopCoursesMessage: null,
		TopAssessmentsMessage: null,
		AuthorDashboardDetailsMessage: null,
		PageNumber: 1,
		PageSize: 10
	},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(getAuthorTopCourses.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TopCoursesMessage = Message;
				state.TopCourses = Data;
			})
			.addMatcher(getAuthorTopAssessments.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TopAssessmentsMessage = Message;
				state.TopAssessments = Data;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const payload = action.payload;
				if (payload?.data) notify("author_dashboard_error_message", payload?.data);
			});
	}
});

const reducer = { AuthorDashboradReducer: slice.reducer };
addRootReducer(reducer);
