export interface Params {
	RoleID?: string;
	CategoryID?: string;
}

export enum Page {
	banner = "banner",
	plan = "plan",
	planDetails = "planDetails"
}

export interface State {
	isFilterApplied: boolean;
	filterValues: Params;
	currentPage: Page;
	plan?: any;
	previewUrl?: string;
}
