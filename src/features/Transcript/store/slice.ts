import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { TranscriptApi } from "./query";

const { getTranscriptUserDetails, getTranscriptCourseHistory, getTranscriptAssessmentHistory, getTranscriptUser } =
	TranscriptApi.endpoints;

const TranscriptSlice = createSlice({
	name: "Transcript",
	initialState: {
		TranscriptUserDetails: [],
		TranscriptCourseHistory: [],
		TranscriptAssessmentHistory: [],
		TranscriptUserDetailsMessage: "",
		TranscriptCourseHistoryMessage: "",
		TranscriptAssessmentHistoryMessage: "",
		TranscriptUser: [],
		TranscriptUserMessage: "",
		isCourseView: false,
		isAssessmentView: false,
		CourseID: -1,
		AssessmentID: -1,
		PageNumber: 1,
		PageSize: 10
	},
	reducers: {
		setIsCourseView: (state, action: PayloadAction<any>) => {
			state.isCourseView = action.payload;
		},
		setIsAssessmentView: (state, action: PayloadAction<any>) => {
			state.isAssessmentView = action.payload;
		},
		setCourseID: (state, action: PayloadAction<any>) => {
			state.CourseID = action.payload;
		},
		setAssessmentID: (state, action: PayloadAction<any>) => {
			state.AssessmentID = action.payload;
		},
		setSelectedPageNumber: (state: any, action: PayloadAction<any>) => {
			state.PageNumber = action.payload;
		},
		setSelectedPageSize: (state: any, action: PayloadAction<any>) => {
			state.PageSize = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getTranscriptUserDetails.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TranscriptUserDetails = Data;
				state.TranscriptUserDetailsMessage = Message;
			})
			.addMatcher(getTranscriptCourseHistory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TranscriptCourseHistory = Data;
				state.TranscriptCourseHistoryMessage = Message;
			})
			.addMatcher(getTranscriptAssessmentHistory.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TranscriptAssessmentHistory = Data;
				state.TranscriptAssessmentHistoryMessage = Message;
			})
			.addMatcher(getTranscriptUser.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TranscriptUser = Data;
				state.TranscriptUserMessage = Message;
			});
	}
});

const reducer = { TranscriptReducer: TranscriptSlice.reducer };
export const {
	setIsCourseView,
	setCourseID,
	setSelectedPageNumber,
	setSelectedPageSize,
	setIsAssessmentView,
	setAssessmentID
} = TranscriptSlice.actions;
addRootReducer(reducer);
