export interface SessionRequest {
	TrainingID: string;
	Name: string;
	Description: string;
	StartDateTime: any;
	EndDateTime: any;
	Location: string;
	InstructorName: string;
	PlatformTypeID: number;
	Recurrence: any;
	Attendees: any;
	TimeZone: string;
}

export interface SessionResponse {}

export interface TrainingRequest {
	Name: string;
	Description: string;
	Attendees: any;
	CourseID: string;
	Email: any;
}

export interface PaginationData {
	TotalPages: number;
	TotalItems: number;
}

export interface TrainingResponse {}
