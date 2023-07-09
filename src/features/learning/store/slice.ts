import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { addRootReducer } from "~/config/store/reducers";
import { learningApi } from "~/features/learning/store";

const {
	getMasterCourseCategories,
	getFilterCourses,
	getFilterCoursesInitial,
	getCourseProperties,
	getAssessmentProperties,
	getCourseTableOfContent,
	getFilterAssesments,
	getFilterAssesmentsInitial,
	getUserHistoryGridData,
	getMyLearningGridData,
	getAddFavoriteItem,
	getRemoveFavoriteItem,
	getCategoryList,
	getSubCategoryList,
	getTopicList,
	getCategoriesList,
	getSubCategoriesList,
	getTopicsList,
	getMyLearningPath,
	getCertificateInfo,
	getCourseForum,
	getCreatePosting,
	getUpdatePosting,
	getDeletePosting,
	getCreateReply,
	getUpdateReply,
	getDeleteReply,
	getHideReply,
	getDownload
} = learningApi.endpoints;

const rejectedMatches = isAnyOf(
	getMasterCourseCategories.matchRejected,
	getFilterCourses.matchRejected,
	getFilterCoursesInitial.matchRejected,
	getCourseProperties.matchRejected,
	getAssessmentProperties.matchRejected,
	getCourseTableOfContent.matchRejected,
	getFilterAssesments.matchRejected,
	getFilterAssesmentsInitial.matchRejected,
	getUserHistoryGridData.matchRejected,
	getMyLearningGridData.matchRejected,
	getAddFavoriteItem.matchRejected,
	getRemoveFavoriteItem.matchRejected,
	getCategoryList.matchRejected,
	getSubCategoryList.matchRejected,
	getTopicList.matchRejected,
	getCategoriesList.matchRejected,
	getSubCategoriesList.matchRejected,
	getTopicsList.matchRejected,
	getMyLearningPath.matchRejected,
	getCertificateInfo.matchRejected,
	getCourseForum.matchRejected
);

const rejectedDiscussionforums = isAnyOf(
	getCreatePosting.matchRejected,
	getUpdatePosting.matchRejected,
	getDeletePosting.matchRejected,
	getCreateReply.matchRejected,
	getUpdateReply.matchRejected,
	getDeleteReply.matchRejected,
	getHideReply.matchRejected,
	getDownload.matchRejected
);
const fulfilledDiscussionforums = isAnyOf(
	getCreatePosting.matchFulfilled,
	getUpdatePosting.matchFulfilled,
	getDeletePosting.matchFulfilled,
	getCreateReply.matchFulfilled,
	getUpdateReply.matchFulfilled,
	getDeleteReply.matchFulfilled,
	getHideReply.matchFulfilled,
	getDownload.matchFulfilled
);

