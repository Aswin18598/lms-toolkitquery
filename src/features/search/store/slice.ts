import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { searchApi } from "./query";

const { getGetHiddenCategoriesList, getGetCourses, Search, GetMoreFacets } = searchApi.endpoints;

const rejectedMatches = isAnyOf(
	getGetHiddenCategoriesList.matchRejected,
	getGetCourses.matchRejected,
	Search.matchRejected,
	GetMoreFacets.matchRejected
);

const SearchSlice = createSlice({
	name: "search",
	initialState: {
		GlobalSearchText: "",
		FilterSubCategory: "",
		FilterSubTopic: "",
		FilterContentType: 0,
		PageNumber: 1,
		PageSize: 10
	},
	reducers: {
		HandleSearchText: (state: any, action: PayloadAction<any>) => {
			state.GlobalSearchText = action.payload;
			// state.GlobalSearchText = encodeURIComponent(action.payload);
		},
		HandleFilterClear: (state: any, action: PayloadAction<any>) => {
			state.FilterSubCategory = "";
			state.FilterSubTopic = "";
			state.FilterContentType = 0;
		},
		HandleFilterSubCategory: (state: any, action: PayloadAction<any>) => {
			if (state.FilterSubCategory !== action.payload) {
				state.FilterSubCategory = action.payload;
			} else {
				state.FilterSubCategory = "";
			}
		},
		HandleFilterSubTopic: (state: any, action: PayloadAction<any>) => {
			if (state.FilterSubTopic !== action.payload) {
				state.FilterSubTopic = action.payload;
			} else {
				state.FilterSubTopic = "";
			}
		},
		HandleFilterContentType: (state: any, action: PayloadAction<any>) => {
			if (state.FilterContentType !== action.payload) {
				state.FilterContentType = action.payload;
			} else {
				state.FilterContentType = 0;
			}
		},
		HandlePageNumber: (state: any, action: PayloadAction<any>) => {
			state.PageNumber = action.payload;
		},
		HandlePageSize: (state: any, action: PayloadAction<any>) => {
			state.PageSize = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addMatcher(rejectedMatches, (state: any, action: any) => {
			const payload = action.payload;
			if (payload) console.warn(payload?.Message);
		});
	}
});

export const SearchAction = SearchSlice.actions;
export const {
	HandleSearchText,
	HandlePageNumber,
	HandlePageSize,
	HandleFilterSubCategory,
	HandleFilterSubTopic,
	HandleFilterContentType,
	HandleFilterClear
} = SearchSlice.actions;
const reducer = { searchReducer: SearchSlice.reducer };
addRootReducer(reducer);
