import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { notify } from "~/helpers";
import { AuthorCourseDetailApi } from "./query";

const { getCoursesCanCopy, getCoursesCanCopyCSV, getCoursesCategory, getCoursesSubCategory } =
	AuthorCourseDetailApi.endpoints;

const rejectedMatches = isAnyOf(
	getCoursesCanCopy.matchRejected,
	getCoursesCanCopyCSV.matchRejected,
	getCoursesCategory.matchRejected,
	getCoursesSubCategory.matchRejected
);

const slice = createSlice({
	name: "authorDashboard",
	initialState: {
		CoursesCanCopy: [],
		CoursesCanCopyCSV: [],
		Categories: [],
		SubCategories: [],
		CoursesCanCopyMessage: null,
		CategoriesMessage: null,
		SubCategoriesMessage: null,
		CategoryID: 0,
		SubCategoryID: 0
	},
	reducers: {
		setSelectedCategoryID: (state: any, action: PayloadAction<any>) => {
			state.CategoryID = action.payload;
		},
		setSelectedSubCategoryID: (state: any, action: PayloadAction<any>) => {
			state.SubCategoryID = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getCoursesCanCopy.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.CoursesCanCopy = Data;
				state.CoursesCanCopyMessage = Message;
			})
			.addMatcher(getCoursesCanCopyCSV.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.CoursesCanCopyCSV = Data;
			})
			.addMatcher(getCoursesCategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Categories = Data;
				state.CategoriesMessage = Message;
			})
			.addMatcher(getCoursesSubCategory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.SubCategories = Data;
				state.SubCategoriesMessage = Message;
			});
		builder.addMatcher(rejectedMatches, (state, action: any) => {
			const payload = action.payload;
			if (payload?.data) notify("competency_error_message", payload?.data);
		});
	}
});

export const CourseBuilderAction = slice.actions;
export const { setSelectedCategoryID, setSelectedSubCategoryID } = slice.actions;

const reducer = { CourseDetailReducer: slice.reducer };
addRootReducer(reducer);
