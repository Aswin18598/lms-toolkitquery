import { IInterface } from "~/components";

export interface MasterCourseCategoryType extends IInterface {
	CatalogCategoryID: number;
	CatalogCategoryName: string;
	CategoryID: number;
	CategoryName: string;
	CategoryImageFileName: string;
	CourseCount: number;
}
export interface PaginationData {
	TotalPages: number;
	TotalItems: number;
	isTableView?: boolean;
}
