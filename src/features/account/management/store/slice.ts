import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { addRootReducer } from "~/config/store/reducers";
import { notify } from "~/helpers";
import { ManagementApi } from "./query";

const {
	learningAssignmentsList,
	preDefinedLearningPathList,
	learningPathItems,
	assignedCoursesAndAssessments,
	subCategoriesList,
	categoriesList,
	subCategories,
	coursesForLearningPath,
	assessmentsForLearningPath,
	integrationsForLearningPath,
	userListForLearningPath,
	groupListForLearningPath,
	unAssignedGroupsForLearningPath,
	assignedUsersForLearningPath,
	assignedGroupForLearningPath,
	assignedAggregationsForLearningPath,
	conditionalUsersForLearningPath,
	assignUserToLearningPath,
	assignGroupToLearningPath,
	learningPathIntegrationAction,
	removeGroupFromLp,
	removeUserFromLp,
	// learningPathItemAction,
	learningPathActionsInput,
	dynamicGroupInfoLp,
	dynamicFieldOptions
} = ManagementApi.endpoints;

const initialState = {
	assignedLearning: {
		learningAssignments: [],
		learningAssignmentEmptyMessage: null,
		preDefinedLearningPaths: {},
		preDefinedLearningPathsEmptyMessage: null,
		learningPathItemsDetails: [],
		assignedCoursesAndAssessments: [],
		learningPathItemsEmptyMessage: null,
		pathId: 0,
		// predefined learning path dropdown
		preDefinedSubCategories: [],
		categories: [],
		subCategoriesList: [],
		// assessmentTabcontent courseTab
		coursesForLearningPath: {
			CoursesForLearningPaths: []
		},
		assessmentsForLearningPath: {
			AssessmentsForLearningPath: []
		},
		assessmentsForLearningPathEmptyMessage: null,
		coursesForLearningPathEmptyMessage: null,
		// assessmentTabcontent integrations tab
		dynamicFieldOptions: [], //for sourse dropdown
		integrationsForLearningPath: {},
		integrationsForLearningPathEmptyMessage: null,
		// assessmentTabcontent users tab
		userListsForLearningPath: [],
		userListsForLearningPathEmptyMessage: null,
		// assessmentTabcontent groups tab
		groupListsForLearningPath: [],
		unAssignedGroupsForLearningPath: {},
		groupListsForLearningPathEmptyMessage: null,
		// assessmentTabcontent conditionalUsers tab
		conditionalUsersForLearningPath: [],
		conditionalUsersForLearningPathEmptyMessage: null,
		//assignable path dynamicGroupInfoLp
		dynamicGroupInfoLp: [],
		conditionalUsersDynamicFieldOptions: {},
		// assignedpath tabcontent usersTab
		assignedUsersForLearningPath: [],
		assignedUsersForLearningPathEmptyMessage: null,
		// assignedpath tabcontent groupsTab
		assignedGroupsForLearningPath: [],
		assignedGroupsForLearningPathEmptyMessage: null,
		// assignedpath tabcontent aggregationsTab
		assignedAggregationsForLearningPath: []
	}
};
const successMatches = isAnyOf(
	assignUserToLearningPath.matchFulfilled,
	assignGroupToLearningPath.matchFulfilled,
	learningPathIntegrationAction.matchFulfilled,
	removeGroupFromLp.matchFulfilled,
	removeUserFromLp.matchFulfilled
	// learningPathItemAction.matchFulfilled
);
const rejectedMatches = isAnyOf(
	assignUserToLearningPath.matchRejected,
	assignGroupToLearningPath.matchRejected,
	learningPathIntegrationAction.matchRejected,
	removeGroupFromLp.matchRejected,
	removeUserFromLp.matchRejected
	// learningPathItemAction.matchRejected
);

