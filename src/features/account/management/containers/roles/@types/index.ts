export interface Role {
	ID?: number;
	RoleName: string;
	TotalExpMonths: number;
	UserID?: number;
	IsPublic?: number;
	Status?: number;
}

export type RoleInitialState = {
	isEditMode: boolean;
	role?: Role;
};
