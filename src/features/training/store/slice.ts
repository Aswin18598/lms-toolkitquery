import { toast } from "react-hot-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRootReducer } from "~/config/store/reducers";
import { TrainingsApi } from "./query";

const {
	getAllTrainings,
	createTraining,
	updateTraining,
	deleteTraining,
	createSession,
	updateSession,
	deleteSession,
	getPlatforms,
	getTrainingSessions,
	getSessionBySessionId,
	getSessionAttendanceReport,
	getSessionsByDate,
	getCategories,
	getSubCategoriesList,
	getCourseTitles,
	ValidateUser,
	getTrainingReports,
	TrainingFeedbackQuestions,
	PendingFeedBackSessionsList,
	SessionUserReports,
	FeedbackSessionReport,
	FeedbackUsersReport,
	FeedbackForASession
} = TrainingsApi.endpoints;

const slice = createSlice({
	name: "instructor",
	initialState: {
		InstructorAttendeeList: [],
		SearchTextInTitle: "",
		SpecificCourseID: "",
		TrainingListHistory: {},
		TrainingSessionList: {},
		NewTrainingId: "",
		AppointmentSession: {},
		CalenderCurrentView: "Month",
		CalenderCurrentDate: "",
		CategoryLists: [],
		SubCategoryLists: [],
		CourseTitles: [],
		FeedBackQuestion: [],
		SubCategoryListsMessage: "",
		CourseTitlesMessage: "",
		CatagoryID: -1,
		SubCatagoryID: -1,
		showFeedbackModel: true,
		ErrorMsg: {},
		TrainingReports: {},
		SessionTrainingReports: [],
		FeedBackSessionsList: [],
		ValidateUsers: {},
		FeedbackSessionReport: [],
		FeedbackUsersReport: [],
		FeedbackForASession: {},
		TrainingReportsMessage: "",
		FeedBackQuestionMessage: ""
	},
	reducers: {
		setSelectedPageNumber: (state: any, action: PayloadAction<any>) => {
			state.PageNumber = action.payload;
		},
		setSelectedPageSize: (state: any, action: PayloadAction<any>) => {
			state.PageSize = action.payload;
		},
		setCalenderCurrentView: (state: any, action: PayloadAction<any>) => {
			state.CalenderCurrentView = action.payload;
		},
		setCalenderCurrentDate: (state: any, action: PayloadAction<any>) => {
			state.CalenderCurrentDate = action.payload;
		},
		handleInstructorAttendeeList: (state, action: PayloadAction<any>) => {
			state.InstructorAttendeeList = state.InstructorAttendeeList.concat(action.payload);
		},
		handleCourseID: (state, action: PayloadAction<any>) => {
			state.SpecificCourseID = action.payload;
		},
		handleSearchJobs: (state, action: PayloadAction<any>) => {
			state.SearchTextInTitle = action.payload;
		},
		handleReadOnlySession: (state, action: PayloadAction<any>) => {
			state.AppointmentSession = action.payload;
		},
		removeInstructorAttendeeList: (state, action: PayloadAction<any>) => {
			state.InstructorAttendeeList.splice(action.payload, 1);
		},
		removeAllInstructorAttendeeList: state => {
			state.InstructorAttendeeList = [];
		},
		setSelectedCatagoryID: (state: any, action: PayloadAction<any>) => {
			state.CatagoryID = action.payload;
		},
		setSelectedSubCatagoryID: (state: any, action: PayloadAction<any>) => {
			state.SubCatagoryID = action.payload;
		},
		setShowFeedbackModel: (state: any, action: PayloadAction<any>) => {
			state.showFeedbackModel = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(getAllTrainings.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.TrainingListHistory = Data;
			})
			.addMatcher(getTrainingSessions.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.TrainingSessionList = Data;
			})
			.addMatcher(createTraining.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				state.NewTrainingId = action?.payload?.Data;
				toast.success(Message);
			})
			.addMatcher(updateTraining.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				toast.success(Message);
			})
			.addMatcher(deleteTraining.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				toast.success(Message);
			})
			.addMatcher(createSession.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				toast.success(Message);
			})
			.addMatcher(updateSession.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				toast.success(Message);
			})
			.addMatcher(deleteSession.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Message } = action.payload;
				console.log(action.payload);
				toast.success(Message);
			})
			.addMatcher(getCategories.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { getCategories } = action.payload.Data;
				state.CategoryLists = getCategories;
			})
			.addMatcher(getSubCategoriesList.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.SubCategoryLists = Data;
				state.SubCategoryListsMessage = Message;
			})
			.addMatcher(getCourseTitles.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.CourseTitles = Data;
				state.CourseTitlesMessage = Message;
			})

			.addMatcher(getTrainingReports.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.TrainingReports = Data;
				state.TrainingReportsMessage = Message;
			})
			.addMatcher(TrainingFeedbackQuestions.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.FeedBackQuestion = Data;
				state.FeedBackQuestionMessage = Message;
			})
			.addMatcher(PendingFeedBackSessionsList.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data, Message } = action.payload;
				state.FeedBackSessionsList = Data;
			})
			.addMatcher(SessionUserReports.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data } = action.payload;
				state.SessionTrainingReports = Data;
			})
			.addMatcher(FeedbackUsersReport.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data } = action.payload;
				state.FeedbackUsersReport = Data;
			})
			.addMatcher(FeedbackSessionReport.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data } = action.payload;
				state.FeedbackSessionReport = Data;
			})
			.addMatcher(FeedbackForASession.matchFulfilled, (state, action: PayloadAction<any>) => {
				const { Data } = action.payload;
				state.FeedbackForASession = Data;
			})
			.addMatcher(getAllTrainings.matchRejected, (state, action: PayloadAction<any>) => {
				// const { status } = action;
				state.ErrorMsg = action.payload;
			})
			.addMatcher(ValidateUser.matchRejected, (state, action: PayloadAction<any>) => {
				state.ValidateUsers = action.payload;
			});
	}
});

export const instructorAction = slice.actions;
export const getInstructorAttendeeList = (state: any) => state.instructor.InstructorAttendeeList;
export const getSearchTextInTitle = (state: any) => state.instructor.SearchTextInTitle;
export const getNewTrainingId = (state: any) => state.instructor.NewTrainingId;
export const getReadonlySession = (state: any) => state.instructor.AppointmentSession;
export const getSpecificCourseID = (state: any) => state.instructor.SpecificCourseID;

export const {
	handleInstructorAttendeeList,
	handleSearchJobs,
	handleReadOnlySession,
	removeInstructorAttendeeList,
	removeAllInstructorAttendeeList,
	setSelectedPageNumber,
	setSelectedPageSize,
	setCalenderCurrentView,
	setCalenderCurrentDate,
	setSelectedCatagoryID,
	setSelectedSubCatagoryID,
	handleCourseID,
	setShowFeedbackModel
} = slice.actions;
export const reducer = { instructor: slice.reducer };
addRootReducer(reducer);
