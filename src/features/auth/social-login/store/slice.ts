import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { SocialLoginApi } from "~/features/auth/social-login/store";
import { notify } from "~/helpers";
import * as auth from "~/helpers/auth";

const { linkedIn, socialLogin } = SocialLoginApi.endpoints;
const rejectedMatches = isAnyOf(linkedIn.matchRejected, socialLogin.matchRejected);
const fulFilledMatches = isAnyOf(linkedIn.matchFulfilled, socialLogin.matchFulfilled);

const socialLoginSlice = createSlice({
	name: "auth_social_login",
	initialState: {},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(fulFilledMatches, (state, action: any) => {
				const { Data } = action.payload;
				auth.login(Data.TokenId);
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { data } = action.payload;
				notify("social_login_error_message", data);
			});
	}
});

export const socialLoginAction = socialLoginSlice.actions;
const reducer = { socialLogin: socialLoginSlice.reducer };

addRootReducer(reducer);
