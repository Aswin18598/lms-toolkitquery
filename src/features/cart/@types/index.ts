import { IInterface } from "~/components";

export interface Cart extends IInterface {
	CartID: string;
	Title: string;
	Description: string;
	courseCount: string;
	CourseDuration: string;
}
