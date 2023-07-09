import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { techtipsApi } from "~/features/techtips/store";
const { getTopics, getTechTipCategory, getTechTipSubcategory, getTechTipFilterTopic, getUserPreferences } =
	techtipsApi.endpoints;

const slice = createSlice({
	name: "techtips",
	initialState: {
		Topics: [],
		Category: [],
		Subcategory: [],
		DefaultSubcategory: [],
		PreferenceDetails: [],
		FilterTopic: [],
		SearchTextInTitle: { SearchText: "123", SearchInTitle: -1 },
		TopicsMessage: "",
		CategoryMessage: "",
		SubcategoryMessage: "",
		DefaultSubcategoryMessage: "",
		PreferenceDetailsMessage: "",
		FilterTopicMessage: "",
		CategorySubCategoryIDTopicIDPageNum: { CategoryID: -1, SubCategoryID: -1, TopicID: -1, PageNumber: 1 },
		apply: true
	},
	reducers: {
		handleSearchJobs: (state, action: PayloadAction<any>) => {
			state.SearchTextInTitle = action.payload;
		},
		handleCategorySubCategoryIDTopicIDPageNum: (state, action: PayloadAction<any>) => {
			state.CategorySubCategoryIDTopicIDPageNum = action.payload;
		},
		handleApply: (state, action: PayloadAction<any>) => {
			state.apply = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getTopics.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Topics = Data;
				state.TopicsMessage = Message;
			})
			.addMatcher(getTechTipCategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Category = Data;
				state.CategoryMessage = Message;
			})
			.addMatcher(getTechTipSubcategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Subcategory = Data;
				state.SubcategoryMessage = Message;
			})
			.addMatcher(getTechTipFilterTopic.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.FilterTopic = Data;
				state.FilterTopicMessage = Message;
			})
			.addMatcher(getTechTipSubcategory.matchFulfilled, (state, action: any) => {
				if (action.meta.arg.originalArgs.CategoryID === -1) {
					const { Data, Message } = action.payload;
					state.DefaultSubcategory = Data;
					state.DefaultSubcategoryMessage = Message;
				}
			})
			.addMatcher(getUserPreferences.matchFulfilled, (state, action: any) => {
				console.log("action.payload", action.payload);

				const { Data, Message } = action.payload;
				state.PreferenceDetails = Data;
				state.PreferenceDetailsMessage = Message;
			});
	}
});

export const techtipsAction = slice.actions;
export const getSearch = (state: any) => state.techtips.SearchTextInTitle;
export const getCategorySubCategoryIDTopicIDPageNum = (state: any) =>
	state.techtips.CategorySubCategoryIDTopicIDPageNum;
export const getApply = (state: any) => state.techtips.apply;

export const { handleSearchJobs, handleCategorySubCategoryIDTopicIDPageNum, handleApply } = slice.actions;
export const reducer = { techtips: slice.reducer };
addRootReducer(reducer);
