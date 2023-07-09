import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import MyLearningAssessmentDetails from "../components/MyLearningAssessmentDetails";
import { useGetAssessmentPropertiesQuery, useGetCategoriesListQuery } from "../store";

function LearningAssesmentDetails() {
	useGetCategoriesListQuery("");
	const { AssessmentProperties, AssessmentPropertiesMessage } = useAppSelector((state: any) => state.learningReducer);
	const { UserId } = getLoggedUser();
	const { Favorites } = useAppSelector((state: any) => state.headersandmenuReducer);

	const location = useLocation();
	const AssessmentID = +location.search?.split("&")[2];
	const { isLoading, refetch } = useGetAssessmentPropertiesQuery({ UserID: UserId, AssessmentID: AssessmentID });

	useEffect(() => {
		const scrollToDiv = document.getElementById("Learning");
		scrollToDiv?.scrollIntoView();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [Favorites]);

	return (
		<>
			{AssessmentProperties?.CategoryID ? (
				<MyLearningAssessmentDetails isLoading={isLoading} refetch={refetch} />
			) : (
				<div className="flex justify-center px-64 py-32">
					<p className="text-xs+ text-[#020A12]/60">
						{AssessmentPropertiesMessage?.includes("Success")
							? ""
							: AssessmentPropertiesMessage?.includes("Fail")
							? "No records Found"
							: AssessmentPropertiesMessage}
					</p>
				</div>
			)}
		</>
	);
}

export default LearningAssesmentDetails;
