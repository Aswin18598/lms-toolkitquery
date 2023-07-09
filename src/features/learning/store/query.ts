import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

const CatagoryIDStr = ":CategoryID";
const subCatagoryIDStr = ":SubCategoryID";
const SearchTextStr = ":SearchText";
const PageNumberSrt = ":PageNumber";

export const learningApi = api.enhanceEndpoints({ addTagTypes: ["comments"] }).injectEndpoints({
	endpoints: builder => ({
		getMasterCourseCategories: builder.query({
			query: () => ({
				url: endPoints.learning.courseCatalog.MasterCourseCategories
			})
		}),
		getFilterCourses: builder.query({
			query: ({ TopicID, CatagoryID, SubCategoryID, SkillLevelID, Rating, SearchText, PageNumber, PageSize }) => {
				const { UserId } = getLoggedUser();

				return {
					url: endPoints.learning.courseCatalog.FilterCourses.replace(":TopicID", TopicID)
						.replace(":IsB2B", `${checkIsB2B()}`)
						.replace(":UserId", UserId)
						.replace(":CatagoryID", CatagoryID)
						.replace(subCatagoryIDStr, SubCategoryID)
						.replace(":SkillLevelID", SkillLevelID)
						.replace(":Rating", Rating)
						.replace(SearchTextStr, SearchText)
						.replace(PageNumberSrt, PageNumber)
						.replace(":PageSize", PageSize)
				};
			}
		}),
		getFilterCoursesInitial: builder.query({
			query: ({ TopicID, CatagoryID, SubCategoryID, SkillLevelID, Rating, SearchText, PageNumber, PageSize }) => {
				const { UserId } = getLoggedUser();
				return {
					url: endPoints.learning.courseCatalog.FilterCourses.replace(":TopicID", TopicID)
						.replace(":IsB2B", `${checkIsB2B()}`)
						.replace(":UserId", UserId)
						.replace(":CatagoryID", CatagoryID)
						.replace(subCatagoryIDStr, SubCategoryID)
						.replace(":SkillLevelID", SkillLevelID)
						.replace(":Rating", Rating)
						.replace(SearchTextStr, SearchText)
						.replace(PageNumberSrt, PageNumber)
						.replace(":PageSize", PageSize)
				};
			}
		}),
		getCourseProperties: builder.query({
			query: ({ UserID, CourseID }) => ({
				url: endPoints.learning.courseCatalog.CourseProperties.replace(":UserID", UserID).replace(
					":CourseID",
					CourseID
				)
			})
		}),
		getAssessmentProperties: builder.query({
			query: ({ UserID, AssessmentID }) => ({
				url: endPoints.learning.courseCatalog.AssessmentProperties.replace(":UserID", UserID).replace(
					":AssessmentID",
					AssessmentID
				)
			})
		}),
		getCourseTableOfContent: builder.query({
			query: ({ UserID, CourseID, Percentage }) => ({
				url: endPoints.learning.courseCatalog.CourseTableOfContent.replace(":UserID", UserID)
					.replace(":CourseID", CourseID)
					.replace(":Percentage", Percentage)
			})
		}),
		getFilterAssesments: builder.query({
			query: ({ SubcategoryID, CategoryID, PageNumber, PageSize, SearchText }) => {
				const { UserId } = getLoggedUser();
				return {
					url: endPoints.learning.courseCatalog.FilterAssesments.replace(subCatagoryIDStr, SubcategoryID)
						.replace(":IsB2B", `${checkIsB2B()}`)
						.replace(":UserId", UserId)
						.replace(CatagoryIDStr, CategoryID)
						.replace(PageNumberSrt, PageNumber)
						.replace(":PageSize", PageSize)
						.replace(SearchTextStr, SearchText)
				};
			}
		}),
		getFilterAssesmentsInitial: builder.query({
			query: ({ SubcategoryID, CategoryID, PageNumber, PageSize, SearchText }) => {
				const { UserId } = getLoggedUser();
				return {
					url: endPoints.learning.courseCatalog.FilterAssesments.replace(subCatagoryIDStr, SubcategoryID)
						.replace(":IsB2B", `${checkIsB2B()}`)
						.replace(":UserId", UserId)
						.replace(CatagoryIDStr, CategoryID)
						.replace(PageNumberSrt, PageNumber)
						.replace(":PageSize", PageSize)
						.replace(SearchTextStr, SearchText)
				};
			}
		}),
		getUserHistoryGridData: builder.query({
			query: ({ UserID, PageNumber, PageSize }) => ({
				url: endPoints.learning.myLearning.UserHistoryGridData.replace(":UserID", UserID)
					.replace(PageNumberSrt, PageNumber) // eslint-disable-line sonarjs/no-duplicate-string
					.replace(":PageSize", PageSize)
			})
		}),
		getMyLearningGridData: builder.query({
			query: ({
				UserID,
				PageNumber,
				PageSize,
				ItemType,
				Favorites,
				CategoryID,
				SubCategoryID,
				Status,
				SearchText
			}) => ({
				url: endPoints.learning.myLearning.MyLearningGridData.replace(":UserID", UserID)
					.replace(PageNumberSrt, PageNumber)
					.replace(":PageSize", PageSize)
					.replace(":ItemType", ItemType)
					.replace(":Favorites", Favorites)
					.replace(CatagoryIDStr, CategoryID)
					.replace(subCatagoryIDStr, SubCategoryID)
					.replace(":Status", Status)
					.concat("", SearchText.length !== 0 ? `&SearchText=${SearchText}` : "")
			})
		}),
		getAddFavoriteItem: builder.mutation({
			query: ({ UserID, ItemID, Type }) => ({
				url: endPoints.learning.myLearning.AddFavoriteItem,
				method: "PUT",
				body: {
					UserID: UserID,
					ItemID: ItemID,
					Type: Type
				}
			})
		}),
		getRemoveFavoriteItem: builder.mutation({
			query: ({ UserID, ItemID, Type }) => ({
				url: endPoints.learning.myLearning.RemoveFavoriteItem,
				method: "PUT",
				body: {
					UserID: UserID,
					ItemID: ItemID,
					Type: Type
				}
			})
		}),
		getCategoryList: builder.query({
			query: UserID => ({
				url: endPoints.quickstarts.categories.replace(":UserID", UserID).replace(":Type", "1")
			})
		}),
		getSubCategoryList: builder.query({
			query: ({ UserID, CategoryID }) => ({
				url: endPoints.quickstarts.subCategories
					.replace(":UserID", UserID)
					.replace(CatagoryIDStr, CategoryID)
					.replace(":Type", "1")
			})
		}),
		getTopicList: builder.query({
			query: SubCategoryID => ({
				url: endPoints.techtips.filterTopic.replace(subCatagoryIDStr, SubCategoryID)
			})
		}),
		getCategoriesList: builder.query({
			query: () => ({
				url: endPoints.Common.Categories
			})
		}),
		getSubCategoriesList: builder.query({
			query: CategoryID => ({
				url: endPoints.Common.SubCategoriesBasedOnCategoryID.replace(CatagoryIDStr, CategoryID)
			})
		}),
		getTopicsList: builder.query({
			query: CategoryID => ({
				url: endPoints.Common.TopicsBasedOnCategoryID.replace(CatagoryIDStr, CategoryID)
			})
		}),
		getMyLearningPath: builder.query({
			query: ({ UserID, PageNumber, PageSize, Status, SearchText }) => ({
				url: endPoints.learning.myLearning.LearningPath.replace(":UserID", UserID)
					.replace(PageNumberSrt, PageNumber)
					.replace(":PageSize", PageSize)
					.replace(":Status", Status)
					.concat("", SearchText.length !== 0 ? `&SearchText=${SearchText}` : "")
			})
		}),
		getCertificateInfo: builder.query({
			query: ({ UserID, EventID, ItemID, IDType, Mode }) => ({
				url: endPoints.learning.courseCatalog.CertificateInfo.replace(":UserID", UserID)
					.replace(":EventID", EventID)
					.replace(":ItemID", ItemID)
					.replace(":IDType", IDType)
					.replace(":Mode", Mode)
			})
		}),
		getCourseForum: builder.query({
			query: ({ CourseID, SearchType, SearchText, ResponseFilter, PageSize }) => ({
				url: generatePath(endPoints.Forums.CourseForum, {
					CourseID: CourseID,
					SearchType: SearchType,
					ResponseFilter: ResponseFilter,
					PageSize: PageSize
				}).concat("", SearchText.length !== 0 ? `&SearchText=${SearchText}` : "")
			}),
			providesTags: ["comments"]
		}),
		getCreatePosting: builder.mutation({
			query: formData => ({
				url: endPoints.Forums.CreatePosting,
				method: "POST",
				body: formData
			})
		}),
		getUpdatePosting: builder.mutation({
			query: formData => ({
				url: endPoints.Forums.UpdatePosting,
				method: "POST",
				body: formData
			})
		}),
		getDeletePosting: builder.mutation({
			query: PostID => ({
				url: endPoints.Forums.DeletePosting,
				method: "POST",
				body: {
					PostID: PostID
				}
			})
		}),
		getCreateReply: builder.mutation({
			query: formData => ({
				url: endPoints.Forums.CreateReply,
				method: "POST",
				body: formData
			})
		}),
		getUpdateReply: builder.mutation({
			query: formData => ({
				url: endPoints.Forums.UpdateReply,
				method: "POST",
				body: formData
			})
		}),
		getDeleteReply: builder.mutation({
			query: ReplyID => ({
				url: endPoints.Forums.DeleteReply,
				method: "POST",
				body: {
					ReplyID: ReplyID
				}
			})
		}),
		getHideReply: builder.mutation({
			query: ({ ReplyID, Status }) => ({
				url: endPoints.Forums.HideReply,
				method: "POST",
				body: {
					ReplyID: ReplyID,
					Status: Status
				}
			})
		}),
		getDownload: builder.mutation({
			query: FileName => ({
				url: endPoints.Forums.Download,
				method: "POST",
				body: {
					FileName: FileName
				}
			})
		}),
		RemoveDiscussionFiles: builder.mutation<any, { Type: string; ID: number; FileName: string }>({
			query: body => ({
				url: endPoints.Forums.RemoveFiles,
				method: "POST",
				body: {
					...body
				}
			}),
			invalidatesTags: ["comments"]
		}),
		AddEditAggregationEvent: builder.mutation({
			query: Payload => ({
				url: endPoints.learning.myLearning.AddEditAggregationEvent,
				method: "POST",
				body: {
					...Payload
				}
			})
		})
	})
});

