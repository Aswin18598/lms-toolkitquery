import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { DomainApi } from "~/features/auth/sso-login/store/query";
import { notify } from "~/helpers";

const { ssoRequest, tokenValidation } = DomainApi.endpoints;

const ssoLoginSlice = createSlice({
	name: "auth_sso_login",
	initialState: {},
	reducers: {},
	extraReducers(builder) {
		builder.addMatcher(ssoRequest.matchFulfilled, (state, action: any) => {
			const { Data } = action.payload;
			window.location.href = Data[0].ssoLoginUrl;
		});
		// .addMatcher(isAnyOf(ssoRequest.matchRejected, tokenValidation.matchRejected), (state, action: any) => {
		// 	const { data } = action.payload;
		// 	notify("sso_error", data);
		// });
	}
});

export const ssoLoginAction = ssoLoginSlice.actions;
const reducer = { authSsoLogin: ssoLoginSlice.reducer };

addRootReducer(reducer);
