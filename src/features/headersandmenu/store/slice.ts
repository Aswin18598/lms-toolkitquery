import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { HeadersandMenuApi } from "~/features/headersandmenu/store";

const { getFavorites, getSubscriptions, getCheckTrialUser } = HeadersandMenuApi.endpoints;

const rejectedMatches = isAnyOf(getFavorites.matchRejected, getSubscriptions.matchRejected);
const slice = createSlice({
	name: "headersandmenu",
	initialState: {
		Favorites: [],
		Subscriptions: [],
		TrialUser: [],
		FavoritesMessage: "",
		SubscriptionMessage: "",
		TrialUserMessage: ""
	},
	reducers: {},
	extraReducers(builder) {
		builder
			.addMatcher(getFavorites.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Favorites = Data;
				state.FavoritesMessage = Message;
			})
			.addMatcher(getSubscriptions.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Subscriptions = Data;
				state.SubscriptionMessage = Message;
			})
			.addMatcher(getCheckTrialUser.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TrialUser = Data;
				state.TrialUserMessage = Message;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { error } = action;
			});
	}
});

export const headersandmenuAction = slice.actions;
const reducer = { headersandmenuReducer: slice.reducer };
addRootReducer(reducer);
