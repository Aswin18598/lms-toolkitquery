export interface ILearningAssignments {
	PathID: number;
	Name: string;
	CoursesCount: number;
	AssessmentsCount: number;
	AccountID: number;
	Description?: string;
	SubcategoryID: number;
	TypeID: number;
}
export interface ILearningPathItems {
	PathID: number;
	SubcatName: string;
	Name: string;
	CourseID: number;
	Type: string | number;
	Title: string;
	DueDate: string;
	StartDate: string;
	SubcategoryID: number;
	MinPassGrade: number;
	ItemSequence: number;
}
export interface ISubCategories {
	SubCategoryID: number;
	Name: string;
	CateName: string;
	Version: string;
}
export interface ICategories {
	CategoryID: number;
	CategoryName: string;
}
export interface ICoursesForLearningPath {
	CourseID: number;
	Title: string;
	Custom: number;
	CategoryID: number;
	CategoryName: string;
}
export interface IAssessmentsForLearningPath {
	ID: number;
	Title: string;
	Custom: number;
	CategoryID: number;
	CategoryName: string;
}
export interface IIntegrationsForLearningPath {
	ID: number;
	SourceID: number;
	Source: string;
	Title: string;
	Description: string;
	AuthorName: string;
	Link: string;
}
export interface IUserListForLearningPath {
	UserID: number;
	UserName: string;
	FirstName: string;
	LastName: string;
	FullName: string;
	Email: string;
	UserTypeID: number;
	Role: string;
	BusinessSite: string;
	BusinessGroup: string;
	BusinessManager: string;
	ADID: string;
	ADName: string;
	ShipCity: string;
	ShipState: string;
	ShipCountry: string;
	LogInDate: string;
	TotalLogins: number;
	UsageTime: string;
	ShipAddress1: string;
	ShipAddress2: string;
	CompanyName: string;
	BundleStatus: string;
	CreationDate: string;
	Attribute1: string;
	Attribute2: string;
}
export interface IGroupListsForLearningPath {
	TotalItems: number;
	TotalPages: number;
	PageNumber: number;
	PageSize: number;
	GroupListByManager: [
		{
			GroupID: number;
			GroupName: string;
			Type: number;
		}
	];
}
export interface IConditionalUsersForLearningPath {
	TotalItems: number;
	TotalPages: number;
	PageNumber: number;
	PageSize: number;
	ConditionalUsers: [
		{
			UserID: number;
			FirstName: string;
			LastName: string;
		}
	];
}
export interface IAssignedUsersForLearningPath {
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
	AssignedUsersForLearningPaths: [
		{
			BundleStatus: string;
			CreationDate: string;
			Email: string;
			FirstName: string;
			FullName: string;
			LastName: string;
			LogInDate: string;
			PageNumber: number;
			PageSize: number;
			Role: string;
			TotalItems: number;
			TotalLogins: number;
			TotalPages: number;
			UsageTime: number;
			UserID: number;
			UserName: string;
			UserTypeID: number;
		}
	];
}
export interface IDynamicFiedOptionsResponse {
	Txt: string;
	Val: string;
}
export interface IAssignedGroupsForLearningPath {
	AssignedGroupByPathID: [
		{
			GroupID: number;
			GroupName: string;
		}
	];
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
}
export interface IUnAssignedGroupsForLearningPath {
	UnAssignedGroupByPathID: [
		{
			GroupID: number;
			GroupName: string;
		}
	];
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
}
export interface IAssignedAggregationsForLearningPath {
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
	LPAssignedAggregations: [
		{
			PathID: number;
			Name: string;
			Source: string;
			ID: number;
			Type: string;
			Title: string;
			DueDate: string;
			StartDate: string;
			MinPassGrade: number;
			ItemSequence: number;
		}
	];
}
export interface IAssignUserToLearningPathBody {
	UserID?: number | string;
	AccountID?: number;
	PathID?: number;
}
export interface IAssignUserToLearningPathResponse {
	Message: string;
	Data: {
		UserID: number;
		AccountID: number;
		PathID: number;
	};
}
export interface ISetDynamicGroupAttributeBody {
	PathID?: number | string;
	MainCondID?: number | string;
	AttrInfo?: Array<string | number>;
}
export interface ISetDynamicGroupAttributeResponse {
	Message: string;
	Output: string;
	Data: {
		PathID: number;
		FieldID: number;
		Filter: string;
		ConditionID: number;
		MainCondID: number;
		AttrID: number;
	};
}
export interface ILPItemActionBody {
	UserID?: number;
	Action?: string;
	PathID?: number;
	ItemID?: number;
	ItemType?: number | string;
	DueDate?: string;
	StartDate?: string;
	ItemSequence?: number;
}
export interface ILPItemActionResponse {
	Message: string;
	Data: {
		UserID: number;
		Action: string;
		PathID: number;
		ItemID: number;
		ItemType: number;
		DueDate: string;
		StartDate: string;
		ItemSequence: number;
	};
}
export interface IlearningPathActionsBody {
	Name?: string;
	UserID?: number;
	AccountID?: number;
	Action?: string;
	PathID?: number;
	ForceOrder?: boolean | number;
	Description?: string;
	Subcategory?: number | string | null;
	Filters?: string | null;
	TypeID?: number;
}
export interface IlearningPathActionsResponse {
	Message: string;
	Data: IlearningPathActionsBody;
}
export interface ILearningPathIntegrationBody {
	Action?: string;
	UserID?: number;
	ID?: number;
	SourceID?: number;
	Title?: string;
	Description?: string;
	AuthorName?: string;
	Link?: string;
}
export interface ILearningPathIntegrationResponse {
	Message: string;
	Data: ILearningPathIntegrationBody;
}
export interface IAssignGroupToLearningPathBody {
	GroupID: number;
	PathID?: number;
}
export interface IAssignGroupToLearningPathResponse {
	Message: string;
	Data: {
		GroupID: number;
		PathID?: number;
	};
}
export interface IAddLPNotificationBody {
	PathID?: number;
	UserID?: number;
	Message?: string;
	Link?: string;
}
export interface IAddLPNotificationResponse {
	Message: string;
	Output: string;
	Data: {
		PathID: number;
		UserID: number;
		Message: string;
		Link: string;
	};
}
export interface ILPEmailNotificationBody {
	UserID?: number;
	PathID: number;
	MessageWithItems: boolean;
	EmailMessage: string;
	EmailSubject: string;
}
export interface ILPEmailNotificationResponse {
	Message: string;
	Output: string;
	Data: {
		EmailIDs: string;
		LearningPathDetails: string;
	};
}
// Delete Method
export interface IRemoveGroupFromLpBody {
	GroupID: number;
	PathID: number;
}
export interface IRemoveGroupFromLpResponse {
	Message: string;
	Data: {
		GroupID: number;
		PathID?: number;
	};
}
export interface IRemoveUserFromLpBody {
	UserID?: number | string;
	PathID: number;
}
export interface IRemoveUserFromLpResponse {
	Message: string;
	Data: {
		UserID: number;
		PathID: number;
	};
}
export interface IRemoveAggregationFromLpBody {
	AggregationID?: number;
	PathID?: number;
}
export interface IRemoveAggregationFromLpResponse {
	Message: string;
	Data: {
		UserID: number;
		PathID: number;
	};
}
