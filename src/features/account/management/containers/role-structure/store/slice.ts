import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

import { RoleStructureApi } from "./query";

const rejectedMatches = isAnyOf(RoleStructureApi.endpoints.getAllRoleStructure.matchRejected);
const successMatches = isAnyOf(
	RoleStructureApi.endpoints.deleteStructure.matchFulfilled,
	RoleStructureApi.endpoints.addEditStructure.matchFulfilled,
	RoleStructureApi.endpoints.addEditStructure.matchFulfilled,
	RoleStructureApi.endpoints.addOrEditRoleSkillMapping.matchFulfilled
);

const initialState = {};

const slice = createSlice({
	name: "account_management_role_structure",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addMatcher(successMatches, (state, action: any) => {
			toast.success(action.payload?.Message, { id: "success_message" });
		});
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			if (payload?.data) notify("account_management_role_structure_error_message", payload?.data);
		});
	}
});

export const roleAction = slice.actions;
const reducer = { accountManagementRoleStructure: slice.reducer };
addRootReducer(reducer);
