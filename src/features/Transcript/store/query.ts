import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const TranscriptApi = api.injectEndpoints({
	endpoints: builder => ({
		getTranscriptUserDetails: builder.query({
			query: UserID => ({
				url: endPoints.Transcript.TranscriptUserDetails.replace(":UserID", UserID)
			})
		}),
		getTranscriptCourseHistory: builder.query({
			query: ({ UserID, CategoryID, PageNumber, PageSize }) => ({
				url: endPoints.Transcript.TranscriptCourseHistory.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":PageNumber", PageNumber)
					.replace(":PageSize", PageSize)
			})
		}),
		getTranscriptAssessmentHistory: builder.query({
			query: ({ UserID, CategoryID, PageNumber, PageSize }) => ({
				url: endPoints.Transcript.TranscriptAssessmentHistory.replace(":UserID", UserID)
					.replace(":CategoryID", CategoryID)
					.replace(":PageNumber", PageNumber)
					.replace(":PageSize", PageSize)
			})
		}),
		getTranscriptUser: builder.query({
			query: UserID => ({
				url: endPoints.Transcript.TranscriptUser.replace(":UserID", UserID)
			})
		})
	})
});

export const {
	useGetTranscriptUserDetailsQuery,
	useGetTranscriptAssessmentHistoryQuery,
	useGetTranscriptCourseHistoryQuery,
	useGetTranscriptUserQuery
} = TranscriptApi;
