import { toast } from "react-hot-toast";
import { createSlice } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";
import { ForgotPasswordApi } from "~/features/auth/forgot-password/store";

const auth = ForgotPasswordApi.endpoints;

const slice = createSlice({
	name: "auth_forgot_password",
	initialState: {},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(auth.forgotPassword.matchFulfilled, (state, action: any) => {
				const payload: any = action.payload;
				toast.success(payload.Message);
			})
			.addMatcher(auth.forgotPassword.matchRejected, (state, action: any) => {
				const { data } = action.payload;
				notify("forgot_password_error_message", data);
			});
	}
});

export const forgotPasswordAction = slice.actions;
const reducer = { authForgotPassword: slice.reducer };

addRootReducer(reducer);
