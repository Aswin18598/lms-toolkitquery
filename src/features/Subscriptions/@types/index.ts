export interface PaginationData {
	TotalPages: number;
	TotalItems: number;
}

export interface SubscriptionsCoursesData {
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
	skillAdvisor_Courses: Array<any>;
}

export interface SubscriptionsAssessmentsData {
	PageNumber: number;
	PageSize: number;
	TotalItems: number;
	TotalPages: number;
	skillAdvisor_Assessments: Array<any>;
}
export interface ISubscriptionDetails {
	AssessmentCount: number;
	CancelSubscription: string;
	CourseCount: number;
	Currency: string;
	ExpireDate: string;
	FulfillmentID: number;
	Image: string;
	Quantity: number;
	Price: number;
	PurchaseType: string;
	ReacitivateSubscription: string;
	RenewSubscription: string;
	SalesOrderDetailID: string;
	SubscriptionID: number;
	SubscriptionName: string;
}
