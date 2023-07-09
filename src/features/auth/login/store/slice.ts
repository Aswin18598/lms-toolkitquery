import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { notify } from "~/helpers";
import * as auth from "~/helpers/auth";
import { LoginApi } from "~/features/auth/login/store";
import { addRootReducer } from "~/config/store/reducers";

const { login, userLogout } = LoginApi.endpoints;
const slice = createSlice({
	name: "auth_login",
	initialState: {},
	reducers: {
		logout: state => {
			console.info("action logout");
			// in rootReducer, we can use it to CLEAR the complete Redux Store's state
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(login.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				console.log(Data, "Data");

				auth.login(Data.TokenId);
			})
			.addMatcher(isAnyOf(login.matchRejected, userLogout.matchRejected), (state, action: any) => {
				const { data } = action.payload;
				notify("login_error_message", data);
			});
	}
});

export const loginAction = slice.actions;
const reducer = { authLogin: slice.reducer };
addRootReducer(reducer);
