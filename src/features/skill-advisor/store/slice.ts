import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

import { SkillAdvisorApi } from "./query";
import { Page, Params, State } from "../@types";

const rejectedMatches = isAnyOf(
	SkillAdvisorApi.endpoints.getUserTypeRoles.matchRejected,
	SkillAdvisorApi.endpoints.getSoftwareList.matchRejected,
	SkillAdvisorApi.endpoints.getSubscriptionsList.matchRejected,
	SkillAdvisorApi.endpoints.getCoursesList.matchRejected,
	SkillAdvisorApi.endpoints.getAssessmentsList.matchRejected
);

const initialState: State = {
	isFilterApplied: false,
	currentPage: Page.banner,
	filterValues: {}
};

const slice = createSlice({
	name: "skill_advisor",
	initialState,
	reducers: {
		setCurrentPage: (state, action: PayloadAction<Page>) => {
			state.currentPage = action.payload;
			if (action.payload === Page.plan) {
				state.plan = {};
			}
			if (action.payload === Page.banner) {
				state.isFilterApplied = false;
				state.filterValues = {};
			}
		},
		setFilterValue: (state, action: PayloadAction<Params>) => {
			state.filterValues = { ...state.filterValues, ...action.payload };
		},
		setPreviewUrl: (state, action: PayloadAction<string>) => {
			state.previewUrl = action.payload;
		},
		setDetailsPage: (state, action: PayloadAction<any>) => {
			state.isFilterApplied = true;
			state.currentPage = Page.planDetails;
			state.plan = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			if (payload?.data) notify("skill_advisor_error_message", payload?.data);
		});
	}
});

export const skillAdvisorAction = slice.actions;
const skillAdvisorReducer = { skillAdvisor: slice.reducer };
addRootReducer(skillAdvisorReducer);