const managementSlice = createSlice({
	name: "managementReducer",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addMatcher(learningAssignmentsList.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.learningAssignmentEmptyMessage = Message;
			state.assignedLearning.learningAssignments = Data;
		});
		builder.addMatcher(preDefinedLearningPathList.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.preDefinedLearningPathsEmptyMessage = Message;
			state.assignedLearning.preDefinedLearningPaths = Data;
		});
		builder.addMatcher(learningPathItems.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.learningPathItemsDetails = Data;
			state.assignedLearning.learningPathItemsEmptyMessage = Message;
		});
		builder.addMatcher(assignedCoursesAndAssessments.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.assignedCoursesAndAssessments = Data;
		});
		// predefined learning path dropdown
		builder.addMatcher(subCategoriesList.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.preDefinedSubCategories = Data;
		});
		builder.addMatcher(categoriesList.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.categories = Data;
		});
		builder.addMatcher(subCategories.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.subCategoriesList = Data;
		});
		// assignments tab content courseTab
		builder.addMatcher(coursesForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.coursesForLearningPath = Data;
			state.assignedLearning.coursesForLearningPathEmptyMessage = Message;
		});
		// assignments tab content assessmentsTab
		builder.addMatcher(assessmentsForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.assessmentsForLearningPath = Data;
			state.assignedLearning.assessmentsForLearningPathEmptyMessage = Message;
		});
		// assignments tab content integrationTab
		builder.addMatcher(integrationsForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.integrationsForLearningPath = Data;
			state.assignedLearning.integrationsForLearningPathEmptyMessage = Message;
		});
		// assignments tab content integrationTab
		builder.addMatcher(dynamicFieldOptions.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.dynamicFieldOptions = Data;
		});
		// assignments tab content usersTab
		builder.addMatcher(userListForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.userListsForLearningPath = Data;
			state.assignedLearning.userListsForLearningPathEmptyMessage = Message;
		});
		// assignments tab content groupsTab
		builder.addMatcher(groupListForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.groupListsForLearningPath = Data;
			state.assignedLearning.groupListsForLearningPathEmptyMessage = Message;
		});
		// assignments tab content groupsTab
		builder.addMatcher(unAssignedGroupsForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.unAssignedGroupsForLearningPath = Data;
		});
		// assignments tab content conditionalusersTab
		builder.addMatcher(dynamicGroupInfoLp.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.dynamicGroupInfoLp = Data;
		});
		// assignments tab content conditionalUsersTab
		builder.addMatcher(conditionalUsersForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.conditionalUsersForLearningPath = Data;
			state.assignedLearning.conditionalUsersForLearningPathEmptyMessage = Message;
		});
		// assignments tab content assignedpath tabcontent UsersTab
		builder.addMatcher(assignedUsersForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.assignedUsersForLearningPath = Data;
			state.assignedLearning.assignedUsersForLearningPathEmptyMessage = Message;
		});
		// assignments tab content assignedpath tabcontent GroupTab
		builder.addMatcher(assignedGroupForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data, Message } = action.payload;
			state.assignedLearning.assignedGroupsForLearningPath = Data;
			state.assignedLearning.assignedGroupsForLearningPathEmptyMessage = Message;
		});
		// assignments tab content assignedpath tabcontent AggregationsTab
		builder.addMatcher(assignedAggregationsForLearningPath.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			state.assignedLearning.assignedAggregationsForLearningPath = Data;
		});
		builder.addMatcher(learningPathActionsInput.matchFulfilled, (state, action: any) => {
			const { Output } = action.payload;
			state.assignedLearning.pathId = parseInt(Output);
		});
		// POST METHOD
		builder.addMatcher(successMatches, (state, action: any) => {
			toast.success(action.payload?.Message, { id: "assignUserToLearningPath_success_message" });
		});
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			if (action.payload?.data) notify("assignUserToLearningPath_error_message", action.payload?.data);
		});
	}
});

export const {} = managementSlice.actions;
const managementReducer = { managementReducer: managementSlice.reducer };

addRootReducer(managementReducer);
