import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";
import {
	IAddLPNotificationBody,
	IAddLPNotificationResponse,
	IAssessmentsForLearningPath,
	IAssignedAggregationsForLearningPath,
	IAssignedGroupsForLearningPath,
	IAssignedUsersForLearningPath,
	IAssignGroupToLearningPathBody,
	IAssignGroupToLearningPathResponse,
	IAssignUserToLearningPathBody,
	IAssignUserToLearningPathResponse,
	ICategories,
	IConditionalUsersForLearningPath,
	ICoursesForLearningPath,
	IDynamicFiedOptionsResponse,
	IGroupListsForLearningPath,
	IIntegrationsForLearningPath,
	ILearningAssignments,
	IlearningPathActionsBody,
	IlearningPathActionsResponse,
	ILearningPathIntegrationBody,
	ILearningPathIntegrationResponse,
	ILearningPathItems,
	ILPEmailNotificationBody,
	ILPEmailNotificationResponse,
	ILPItemActionBody,
	ILPItemActionResponse,
	IRemoveAggregationFromLpBody,
	IRemoveAggregationFromLpResponse,
	IRemoveGroupFromLpBody,
	IRemoveGroupFromLpResponse,
	IRemoveUserFromLpBody,
	IRemoveUserFromLpResponse,
	ISetDynamicGroupAttributeBody,
	ISetDynamicGroupAttributeResponse,
	ISubCategories,
	IUnAssignedGroupsForLearningPath,
	IUserListForLearningPath
} from "../@types";

type LearningAssignmentsResponse = ILearningAssignments[];
type LearningPathItemsResponse = ILearningPathItems[];
type SubCategoriesResponse = ISubCategories[];
type CategoriesResponse = ICategories[];
type CoursesForLearningPathResponse = ICoursesForLearningPath[];
type AssessmentsForLearningPathResponse = IAssessmentsForLearningPath[];
type IntegrationsForLearningPathResponse = IIntegrationsForLearningPath[];
type UserListForLearningPathResponse = IUserListForLearningPath[];
type GroupListsForLearningPathResponse = IGroupListsForLearningPath[];
type ConditionalUsersForLearningPathResponse = IConditionalUsersForLearningPath[];
type AssignedUsersForLearningPathResponse = IAssignedUsersForLearningPath;
type AssignedGroupsForLearningPathResponse = IAssignedGroupsForLearningPath;
type AssignedAggregationsForLearningPath = IAssignedAggregationsForLearningPath[];