const learningSlice = createSlice({
	name: "learning",
	initialState: {
		MasterCourseCategories: [],
		MasterCourseCategoriesMessage: "",
		MasterCourses: [],
		MasterCoursesInitial: [],
		MasterCourseMessage: "",
		CourseProperties: [],
		CoursePropertiesMessage: "",
		AssessmentProperties: [],
		AssessmentPropertiesMessage: "",
		CourseTableOfContent: [],
		CourseTableOfContentMessage: "",
		Assesments: [],
		AssesmentsInitial: [],
		AssesmentsMessage: "",
		UserHistoryGridData: [],
		UserHistoryGridDataMessage: "",
		MyLearningCourseGridData: [],
		MyLearningCourseGridDataMessage: "",
		MyLearningAssesmentGridData: [],
		MyLearningAssesmentGridDataMessage: "",
		CategoryList: [],
		CategoryListMessage: "",
		SubCategoryList: [],
		SubCategoryListMessage: "",
		TopicList: [],
		TopicListMessage: "",
		LearningPath: {},
		LearningPathMessage: "",
		CertificateInfo: [],
		CertificateInfoMessage: "",
		CourseCatagoryID: 0,
		SubCatagoryID: -1,
		SkillLevelID: -1,
		Rating: -1,
		TopicID: -1,
		TypeID: 1,
		PageNumber: 1,
		PageSize: 10,
		Status: 0,
		HeaderSelect: -1,
		PostSize: 10,
		SearchText: "",
		CategoryLists: [],
		SubCategoryLists: [],
		TopicLists: [],
		DiscussionSearchText: "",
		RenderedAPIData: {}
	},
	reducers: {
		setSelectedCatagoryID: (state: any, action: PayloadAction<any>) => {
			state.CourseCatagoryID = action.payload;
		},
		setSelectedSkillLevelID: (state: any, action: PayloadAction<any>) => {
			state.SkillLevelID = action.payload;
		},
		setSelectedSubCatagoryID: (state: any, action: PayloadAction<any>) => {
			state.SubCatagoryID = action.payload;
		},
		setSelectedRatingID: (state: any, action: PayloadAction<any>) => {
			state.Rating = action.payload;
		},
		setSelectedTopicID: (state: any, action: PayloadAction<any>) => {
			state.TopicID = action.payload;
		},
		setSelectedPageNumber: (state: any, action: PayloadAction<any>) => {
			state.PageNumber = action.payload;
		},
		setSelectedPageSize: (state: any, action: PayloadAction<any>) => {
			state.PageSize = action.payload;
		},
		setSelectedStatus: (state: any, action: PayloadAction<any>) => {
			state.Status = action.payload;
		},
		setSelectedSearchText: (state: any, action: PayloadAction<any>) => {
			state.SearchText = action.payload;
		},
		setSelectedAssesments: (state: any, action: PayloadAction<any>) => {
			state.Assesments = action.payload;
		},
		setSelectedTypeID: (state: any, action: PayloadAction<any>) => {
			state.TypeID = action.payload;
		},
		setCourseDataToEmpty: (state: any, action: PayloadAction<any>) => {
			state.MasterCourses = action.payload;
		},
		setAssesmentsDataToEmpty: (state: any, action: PayloadAction<any>) => {
			state.Assesments = action.payload;
		},
		setCertificateDataToEmpty: (state: any, action: PayloadAction<any>) => {
			state.CertificateInfo = action.payload;
			state.CertificateInfoMessage = "";
		},
		setDiscussionSearchText: (state: any, action: PayloadAction<any>) => {
			state.DiscussionSearchText = action.payload;
		},
		setRenderedAPIData: (state: any, action: PayloadAction<any>) => {
			state.RenderedAPIData = action.payload;
		},
		setHeaderSelect: (state: any, action: PayloadAction<any>) => {
			state.HeaderSelect = action.payload;
		},
		setPostSize: (state: any, action: PayloadAction<any>) => {
			state.PostSize = action.payload;
		}
	},

	extraReducers(builder) {
		builder
			.addMatcher(getMasterCourseCategories.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.MasterCourseCategories = Data;
				state.MasterCourseCategoriesMessage = Message;
			})
			.addMatcher(getFilterCourses.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.MasterCourses = Data;
				state.MasterCourseMessage = Message;
			})
			.addMatcher(getFilterCoursesInitial.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.MasterCoursesInitial = Data;
			})
			.addMatcher(getCourseProperties.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.CourseProperties = Data;
				state.CoursePropertiesMessage = Message;
			})
			.addMatcher(getCourseTableOfContent.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.CourseTableOfContent = Data;
				state.CourseTableOfContentMessage = Message;
			})
			.addMatcher(getFilterAssesments.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.Assesments = Data;
				state.AssesmentsMessage = Message;
			})
			.addMatcher(getFilterAssesmentsInitial.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.AssesmentsInitial = Data;
			})
			.addMatcher(getUserHistoryGridData.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.UserHistoryGridData = Data;
				state.UserHistoryGridDataMessage = Message;
			})
			.addMatcher(getMyLearningGridData.matchFulfilled, (state, action: any) => {
				const { ItemType } = action.meta.arg.originalArgs;
				const { Data, Message } = action.payload;
				if (ItemType === 1) {
					state.MyLearningCourseGridData = Data;
					state.MyLearningCourseGridDataMessage = Message;
				} else {
					state.MyLearningAssesmentGridData = Data;
					state.MyLearningAssesmentGridDataMessage = Message;
				}
			})
			.addMatcher(getAssessmentProperties.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.AssessmentProperties = Data;
				state.AssessmentPropertiesMessage = Message;
			})
			.addMatcher(getCategoryList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.CategoryList = Data;
				state.CategoryListMessage = Message;
			})
			.addMatcher(getSubCategoryList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.SubCategoryList = Data;
				state.SubCategoryListMessage = Message;
			})
			.addMatcher(getTopicList.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.TopicList = Data;
				state.TopicListMessage = Message;
			})
			.addMatcher(getCategoriesList.matchFulfilled, (state, action: any) => {
				const { getCategories } = action.payload.Data;
				state.CategoryLists = getCategories;
			})
			.addMatcher(getSubCategoriesList.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.SubCategoryLists = Data;
			})
			.addMatcher(getTopicsList.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.TopicLists = Data;
			})
			.addMatcher(getMyLearningPath.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.LearningPath = Data;
				state.LearningPathMessage = Message;
			})
			.addMatcher(getCertificateInfo.matchFulfilled, (state, action: any) => {
				const { Data, Message } = action.payload;
				state.CertificateInfo = Data;
				state.CertificateInfoMessage = Message;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const { error } = action;
			})
			.addMatcher(rejectedDiscussionforums, (state, action: any) => {
				const { Message, Errors } = action.payload.data;
				toast.error(Message || Errors[0]);
			})
			.addMatcher(fulfilledDiscussionforums, (state, action: any) => {
				const { Message } = action.payload;
				toast.success(Message);
			});
	}
});

export const LearningAction = learningSlice.actions;

export const {
	setSelectedCatagoryID,
	setSelectedSkillLevelID,
	setSelectedSubCatagoryID,
	setSelectedRatingID,
	setSelectedTopicID,
	setSelectedTypeID,
	setSelectedPageNumber,
	setSelectedPageSize,
	setSelectedStatus,
	setSelectedAssesments,
	setSelectedSearchText,
	setCourseDataToEmpty,
	setAssesmentsDataToEmpty,
	setCertificateDataToEmpty,
	setDiscussionSearchText,
	setRenderedAPIData,
	setHeaderSelect,
	setPostSize
} = learningSlice.actions;

const reducer = { learningReducer: learningSlice.reducer };
addRootReducer(reducer);
