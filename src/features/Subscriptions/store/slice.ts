import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { userSubscriptionsApi } from "~/features/Subscriptions/store";

const {
	getSubscriptionsDetails,
	getPurchasedHistory,
	getSubscriptionsRecurly,
	getAvailableSubscription,
	getProfessionalBundle
} = userSubscriptionsApi.endpoints;

const rejectedMatches = isAnyOf(
	getSubscriptionsDetails.matchRejected,
	getPurchasedHistory.matchRejected,
	getSubscriptionsRecurly.matchRejected,
	getAvailableSubscription.matchRejected,
	getProfessionalBundle.matchRejected
);

const userSubscriptionsSlice = createSlice({
	name: "userSubscriptions",
	initialState: {
		SubscriptionsDetails: [],
		PurchasedHistory: [],
		SubscriptionsRecurly: [],
		AvailableSubscription: [],
		ProfessionalBundle: [],
		SubscriptionsDetailsMessage: "",
		PurchasedHistoryMessage: "",
		SubscriptionsRecurlyMessage: "",
		AvailableSubscriptionMessage: "",
		ProfessionalBundleMessage: "",
		PageNumber: 1,
		PageSize: 10,
		CourseID: -1,
		SearchText: "",
		CatagoryID: -1,
		SubscriptionsDetailsView: -1
	},
	reducers: {
		setSelectedPageNumber: (state: any, action: PayloadAction<any>) => {
			state.PageNumber = action.payload;
		},
		setSelectedPageSize: (state: any, action: PayloadAction<any>) => {
			state.PageSize = action.payload;
		},
		setCourseID: (state, action: PayloadAction<any>) => {
			state.CourseID = action.payload;
		},
		setSelectedSubscription: (state: any, action: PayloadAction<any>) => {
			state.AvailableSubscription = action.payload;
		},
		setSelectedSearchText: (state: any, action: PayloadAction<any>) => {
			state.SearchText = action.payload;
		},
		setSelectedCatagoryID: (state: any, action: PayloadAction<any>) => {
			state.CatagoryID = action.payload;
		},
		setSelectedSubscriptionsDetailsView: (state: any, action: PayloadAction<any>) => {
			state.SubscriptionsDetailsView = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getSubscriptionsDetails.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.SubscriptionsDetails = Data;
				state.SubscriptionsDetailsMessage = Message;
			})
			.addMatcher(getPurchasedHistory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.PurchasedHistory = Data;
				state.PurchasedHistoryMessage = Message;
			})
			.addMatcher(getSubscriptionsRecurly.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.SubscriptionsRecurly = Data;
				state.SubscriptionsRecurlyMessage = Message;
			})
			.addMatcher(getAvailableSubscription.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.AvailableSubscription = Data;
				state.AvailableSubscriptionMessage = Message;
			})
			.addMatcher(getProfessionalBundle.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.ProfessionalBundle = Data;
				state.ProfessionalBundleMessage = Message;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { error } = action;
			});
	}
});

export const SubscriptionsAction = userSubscriptionsSlice.actions;

export const {
	setSelectedPageNumber,
	setSelectedPageSize,
	setCourseID,
	setSelectedSubscription,
	setSelectedSearchText,
	setSelectedCatagoryID,
	setSelectedSubscriptionsDetailsView
} = userSubscriptionsSlice.actions;

const reducer = { userSubscriptionsReducer: userSubscriptionsSlice.reducer };
addRootReducer(reducer);
