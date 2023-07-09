import { getLoggedUser } from "./auth";
const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
const { SessionId } = getLoggedUser();
const token = localStorage.getItem("sessionId");

export function RedirectLinkCourse(CourseID: string | number, locationEndPoint: string) {
	return `${PreprodUrl}iGETIT2/Api/${CourseID}?PathID=-1&type=1&From=${locationEndPoint}&TokenID=${token}`;
}

export function RedirectLinkArticleID(ArticleID: string | number, locationEndPoint: string) {
	return `${PreprodUrl}iGETIT2/Api/?ArticleID=${ArticleID}&From=${locationEndPoint}&type=2&TokenID=${token}`;
}

export function RedirectLinkAssesment(AssessmentID: string | number, locationEndPoint: string) {
	return `${PreprodUrl}iGETIT2/Api/${AssessmentID}?type=3&From=${locationEndPoint}&TokenID=${token}`;
}

export function RedirectLinkReport() {
	return `${PreprodUrl}iGETIT2/Api?From=dashboard&type=4&TokenID=${token}`;
}

export function RedirectLinkHelp() {
	return `${PreprodUrl}iGETIT2/Api?From=dashboard&type=5&TokenID=${token}`;
}

export function RedirectLinkAuthor() {
	return `${PreprodUrl}iGETIT2/Api?From=Author/management&type=6&TokenID=${token}`;
}

export function RedirectLinkAccount() {
	return `${PreprodUrl}iGETIT2/Api?From=Account/management&type=7&TokenID=${token}`;
}

export function RedirectLinkknowledge() {
	return `${PreprodUrl}iGETIT2/Api?From=dashboard&type=8&TokenID=${token}`;
}

export function RedirectLinkTraining() {
	return `${PreprodUrl}iGETIT2/Api?From=dashboard&type=9&TokenID=${token}`;
}

export function ViewSearchDocument(DocId: number | string, DocTypeId: number | string, locationEndPoint: string) {
	return `${PreprodUrl}iGETIT2/Api/${DocId}?From=${locationEndPoint}&type=1&TokenID=${token}`;
}
