export interface SingUpRequest {
	FirstName: string;
	LastName: string;
	Email: string;
	Password: string;
	CPassword: string;
	MarketingEmail: boolean;
	// optVerified?: boolean;
}

export interface SingUpResponse {}
