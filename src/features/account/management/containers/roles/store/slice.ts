import { toast } from "react-hot-toast";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

import { RolesApi } from "./query";
import { RoleInitialState, Role } from "../@types";

const { getAllRoles, getRoleById, createOrUpdate, deleteRole, addPublicRole } = RolesApi.endpoints;

const rejectedMatches = isAnyOf(
	getAllRoles.matchRejected,
	getRoleById.matchRejected,
	createOrUpdate.matchRejected,
	deleteRole.matchRejected,
	addPublicRole.matchRejected
);

const initialState: RoleInitialState = {
	isEditMode: false
};

const slice = createSlice({
	name: "account_management_role",
	initialState,
	reducers: {
		toggleRoleEdit: (state, action: PayloadAction<Role | undefined>) => {
			console.log(action);
			state.isEditMode = action.payload ? true : false;
			state.role = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addMatcher(isAnyOf(createOrUpdate.matchFulfilled, deleteRole.matchFulfilled), (state, action: any) => {
			toast.success(action.payload?.Message, { id: "roles_success_message" });
		});
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			console.log(payload);
			if (payload?.data) notify("roles_error_message", payload?.data);
		});
	}
});

export const roleAction = slice.actions;
const reducer = { accountManagementRole: slice.reducer };
addRootReducer(reducer);
