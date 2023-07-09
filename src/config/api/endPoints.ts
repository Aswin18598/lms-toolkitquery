export const endPoints = {
	baseUrl: import.meta.env.VITE_API_URL,
	common: {
		menu: "learner/api/HeadersAndMenu/MenuItems",
		points: "learner/api/HeadersAndMenu/Points",
		nofitication: "learner/api/HeadersAndMenu/AllUserNotifications",
		subscription: "learner/api/Subscriptions/Subscriptions",
		countryList: "learner/api/Cart/Countries",
		stateList: "learner/api/UserProfile/StateList/:regionId",
		UpdateAddress: "learner/api/User/UpdateAddress",
		categories: "learner/api/Common/Categories/:categoryId",
		subCategories: "learner/api/Common/SubCategoriesBasedOnCategoryID/:categoryID",
		categoriesTopics: "learner/api/Common/TopicsBasedOnCategoryID/:categoryID",
		location: "learner/api/User/Location"
	},
	auth: {
		login: "learner/api/User/UserAuthentication",
		forgotPassword: "learner/api/User/ForgotPassword",
		sendOtp: "learner/api/User/SendOTP",
		verifyOtp: "learner/api/User/VerifyOTP",
		verifyEmailLink: "learner/api/User/VerifyEmailLink",
		ssoRequest: "learner/api/User/SSORequest",
		SSORequestByAccountID: "learner/api/User/SSORequestByAccountID",
		TokenValidation: "learner/api/User/TokenValidation",
		socialLogin: "learner/api/User/SocialValidation",
		linkedInLogin: "learner/api/User/LinkedinValidation",
		logout: "learner/api/User/UserLogout"
	},
	account: {
		create: "learner/api/User/UserRegistration",
		resetPassword: "learner/api/User/UpdatePassword",
		profile: {
			get: "learner/api/UserProfile/:pageName/:userID",
			update: "learner/api/UserProfile/:pageName"
		},
		businessManager: "learner/api/UserProfile/BusinessManager/:userID",
		IndustryInfo: "learner/api/UserProfile/IndustryInfo",
		cadApplicationList: "learner/api/UserProfile/CadApplicationList",
		updatePassword: "learner/api/User/ChangePassword",
		userGroups: "learner/api/UserProfile/UserGroups/:UserId",
		management: {
			roles: {
				list: "learner/api/Roles/RolesListData/:UserId",
				createOrUpdate: "learner/api/Roles/AddEditRole",
				get: "learner/api/Roles/RolesListData/:RoleId",
				delete: "learner/api/Roles/DeleteRole",
				addPublicRole: "learner/api/Roles/AddPublicRoles",
				getRoleSkillMapping: "learner/api/RolesStructure/UserRoleCompetencyMap/:UserId",
				addOrEditRoleSkillMapping: "learner/api/RolesStructure/AddEditUserRoleCompetencyMap",
				roleLearningPath: "learner/api/RolesStructure/RoleStructureLearningPath/:UserId"
			},
			competency: {
				list: "learner/api/Competency/CompetencyListData/:UserId",
				levelList: "learner/api/Competency/CompetencyLevelList/:UserId",
				createOrUpdate: "learner/api/Competency/AddEditCompetency",
				get: "learner/api/Competency/CompetencyDetails/:competencyId",
				delete: "learner/api/Competency/DeleteCompetency",
				type: "learner/api/Competency/CompetencyType/:UserId"
			},
			assignedLearning: {
				learningAssignmentList: "learner/api/AssignedLearning/LearningAssignments", //send /{UserId}/{ShowPredefined}
				preDefinedLearningPathList: "learner/api/AssignedLearning/PredefinedLearningPaths", //send /{UserId}/{categoryId}
				learningPathItems: "learner/api/AssignedLearning/LearningPathItems", //send /{UserId}/{PathID}/{GroupID}
				assignedCoursesAndAssessments: "learner/api/AssignedLearning/AssignedCoursesAndAssessments",
				preDefinedSubCategories: "learner/api/AssignedLearning/SubCategories", //send /{UserID}/{Type}
				categories: "learner/api/AssignedLearning/Categories", //send /{UserID}/{Type}
				subCategories: "learner/api/AssignedLearning/SubCategories", //send /{UserID}/{CategoryID}/{Type}
				coursesForLearningPath: "learner/api/AssignedLearning/CoursesForLearningPath", //send /${AccountID}/${SubcategoryID}/${CategoryID}
				assessmentsForLearningPath: "learner/api/AssignedLearning/AssessmentsForLearningPath", //send /${AccountID}/${SubcategoryID}/${CategoryID}
				integrationsForLearningPath: "learner/api/AssignedLearning/IntegrationsForLearningPath", // send nothing
				userListForLearningPath: "learner/api/AssignedLearning/UserListByManager", // send /${UserID}/${GroupID}
				groupListForLearningPath: "learner/api/AssignedLearning/GroupListByManager", // send /${UserID}/${ShowAll}
				conditionalUsersForLearningPath: "learner/api/AssignedLearning/ConditionalUsersForLearningPath", // send /${UserID}/${PathID}
				assignedUsersForLearningPath: "learner/api/AssignedLearning/AssignedUsersForLearningPath", // send /${UserID}/${PathID}
				unAssignedGroupsForLearningPath: "learner/api/AssignedLearning/UnAssignedGroupByPathID", // send /${UserID}/${PathID}
				assignedGroupsForLearningPath: "learner/api/AssignedLearning/AssignedGroupByPathID", // send /${UserID}/${PathID}
				assignedAggregationsForLearningPath: "learner/api/AssignedLearning/LPAssignedAggregations", // send /${UserID}/${PathID}
				dynamicGroupInfoLp: "learner/api/AssignedLearning/DynamicGroupInfoLP", // send /${PathID}
				dynamicFieldOptions: "learner/api/AssignedLearning/DynamicFieldOptions", // send /${UserID}/${FieldId} fieldId=8 for integrationTabContent
				// POST METHOD
				assignUserToLearningPath: "learner/api/AssignedLearning/AssignUserToLearningPath", //1 send UserID,AccountID,PathID in body
				setDynamicGroupAttribute: "learner/api/AssignedLearning/SetDynamicGroupAttribute", //2 send PathID,FieldID,Filter,ConditionID,MainCondID,AttrID in body
				learningPathItemAction: "learner/api/AssignedLearning/LPItemAction", //3 send UserID,Action,PathID,ItemID,ItemType,DueDate,StartDate,ItemSequence in body
				learningPathActionsInput: "learner/api/AssignedLearning/LearningPathActionsInput", //4 send Name,UserID,AccountID,Action,PathID,ForceOrder,Description,SubCategory,Filters,TypeID in body
				learningPathIntegrationAction: "learner/api/AssignedLearning/LPIntegrationsAction", //5 send UserID,AccountID in body
				assignGroupToLearningPath: "learner/api/AssignedLearning/AssignGroupToLP", //6 send GroupID,PathID in body
				addLPNotification: "learner/api/AssignedLearning/AddLPNotification", //7 send UserID,PathID,Message,Link in body
				lPEmailNotification: "learner/api/AssignedLearning/LPEmailNotification", //8 send UserID,PathID,Message,Link in body
				// DELETE METHOD
				removeGroupFromLp: "learner/api/AssignedLearning/RemoveGroupFromLP",
				removeUserFromLp: "learner/api/AssignedLearning/RemoveUserFromLP",
				removeAggregationFromLP: "learner/api/AssignedLearning/RemoveAggregationFromLP"
			}
		},
		AdminDashboard: {
			adminDashboardDetails:
				"learner/api/AdminDashboard/AdminDashboardDetails/:AccountID?PageNumber=:PageNumber&PageSize=:PageSize",
			topCourses: "learner/api/AdminDashboard/TopCourses/:AccountID?PageNumber=:PageNumber&PageSize=:PageSize",
			topAssessments:
				"learner/api/AdminDashboard/TopAssessments/:AccountID?PageNumber=:PageNumber&PageSize=:PageSize",
			LoginMonths: "learner/api/AdminDashboard/LoginMonths/:AccountID/:GroupID",
			TopUsers: "learner/api/AdminDashboard/TopUsers/:AccountID/:Num/:GroupID",
			downloadUserReport: "learner/api/AdminDashboard/DownloadUserRepor/:AccountID",
			UserScoreCards: "learner/api/AdminDashboard/UserScoreCards/:AccountID",
			CurrentSubscription: "learner/api/AdminDashboard/CurrentSubscription/:AccountID/:PageNumber/:PageSize"
		}
	},
	author: {
		AuthorDashboard: {
			AuthorScoreCards: "learner/api/AuthorDashboard/AuthorScoreCards/:UserID/:AccountID",
			TopCourses: "learner/api/AuthorDashboard/TopCourses/:AccountID?PageNumber=:PageNumber&PageSize=:PageSize",
			TopAssessments:
				"learner/api/AuthorDashboard/TopAssessments/:AccountID?PageNumber=:PageNumber&PageSize=:PageSize",
			LoginMonths: "learner/api/AuthorDashboard/LoginMonths/:AccountID/:GroupID",
			TopUsers: "learner/api/AuthorDashboard/TopUsers/:AccountID/:Num/:GroupID",
			downloadUserReport: "learner/api/AuthorDashboard/DownloadUserRepor/:AccountID"
		},
		courseBuilder: {
			coursesCanCopy:
				"learner/api/CourseBuilder/CoursesCanCopy/:UserID/:CategoryID/:SubcategoryID/:Custom/:LastModifiedBy?PageNumber=:PageNumber&PageSize=:PageSize",
			categories: "learner/api/CourseBuilder/Categories/:UserID?:Type",
			subCategories: "learner/api/CourseBuilder/SubCategories/:UserID/:CategoryID?:Type"
		}
	},
	dashboard: {
		courseList: "learner/api/Dashboard/NewCoursesList",
		trendingSubscriptionByCode: "learner/api/Dashboard/TrendingSubscription/:currencyCode",
		catalogList: "learner/api/Dashboard/CatalogList",
		CourseListInProgress: "learner/api/Dashboard/CourseListInProgress/:userID",
		TranscriptList: "learner/api/Dashboard/TranscriptList/:userID",
		LeaderBoard: "learner/api/Dashboard/GetLeaderBoard/:userID",
		Scorecard: "learner/api/Dashboard/Scorecard/:userID",
		RecommendedCourseList: "learner/api/Dashboard/RecommendedCourseList/:userID",
		PeersCourseList: "learner/api/Dashboard/PeersCourseList/:userID",
		LearningPath: "learner/api/Dashboard/LearningPath/:userID",
		UpcomingEventsTodayList: "learner/api/Dashboard/UpcomingEventsList/:userID/t",
		UpcomingEventsWeekList: "learner/api/Dashboard/UpcomingEventsList/:userID/w",
		UpcomingEventsMonthList: "learner/api/Dashboard/UpcomingEventsList/:userID/m",
		TimeSpent: "learner/api/Dashboard/TimeSpent/:userID",
		TimeSpentGraph: "learner/api/Dashboard/TimeSpentGraph/:userID",
		PopularRoles: "learner/api/Dashboard/PopularRoles/:userID",
		PopularRolesGraph: "learner/api/Dashboard/PopularRolesGraph/:userID",
		ProfileData: "learner/api/Dashboard/ProfileData/:userID",
		HeroSectionDetails: "learner/api/Dashboard/HeroSectionDetails/:userID",
		GetLinkedinAccess: "learner/api/Dashboard/GetLinkedinAccess?UserID=:userID"
	},
	cart: {
		list: "learner/api/Cart/CartList", //:UserId added on url
		addToCart: "learner/api/Cart/AddToCart",
		removeCartItem: "learner/api/Cart/DeleteCartItem",
		shippingAddress: "learner/api/Cart/ShippingInfo/{UserID}",
		countryDropdown: "learner/api/Cart/Countries",
		plan: "learner/api/Cart/Plans/:SubscriptionID/:CourseType",
		payment: {
			applyCoupon: "learner/api/Coupons/ValidateRecurlyCoupon",
			recurly: "learner/api/Subscriptions/MultiSubscriptionRecurly",
			checkout: "learner/api/Payment/RazorpayCheckout",
			response: "learner/api/Payment/RazorpayResponse",
			CancelSubscription: "learner/api/Payment/CancelSubscription"
		},
		trialValidation: "learner/api/Cart/TrialValidation"
	},
	catalog: {
		category: "learner/api/CourseCatalog/MasterCourseCategories",
		list: "learner/api/CourseCatalog/FilterCourses/false/:UserId/:topicId/:catagoryId/:subCategoryId/:skillLevelId/:rating/:searchText",
		details: "learner/api/CourseCatalog/CommonCourseCatalogDetails/:courseId",
		curriculum: "learner/api/CourseCatalog/CourseTableOfContent/:userId/:courseId/:percentage"
	},
	learning: {
		courseCatalog: {
			MasterCourseCategories: "learner/api/CourseCatalog/MasterCourseCategories",
			FilterCourses:
				"learner/api/CourseCatalog/FilterCourses/:IsB2B/:UserId/:TopicID/:CatagoryID/:SubCategoryID/:SkillLevelID/:Rating/:SearchText?PageNumber=:PageNumber&PageSize=:PageSize",
			CourseProperties: "learner/api/CourseCatalog/CourseProperties/:UserID/:CourseID",
			AssessmentProperties: "learner/api/CourseCatalog/AssessmentProperties/:UserID/:AssessmentID",
			CourseTableOfContent: "learner/api/CourseCatalog/CourseTableOfContent/:UserID/:CourseID/:Percentage",
			FilterAssesments:
				"learner/api/CourseCatalog/Assessments/:IsB2B/:UserId/:CategoryID/:SubCategoryID?SearchText=:SearchText&PageNumber=:PageNumber&PageSize=:PageSize",
			CertificateInfo: "learner/api/Learning/CertificateInfo/:EventID/:ItemID/:UserID?IDType=:IDType&Mode=:Mode"
		},
		myLearning: {
			UserHistoryGridData:
				"learner/api/Learning/UserHistoryGridData/:UserID?PageNumber=:PageNumber&PageSize=:PageSize",
			MyLearningGridData:
				"learner/api/Learning/MyLearningGridData/:UserID?ItemType=:ItemType&Favorites=:Favorites&CategoryID=:CategoryID&SubCategoryID=:SubCategoryID&Status=:Status&PageNumber=:PageNumber&PageSize=:PageSize",
			AddFavoriteItem: "learner/api/Learning/AddFavoriteItem",
			RemoveFavoriteItem: "learner/api/Learning/RemoveFavoriteItem",
			LearningPath:
				"learner/api/Learning/LearningPath/:UserID?Status=:Status&PageNumber=:PageNumber&PageSize=:PageSize",
			AddEditAggregationEvent: "learner/api/Learning/AddEditAggregationEvent"
		}
	}, //336517
	quickstarts: {
		grid: "learner/api/QuickStart/QuickStartGrid/:UserID/:CategoryID/:SubCategoryID?PageNumber=:PageNumber",
		categories: "learner/api/QuickStart/Categories/:UserID/:Type",
		subCategories: "learner/api/QuickStart/SubCategories/:UserID/:CategoryID/:Type",
		notificationFlag: "learner/api/QuickStart/GetNotificationFlag/:UserID?Flag=NewQuickStartsRelease",
		updateNotificationFlag: "learner/api/QuickStart/UpdateNotificationFlag"
	},
	techtips: {
		topics: "learner/api/TechTips/TechTips/:UserID/:CategoryID/:SubCategoryID/:TopicID/-1/:SearchTag/-1/-1/:SearchInTitle/-1?PageNumber=:PageNumber&PageSize=:PageSize",
		filterTopic: "learner/api/TechTips/Topic/:SubCategoryID",
		filterTopicByCategory: "learner/api/TechTips/Topic/:CategoryID",
		saveUserPreference: "learner/api/TechTips/saveUserPreference",
		userPreferences: "learner/api/TechTips/UserPreferences/:UserID"
	},
	headersandmenu: {
		Favorites: "learner/api/HeadersAndMenu/Favorites/:UserID",
		Subscriptions: "learner/api/HeadersAndMenu/Subscriptions/:UserID",
		CheckTrialUser: "learner/api/HeadersAndMenu/CheckTrialUser/:UserID",
		DisMissNotification: "learner/api/HeadersAndMenu/DisMissNotification"
	},
	Subscriptions: {
		SubscriptionsDetails: "learner/api/Subscriptions/Subscriptions/:UserID",
		PurchasedHistory:
			"learner/api/Subscriptions/PurchasedHistory/:UserID?PageNumber=:PageNumber&PageSize=:PageSize",
		SubscriptionsRecurly: "learner/api/Subscriptions/recurly",
		AvailableSubscription: "learner/api/Subscriptions/AvailableSubscription/:CountryCode/:CategoryID",
		ProfessionalBundle: "learner/api/Subscriptions/wwwProfessionalBundle/:CountryCode",
		DownloadInvoice: "learner/api/Subscriptions/DownloadInvoice?SubscriptionID=:SubscriptionID",
		SubscriptionDetailView:
			"learner/api/Subscriptions/SubscriptionDetail/:SubscriptionID?UserID=:UserID&PageNumber=:PageNumber&PageSize=:PageSize",
		ReactivateSubscription: "learner/api/Subscriptions/ReactivateSubscription"
	},
	Transcript: {
		TranscriptUserDetails: "learner/api/Transcript/TranscriptUserDetails/:UserID",
		TranscriptCourseHistory:
			"learner/api/Transcript/TranscriptCourseHistory/:UserID/:CategoryID?PageNumber=:PageNumber&PageSize=:PageSize",
		TranscriptAssessmentHistory:
			"learner/api/Transcript/TranscriptAssessmentHistory/:UserID/:CategoryID?PageNumber=:PageNumber&PageSize=:PageSize",
		AssessmentProperties: "learner/api/Transcript/AssessmentProperties/:UserID/:AssessmentID",
		TranscriptUser: "learner/api/Transcript/TranscriptUserPublicURL/:UserID"
	},
	skillAdvisor: {
		UserTypeRoles: "learner/api/SkillAdvisor/UserTypeRoles",
		SoftwareList: "learner/api/SkillAdvisor/SoftwareList",
		Subscriptions: "learner/api/SkillAdvisor/Subscriptions/:RoleID/:ToolID/:CountryCode",
		Courses: "learner/api/SkillAdvisor/Courses/:CategoryID",
		Assessments: "learner/api/SkillAdvisor/Assessments/:CategoryID",
		SubscriptionsCourses: "learner/api/SkillAdvisor/Courses/:SID?PageNumber=:PageNumber&PageSize=:PageSize",
		SubscriptionsAssessments: "learner/api/SkillAdvisor/Assessments/:SID?PageNumber=:PageNumber&PageSize=:PageSize",
		SkillAdvisorCategories: "learner/api/SkillAdvisor/Categories/:RoleID"
	},
	Common: {
		Categories: "learner/api/Common/Categories/-1",
		SubCategoriesBasedOnCategoryID: "learner/api/Common/SubCategoriesBasedOnCategoryID/:CategoryID",
		TopicsBasedOnCategoryID: "learner/api/Common/TopicsBasedOnCategoryID/:CategoryID",
		CourseTitles: "learner/api/Common/CourseTitles/:CategoryID/:SubCategoryID"
	},
	roleStructure: {
		all: "learner/api/RolesStructure/RolesStructureListData/:UserId",
		addEditStructure: "learner/api/RolesStructure/AddEditStructure",
		get: "learner/api/RolesStructure/StructureDetails/:id",
		delete: "learner/api/RolesStructure/DeleteStructure",
		CompetencyLPByRoleStructure:
			"learner/api/RolesStructure/CompetencyLPByRoleStructure/:RoleStructureID/:RoleID/:UserID/:CompetencyID/:Mode"
	},
	trainings: {
		training: {
			create: "ilt/api/Trainings/create",
			update: "ilt/api/Trainings/update",
			delete: "ilt/api/Trainings/delete/:TrainingID",
			getTrainingByTrainingId: "ilt/api/Trainings/GetTrainings/:TrainingID",
			history: "ilt/api/Trainings/all/:PageNumber/:PageSize/:status",
			trainingSession: "ilt/api/Trainings/TrainingSession/:TrainingID",
			validate: "ilt/api/Trainings/ValidateUser",
			TrainingReports:
				"ilt/api/Trainings/TrainingReports/:StartDate/:EndDate?PageNumber=:PageNumber&PageSize=:PageSize",
			PendingFeedBackSessionsList: "ilt/api/Trainings/PendingFeedBackSessionsList/:UserID",
			FeedbackForASession: "ilt/api/Trainings/FeedbackForASession/:UserID/:Sessionid",
			PendingFeedBacks: "ilt/api/Trainings/PendingFeedBacks/:UserID",
			TrainingFeedbackQuestions: "ilt/api/Trainings/TrainingFeedbackQuestions",
			SaveTrainingFeedback: "ilt/api/Trainings/SaveTrainingFeedback",
			SessionUserReports: "ilt/api/Trainings/SessionUserReports/:StartDate/:EndDate",
			FeedbackSessionReport: "ilt/api/Trainings/FeedbackSessionReport/:StartDate/:EndDate",
			FeedbackUsersReport: "ilt/api/Trainings/FeedbackUsersReport/:StartDate/:EndDate"
		},
		session: {
			create: "ilt/api/Trainings/sessions/create",
			update: "ilt/api/Trainings/sessions/update",
			delete: "ilt/api/Trainings/sessions/delete",
			getSessionBySessionId: "ilt/api/Trainings/GetSessions/:SessionID",
			AttendanceReport: "ilt/api/Trainings/sessions/AttendanceReport/:MeetingID"
		},
		Calendar: "ilt/api/Trainings/Calendar/:Date",
		Platforms: "ilt/api/Trainings/GetPlatforms"
	},
	search: {
		GetHiddenCategoriesList: "learner/api/Search/GetHiddenCategoriesList/:AccountID",
		GetCourses: "learner/api/Search/GetCourses/:DocID/:UserID",
		Search: "learner/api/Search/Search?SessionID=:SessionID",
		Suggest: "learner/api/Search/Suggest",
		GetMoreFacets: "learner/api/Search/GetMoreFacets"
	},
	Forums: {
		CourseForum:
			"learner/api/Forums/CourseForum/:CourseID?SearchType=:SearchType&ResponseFilter=:ResponseFilter&PageSize=:PageSize",
		CreatePosting: "learner/api/Forums/CreatePosting",
		UpdatePosting: "learner/api/Forums/UpdatePosting",
		DeletePosting: "learner/api/Forums/DeletePosting",
		CreateReply: "learner/api/Forums/CreateReply",
		UpdateReply: "learner/api/Forums/UpdateReply",
		DeleteReply: "learner/api/Forums/DeleteReply",
		HideReply: "learner/api/Forums/HideReply",
		Download: "learner/api/Forums/Download",
		RemoveFiles: "learner/api/Forums/DeleteFiles"
	},
	ReportAdmin: {
		UserRoleReport: "learner/api/ReportAdmin/UserRoleReport",
		UserRoleReportExcel: "learner/api/ReportAdmin/UserRoleReportExcel",
		DowloadUserRoleReport: "learner/api/ReportAdmin/DownloadUserRoleReport/:UserID?AccountId=:AccountId",
		UserRoleStructureMapList:
			"learner/api/ReportAdmin/UserRoleStructureMapList/:UserID?AccountId=:AccountId&PageNumber=:PageNumber&PageSize=:PageSize"
	}
};
export const LoginType = {
	basic: "BASIC",
	social: "SOCIAL",
	sso: "SSO"
};
