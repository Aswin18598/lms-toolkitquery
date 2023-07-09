import { generatePath } from "react-router";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { TrainingRequest, SessionRequest } from "~/features/training/@types";

const trainingIDstr = ":TrainingID";
const CatagoryIDStr = ":CategoryID";
const SubCatagoryIDStr = ":SubCategoryID";
const StartDateStr = ":StartDate";
const EndDateStr = ":EndDate";

export const TrainingsApi = api.injectEndpoints({
	endpoints: builder => ({
		createTraining: builder.mutation<any, TrainingRequest>({
			query: payload => ({
				url: endPoints.trainings.training.create,
				method: "POST",
				body: payload
			})
		}),
		getTrainingByTrainingId: builder.query({
			query: ({ Id }) => ({
				url: endPoints.trainings.training.getTrainingByTrainingId.replace(trainingIDstr, Id),
				method: "GET"
			})
		}),
		updateTraining: builder.mutation<any, TrainingRequest>({
			query: data => ({
				url: endPoints.trainings.training.update,
				method: "POST",
				body: data
			})
		}),
		deleteTraining: builder.mutation({
			query: ({ Id }) => ({
				url: endPoints.trainings.training.delete.replace(trainingIDstr, Id),
				method: "POST"
			})
		}),
		getTrainingSessions: builder.query({
			query: ({ Id }) => ({
				url: endPoints.trainings.training.trainingSession.replace(trainingIDstr, Id)
			})
		}),
		createSession: builder.mutation<any, SessionRequest>({
			query: data => ({
				url: endPoints.trainings.session.create,
				method: "POST",
				body: data
			})
		}),
		getSessionBySessionId: builder.query({
			query: ({ Id }) => ({
				url: endPoints.trainings.session.getSessionBySessionId.replace(":SessionID", Id),
				method: "GET"
			})
		}),
		updateSession: builder.mutation<any, SessionRequest>({
			query: data => ({
				url: endPoints.trainings.session.update,
				method: "POST",
				body: data
			})
		}),
		deleteSession: builder.mutation({
			query: data => ({
				url: endPoints.trainings.session.delete,
				method: "POST",
				body: {
					TrainingSessionID: data.TrainingSessionID,
					MeetingID: data.MeetingID,
					EventID: data.EventID
				}
			})
		}),
		getSessionAttendanceReport: builder.mutation({
			query: ({ Id }) => ({
				url: endPoints.trainings.session.AttendanceReport.replace(":MeetingID", Id)
			})
		}),
		getAllTrainings: builder.query({
			query: ({ PageNumber, PageSize, SearchTextInTitle, Status }) => ({
				url: endPoints.trainings.training.history
					.replace(":PageNumber", PageNumber)
					.replace(":PageSize", PageSize)
					.replace(":status", Status)
					.concat("", SearchTextInTitle.length !== 0 ? `?filter=${SearchTextInTitle}` : "")
			})
		}),
		getPlatforms: builder.query({
			query: () => ({
				url: endPoints.trainings.Platforms
			})
		}),
		getSessionsByDate: builder.mutation({
			query: date => ({
				url: endPoints.trainings.Calendar.replace(":Date", date)
			})
		}),
		getCategories: builder.query<any, void>({
			query: () => ({ url: generatePath(endPoints.common.categories, { categoryId: -1 }) })
		}),
		getSubCategoriesList: builder.query({
			query: CategoryID => ({
				url: endPoints.Common.SubCategoriesBasedOnCategoryID.replace(CatagoryIDStr, CategoryID)
			})
		}),
		getCourseTitles: builder.query({
			query: ({ CategoryID, SubCategoryID }) => ({
				url: endPoints.Common.CourseTitles.replace(CatagoryIDStr, CategoryID).replace(
					SubCatagoryIDStr,
					SubCategoryID
				)
			})
		}),
		ValidateUser: builder.mutation({
			query: payload => ({
				url: endPoints.trainings.training.validate,
				method: "POST",
				body: payload
			})
		}),
		getTrainingReports: builder.query({
			query: ({ StartDate, EndDate, PageNumber, PageSize }) => ({
				url: endPoints.trainings.training.TrainingReports.replace(":StartDate", StartDate)
					.replace(":EndDate", EndDate)
					.replace(":PageNumber", PageNumber)
					.replace(":PageSize", PageSize)
			})
		}),
		PendingFeedBackSessionsList: builder.query({
			query: UserID => ({
				url: endPoints.trainings.training.PendingFeedBackSessionsList.replace(":UserID", UserID)
			})
		}),
		FeedbackForASession: builder.query({
			query: ({ UserID, Sessionid }) => ({
				url: endPoints.trainings.training.FeedbackForASession.replace(":UserID", UserID).replace(
					":Sessionid",
					Sessionid
				)
			})
		}),
		PendingFeedBacks: builder.query({
			query: UserID => ({
				url: endPoints.trainings.training.PendingFeedBacks.replace(":UserID", UserID)
			})
		}),
		TrainingFeedbackQuestions: builder.query({
			query: () => ({
				url: endPoints.trainings.training.TrainingFeedbackQuestions
			})
		}),
		SaveTrainingFeedback: builder.mutation({
			query: payload => ({
				url: endPoints.trainings.training.SaveTrainingFeedback,
				method: "POST",
				body: payload
			})
		}),
		SessionUserReports: builder.query({
			query: ({ StartDate, EndDate }) => ({
				url: endPoints.trainings.training.SessionUserReports.replace(StartDateStr, StartDate).replace(
					EndDateStr,
					EndDate
				)
			})
		}),
		FeedbackSessionReport: builder.query({
			query: ({ StartDate, EndDate }) => ({
				url: endPoints.trainings.training.FeedbackSessionReport.replace(StartDateStr, StartDate).replace(
					EndDateStr,
					EndDate
				)
			})
		}),
		FeedbackUsersReport: builder.query({
			query: ({ StartDate, EndDate }) => ({
				url: endPoints.trainings.training.FeedbackUsersReport.replace(StartDateStr, StartDate).replace(
					EndDateStr,
					EndDate
				)
			})
		})
	})
});

export const {
	useCreateTrainingMutation,
	useUpdateTrainingMutation,
	useDeleteTrainingMutation,
	useCreateSessionMutation,
	useUpdateSessionMutation,
	useDeleteSessionMutation,
	useGetAllTrainingsQuery,
	useGetTrainingSessionsQuery,
	useGetPlatformsQuery,
	useGetSessionAttendanceReportMutation,
	useGetSessionBySessionIdQuery,
	useGetTrainingByTrainingIdQuery,
	useGetSessionsByDateMutation,
	useGetCategoriesQuery,
	useGetSubCategoriesListQuery,
	useGetCourseTitlesQuery,
	useValidateUserMutation,
	useGetTrainingReportsQuery,
	usePendingFeedBackSessionsListQuery,
	useFeedbackForASessionQuery,
	usePendingFeedBacksQuery,
	useTrainingFeedbackQuestionsQuery,
	useSaveTrainingFeedbackMutation,
	useSessionUserReportsQuery,
	useFeedbackSessionReportQuery,
	useFeedbackUsersReportQuery
} = TrainingsApi;
