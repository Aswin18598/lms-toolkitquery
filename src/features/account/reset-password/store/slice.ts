import { toast } from "react-hot-toast";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { ResetPasswordApi } from "~/features/account/reset-password/store";
import { notify } from "~/helpers";

const auth = ResetPasswordApi.endpoints;
const rejectedMatches = isAnyOf(auth.resetPassword.matchRejected, auth.verifyEmailLink.matchRejected);

const slice = createSlice({
	name: "auth_resetPassword",
	initialState: {},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(auth.resetPassword.matchFulfilled, (state, action: any) => {
				const payload: any = action.payload;
				toast.success(payload.Message);
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { data } = action.payload;
				notify("reset_error_message", data);
			});
	}
});

export const resetPasswordAction = slice.actions;
const authResetPasswordReducer = { authResetPassword: slice.reducer };
addRootReducer(authResetPasswordReducer);
