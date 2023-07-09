import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { quickstartsApi } from "~/features/quickstarts/store";

const { getGrid, getCategory, getSubcategory, getNotificationFlag } = quickstartsApi.endpoints;

const slice = createSlice({
	name: "quickstarts",
	initialState: {
		Grid: [],
		Category: [],
		Subcategory: [],
		NotificationFlag: [],
		Playlist: "",
		CategoryID: 0,
		GridMessage: "",
		CategoryMessage: "",
		SubcategoryMessage: "",
		NotificationFlagMessage: "",
		SubCategoryID: 0,
		CategorySubCategoryIDPageNum: { CategoryID: 0, SubCategoryID: 0, PageNumber: 1 },
		PageNumber: 1
	},
	reducers: {
		handleSearchPlaylist: (state, action: PayloadAction<any>) => {
			state.Playlist = action.payload;
		},
		handleCategorySubCategoryIDPageNum: (state, action: PayloadAction<any>) => {
			state.CategorySubCategoryIDPageNum = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getGrid.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Grid = Data;
				state.GridMessage = Message;
			})
			.addMatcher(getCategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Category = Data;
				state.CategoryMessage = Message;
			})
			.addMatcher(getSubcategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Subcategory = Data;
				state.SubcategoryMessage = Message;
			})
			.addMatcher(getNotificationFlag.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.NotificationFlag = Data;
				state.NotificationFlagMessage = Message;
			});
	}
});

export const quickstartsAction = slice.actions;
export const getPlaylist = (state: any) => state.quickstarts.Playlist;
export const getCategorySubCategoryIDPageNum = (state: any) => state.quickstarts.CategorySubCategoryIDPageNum;

export const { handleSearchPlaylist, handleCategorySubCategoryIDPageNum } = slice.actions;
const reducer = { quickstarts: slice.reducer };
addRootReducer(reducer);
