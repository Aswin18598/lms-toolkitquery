import { toast } from "react-hot-toast";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

import { CompetencyApi } from "./query";
import { CompetencyInitialState, Competency } from "../@types";

const { getAllCompetency, getCompetencyById, createOrUpdateCompetency, deleteCompetency } = CompetencyApi.endpoints;

const rejectedMatches = isAnyOf(
	getAllCompetency.matchRejected,
	getCompetencyById.matchRejected,
	createOrUpdateCompetency.matchRejected,
	deleteCompetency.matchRejected
);

const successMatches = isAnyOf(createOrUpdateCompetency.matchFulfilled, deleteCompetency.matchFulfilled);

const initialState: CompetencyInitialState = {
	isEditMode: false
};

const slice = createSlice({
	name: "account_management_competency",
	initialState,
	reducers: {
		toggleEdit: (state, action: PayloadAction<Competency | undefined>) => {
			state.isEditMode = action.payload ? true : false;
			state.competency = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addMatcher(successMatches, (state, action: any) => {
			toast.success(action.payload?.Message, { id: "competency_success_message" });
		});
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			if (payload?.data) notify("competency_error_message", payload?.data);
		});
	}
});

export const competencyAction = slice.actions;
const reducer = { accountManagementRole: slice.reducer };
addRootReducer(reducer);