export const {
	useGetMasterCourseCategoriesQuery,
	useGetFilterCoursesQuery,
	useGetFilterCoursesInitialQuery,
	useGetCoursePropertiesQuery,
	useGetAssessmentPropertiesQuery,
	useGetCourseTableOfContentQuery,
	useGetFilterAssesmentsQuery,
	useGetFilterAssesmentsInitialQuery,
	useGetUserHistoryGridDataQuery,
	useGetMyLearningGridDataQuery,
	useGetAddFavoriteItemMutation,
	useGetRemoveFavoriteItemMutation,
	useGetCategoryListQuery,
	useGetSubCategoryListQuery,
	useGetTopicListQuery,
	useGetCategoriesListQuery,
	useGetSubCategoriesListQuery,
	useGetTopicsListQuery,
	useGetMyLearningPathQuery,
	useGetCertificateInfoQuery,
	useGetCourseForumQuery,
	useGetCreatePostingMutation,
	useGetUpdatePostingMutation,
	useGetDeletePostingMutation,
	useGetCreateReplyMutation,
	useGetUpdateReplyMutation,
	useGetDeleteReplyMutation,
	useGetHideReplyMutation,
	useGetDownloadMutation,
	useRemoveDiscussionFilesMutation,
	useAddEditAggregationEventMutation
} = learningApi;
