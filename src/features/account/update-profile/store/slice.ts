import { PayloadAction, createSlice, isAnyOf } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

import { UserUpdateProfileApi } from "./query";
import toast from "react-hot-toast";

const { getProfile, updateProfile, getBusinessManager, getCadApplicationList, getIndustryInfo, updatePassword } =
	UserUpdateProfileApi.endpoints;

const rejectedMatches = isAnyOf(
	getProfile.matchRejected,
	updateProfile.matchRejected,
	getBusinessManager.matchRejected,
	getCadApplicationList.matchRejected,
	getIndustryInfo.matchRejected,
	updatePassword.matchRejected
);

const UserUpdateProfileSlice = createSlice({
	name: "user-profile",
	initialState: {},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(isAnyOf(updateProfile.matchFulfilled, updatePassword.matchFulfilled), (state, action: any) => {
				const payload = action.payload;
				if (payload) toast.success(payload.Message);
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const payload = action.payload;
				if (payload?.data) notify("user_profile_error_message", payload?.data);
			});
	}
});

export const {} = UserUpdateProfileSlice.actions;
const UserUpdateProfileSliceReducer = { userProfileReducer: UserUpdateProfileSlice.reducer };

addRootReducer(UserUpdateProfileSliceReducer);
