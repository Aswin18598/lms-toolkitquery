import { toast } from "react-hot-toast";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";
import { signUpApi } from "~/features/auth/sign-up/store";

const { signUp, sendOtp, verifyOtp } = signUpApi.endpoints;
const rejectedMatches = isAnyOf(signUp.matchRejected, sendOtp.matchRejected, verifyOtp.matchRejected);

const slice = createSlice({
	name: "authSignUp",
	initialState: {
		isVerified: false,
		isOtpVerified: false,
		Email: undefined
	},
	reducers: {
		toggleIsVerified: state => {
			state.isVerified = !state.isVerified;
		},
		toggleOtpVerified: (state, action) => {
			state.isOtpVerified = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(signUp.matchFulfilled, (state, action: any) => {
				const payload: any = action.payload;
				state.isOtpVerified = false;
				toast.success(payload.Message);
			})
			.addMatcher(sendOtp.matchFulfilled, (state, action) => {
				const { Message } = action.payload;
				toast.success(Message, { id: "verify_email" });
				state.Email = action.meta.arg.originalArgs.EmailID;
				state.isVerified = true;
			})
			.addMatcher(verifyOtp.matchFulfilled, (state, action: any) => {
				const { Message } = action.payload;
				state.isVerified = false;
				state.Email = undefined;
				state.isOtpVerified = true;
				toast.success(Message, { id: "verify_otp_success" });
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { data } = action.payload;
				notify("sign_up_error_message", data);
			});
	}
});

export const signUpAction = slice.actions;
const reducer = { authSignUp: slice.reducer };

export const isVerified = (state: any) => state.authSignUp.isVerified;
addRootReducer(reducer);
