import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import MyLearningCourseDetails from "../components/MyLearningCourseDetails";
import { useGetCoursePropertiesQuery, useGetCategoriesListQuery } from "../store";

function LearningCourseDetails() {
	useGetCategoriesListQuery("");
	const { UserId } = getLoggedUser();
	const location = useLocation();
	const CourseID = +location.search?.split("&")[2];
	const { refetch } = useGetCoursePropertiesQuery({ UserID: UserId, CourseID: CourseID });
	const { CourseProperties, CoursePropertiesMessage } = useAppSelector((state: any) => state.learningReducer);
	const { Favorites } = useAppSelector((state: any) => state.headersandmenuReducer);

	useEffect(() => {
		const scrollToDiv = document.getElementById("NavigationLearningmenu");
		scrollToDiv?.scrollIntoView();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [Favorites]);

	return (
		<>
			{CourseProperties?.length > 0 && CourseProperties[0]?.CategoryID ? (
				<MyLearningCourseDetails refetch={refetch} />
			) : (
				<div className="flex justify-center px-64 py-32">
					<p className="text-xs+ text-[#020A12]/60">
						{CoursePropertiesMessage.includes("Success")
							? ""
							: CoursePropertiesMessage.includes("Fail")
							? "No records Found"
							: CoursePropertiesMessage}
					</p>
				</div>
			)}
		</>
	);
}

export default LearningCourseDetails;