export const ManagementApi = api.enhanceEndpoints({ addTagTypes: ["Integration", "User", "Group"] }).injectEndpoints({
	endpoints: builder => ({
		learningAssignmentsList: builder.query<LearningAssignmentsResponse, { PageNumber: number; PageSize: number }>({
			query: ({ PageNumber, PageSize }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.learningAssignmentList}/${
						user.UserId
					}/${0}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		preDefinedLearningPathList: builder.query<
			LearningAssignmentsResponse,
			{ PageNumber?: number; PageSize?: number; CategoryId?: number }
		>({
			query: ({ PageNumber, PageSize, CategoryId }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.preDefinedLearningPathList}/${user?.UserId}/${CategoryId}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		learningPathItems: builder.query<LearningPathItemsResponse, { PathID?: number; GroupID?: number }>({
			query: ({ PathID = 1820, GroupID = 0 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.learningPathItems}/${user?.UserId}/${PathID}/${GroupID}`
				};
			}
		}),
		//assignedcourses&assessments tab
		assignedCoursesAndAssessments: builder.query<
			LearningPathItemsResponse,
			{ PathID?: number; GroupID?: number; PageNumber?: number; PageSize?: number }
		>({
			query: ({ PathID = 1820, GroupID = 0, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.assignedCoursesAndAssessments}/${user?.UserId}/${PathID}/${GroupID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),

		// for predefined-learning path dropdown
		subCategoriesList: builder.query<SubCategoriesResponse, { Type?: number }>({
			query: ({ Type = 22 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.preDefinedSubCategories}/${user?.UserId}/${Type}`
				};
			}
		}),
		categoriesList: builder.query<CategoriesResponse, { Type?: number }>({
			query: ({ Type = 1 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.categories}/${user?.UserId}/${Type}`
				};
			}
		}),
		subCategories: builder.query<SubCategoriesResponse, { Type?: number; CategoryID?: string | number }>({
			query: ({ Type = 1, CategoryID = 0 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.subCategories}/${user?.UserId}/${CategoryID}/${Type}`
				};
			}
		}),
		// learning Assignments courseTab coursesForLearningPath
		coursesForLearningPath: builder.query<
			CoursesForLearningPathResponse,
			{
				SubcategoryID?: number | string;
				CategoryID?: number;
				PageNumber?: number;
				PageSize?: number;
			}
		>({
			query: ({ SubcategoryID = 0, CategoryID = 0, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.coursesForLearningPath}/${user.AccountId}/${SubcategoryID}/${CategoryID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		assessmentsForLearningPath: builder.query<
			AssessmentsForLearningPathResponse,
			{
				SubcategoryID?: number | string;
				CategoryID?: number;
				PageNumber?: number;
				PageSize?: number;
			}
		>({
			query: ({ SubcategoryID = 0, CategoryID = 0, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.assessmentsForLearningPath}/${user?.AccountId}/${SubcategoryID}/${CategoryID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		// learning Assignments integrationTab
		integrationsForLearningPath: builder.query<
			IntegrationsForLearningPathResponse,
			{ PageNumber?: number; PageSize?: number }
		>({
			query: ({ PageNumber = 1, PageSize = 10 }) => {
				return {
					url: `${endPoints.account.management.assignedLearning.integrationsForLearningPath}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			},
			providesTags: ["Integration"]
		}),
		// learning Assignments UsersTab
		userListForLearningPath: builder.query<
			UserListForLearningPathResponse,
			{ GroupID?: number; PageNumber?: number; PageSize?: number; searchText?: string }
		>({
			query: ({ GroupID = 0, PageNumber = 1, PageSize = 10, searchText = "" }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.userListForLearningPath}/${
						user?.UserId
					}/${GroupID}?PageNumber=${PageNumber}&PageSize=${PageSize}${
						searchText.trimStart().length ? `&SearchEmail=${searchText}` : ""
					}`
				};
			}
		}),
		// learning Assignments GroupsTab filter dropdown
		groupListForLearningPath: builder.query<
			GroupListsForLearningPathResponse,
			{ ShowAll?: boolean; PageNumber?: number; PageSize?: number }
		>({
			query: ({ ShowAll = true, PageNumber = 1, PageSize = 0 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.groupListForLearningPath}/${user?.UserId}/${ShowAll}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		// learning Assignments ConditionalTab
		conditionalUsersForLearningPath: builder.query<ConditionalUsersForLearningPathResponse, { PathID?: number }>({
			query: ({ PathID = 4946 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.conditionalUsersForLearningPath}/${user?.UserId}/${PathID}`
				};
			}
		}),
		// learning Assignments AssignedTabcontent UsersTab
		assignedUsersForLearningPath: builder.query<
			AssignedUsersForLearningPathResponse,
			{ PathID?: number; PageNumber?: number; PageSize?: number }
		>({
			query: ({ PathID = 1820, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.assignedUsersForLearningPath}/${PathID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		// learning Assignments AssignedTabcontent groupsTab
		assignedGroupForLearningPath: builder.query<
			AssignedGroupsForLearningPathResponse,
			{ PathID?: number; PageNumber?: number; PageSize?: number }
		>({
			query: ({ PathID = 4240, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.assignedGroupsForLearningPath}/${user?.UserId}/${PathID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			},
			providesTags: ["Group"]
		}),
		// learning Assignments AssignableTabcontent groupsTab
		unAssignedGroupsForLearningPath: builder.query<
			IUnAssignedGroupsForLearningPath,
			{ PathID?: number; PageNumber?: number; PageSize?: number }
		>({
			query: ({ PathID, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.unAssignedGroupsForLearningPath}/${user?.UserId}/${PathID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		// learning Assignments AssignedTabcontent aggregationsTab
		assignedAggregationsForLearningPath: builder.query<
			AssignedAggregationsForLearningPath,
			{ PathID?: number; PageNumber?: number; PageSize?: number }
		>({
			query: ({ PathID = 4240, PageNumber = 1, PageSize = 10 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.assignedAggregationsForLearningPath}/${user?.UserId}/${PathID}?PageNumber=${PageNumber}&PageSize=${PageSize}`
				};
			}
		}),
		//  integrationTab content source dropdown
		dynamicFieldOptions: builder.query<IDynamicFiedOptionsResponse, { FieldID?: number }>({
			query: ({ FieldID = 8 }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.dynamicFieldOptions}/${user?.UserId}/${FieldID}`
				};
			}
		}),
		//  conditionalTab content userRole dropdown
		dynamicGroupInfoLp: builder.query<any, { PathID?: number }>({
			query: ({ PathID }) => {
				return {
					url: `${endPoints.account.management.assignedLearning.dynamicGroupInfoLp}/${PathID}`
				};
			}
		}),
		//  conditionalTab content dynamicFieldOptions dropdown
		conditionalUsersDynamicFieldOptions: builder.query<IDynamicFiedOptionsResponse, { FieldID?: number }>({
			query: ({ FieldID }) => {
				const user = getLoggedUser();
				return {
					url: `${endPoints.account.management.assignedLearning.dynamicFieldOptions}/${user?.UserId}/${FieldID}`
				};
			}
		}),
		//POST METHOD
		assignUserToLearningPath: builder.mutation<IAssignUserToLearningPathResponse, IAssignUserToLearningPathBody>({
			query: ({ UserID, PathID = 0 }) => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.assignUserToLearningPath,
					method: "POST",
					body: { UserID, AccountID: user.AccountId, PathID }
				};
			}
		}),
		setDynamicGroupAttribute: builder.mutation<ISetDynamicGroupAttributeResponse, ISetDynamicGroupAttributeBody>({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.setDynamicGroupAttribute,
					method: "POST",
					body: { ...body }
				};
			}
		}),
		learningPathItemAction: builder.mutation<ILPItemActionResponse, ILPItemActionBody>({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.learningPathItemAction,
					method: "POST",
					body: { ...body, UserID: user?.UserId }
				};
			}
		}),
		learningPathActionsInput: builder.mutation<IlearningPathActionsResponse, IlearningPathActionsBody>({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.learningPathActionsInput,
					method: "POST",
					body: { UserID: user?.UserId, AccountID: user?.AccountId, ...body }
				};
			}
		}),
		learningPathIntegrationAction: builder.mutation<ILearningPathIntegrationResponse, ILearningPathIntegrationBody>(
			{
				query: body => {
					const user = getLoggedUser();
					return {
						url: endPoints.account.management.assignedLearning.learningPathIntegrationAction,
						method: "POST",
						body: { ...body, UserID: user?.UserId }
					};
				}
			}
		),
		assignGroupToLearningPath: builder.mutation<IAssignGroupToLearningPathResponse, IAssignGroupToLearningPathBody>(
			{
				query: ({ GroupID = 0, PathID = 0 }) => {
					return {
						url: endPoints.account.management.assignedLearning.assignGroupToLearningPath,
						method: "POST",
						body: { GroupID, PathID }
					};
				},
				invalidatesTags: ["Group"]
			}
		),
		addLPNotification: builder.mutation<IAddLPNotificationResponse, IAddLPNotificationBody>({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.addLPNotification,
					method: "POST",
					body: { ...body, UserID: user?.UserId }
				};
			}
		}),
		lPEmailNotification: builder.mutation<ILPEmailNotificationResponse, ILPEmailNotificationBody>({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.lPEmailNotification,
					method: "POST",
					body: { ...body, UserID: +user?.UserId }
				};
			}
		}),
		removeGroupFromLp: builder.mutation<IRemoveGroupFromLpResponse, IRemoveGroupFromLpBody>({
			query: ({ GroupID = 0, PathID = 0 }) => {
				return {
					url: endPoints.account.management.assignedLearning.removeGroupFromLp,
					method: "DELETE",
					body: { GroupID, PathID }
				};
			},
			invalidatesTags: ["Group"]
		}),
		removeUserFromLp: builder.mutation<IRemoveUserFromLpResponse, IRemoveUserFromLpBody>({
			query: ({ PathID = 0, UserID }) => {
				const user = getLoggedUser();
				return {
					url: endPoints.account.management.assignedLearning.removeUserFromLp,
					method: "DELETE",
					body: { UserID, PathID }
				};
			}
		}),
		removeAggregationFromLP: builder.mutation<IRemoveAggregationFromLpResponse, IRemoveAggregationFromLpBody>({
			query: ({ AggregationID = 0, PathID = 0 }) => {
				return {
					url: endPoints.account.management.assignedLearning.removeAggregationFromLP,
					method: "DELETE",
					body: { AggregationID, PathID }
				};
			}
		})
	})
});
export const {
	useLearningAssignmentsListQuery,
	usePreDefinedLearningPathListQuery,
	useLazyLearningPathItemsQuery,
	useAssignedCoursesAndAssessmentsQuery,
	useLazyAssignedCoursesAndAssessmentsQuery,
	useSubCategoriesListQuery,
	useCategoriesListQuery,
	useSubCategoriesQuery,
	useLazyCoursesForLearningPathQuery,
	useCoursesForLearningPathQuery,
	useAssessmentsForLearningPathQuery,
	useIntegrationsForLearningPathQuery,
	useLazyUserListForLearningPathQuery,
	useDynamicFieldOptionsQuery,
	useDynamicGroupInfoLpQuery,
	useLazyConditionalUsersDynamicFieldOptionsQuery,
	useGroupListForLearningPathQuery,
	useAssignedUsersForLearningPathQuery,
	useUnAssignedGroupsForLearningPathQuery,
	useAssignedGroupForLearningPathQuery,
	useAssignedAggregationsForLearningPathQuery,
	useConditionalUsersForLearningPathQuery,
	useAssignUserToLearningPathMutation,
	useSetDynamicGroupAttributeMutation,
	useAssignGroupToLearningPathMutation,
	useLearningPathIntegrationActionMutation,
	useAddLPNotificationMutation,
	useLPEmailNotificationMutation,
	useRemoveGroupFromLpMutation,
	useRemoveUserFromLpMutation,
	useRemoveAggregationFromLPMutation,
	useLearningPathItemActionMutation,
	useLearningPathActionsInputMutation
} = ManagementApi;
