export interface LoginRequest {
	Email: string;
	EncPassword: string;
}

export interface UserResponse {
	user: any;
	token: string;
}
