export interface Competency {
	ID?: number;
	CompetencyName: string;
	CompetencyTypeId: number;
	IsPublic?: number;
	IsMandatory?: number;
	AccountID?: number;
	UserID?: number;
}

export type CompetencyInitialState = {
	isEditMode: boolean;
	competency?: Competency;
};
