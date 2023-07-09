import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Page } from "~/components";
import { navigateLink } from "~/config/api/links";
import { getLoggedUser } from "~/helpers/auth";
import LearningCatalog from "./components/Catalog";
import History from "./components/History";
import LearningPath from "./components/LearningPath";
import MyLearningPage from "./components/MyLearningPage";
import NavigationLearningmenu from "./components/NavigationLearningmenu";
import LearningAssesmentDetails from "./layout/LearningAssesmentDetails";
import LearningCourseDetails from "./layout/LearningCourseDetails";
import { setSelectedPageNumber, useGetFilterCoursesInitialQuery } from "./store";

const learningMenu = ["MyLearning", "LearningPaths", "History", "Catalog"];

function LearningPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const scrollToDiv = document.getElementById("Learning");
		scrollToDiv?.scrollIntoView();
	}, []);

	useEffect(() => {
		if (location.pathname === "/learning" && !location.search.includes("?")) {
			navigate("/learning?MyLearning-1");
		}
	}, [location]);
	const learningMenuTab = location.search?.replace("?", "");
	const detailViewPage = learningMenuTab?.split("&")[1];

	useEffect(() => {
		// if (learningMenuTab.includes(learningMenu[3]) && !learningMenuTab.includes("&") && AccountTypeID !== "2")
		// 	navigate(navigateLink.dashboard);
		return () => {
			dispatch(setSelectedPageNumber(1));
		};
	}, [learningMenuTab]);

	useGetFilterCoursesInitialQuery({
		TopicID: -1,
		CatagoryID: -1,
		SubCategoryID: -1,
		SkillLevelID: -1,
		Rating: -1,
		SearchText: -1,
		PageNumber: 1,
		PageSize: 40
	});

	return (
		<Page title="Learning">
			<NavigationLearningmenu />
			<div className="w-full mt-8">
				{learningMenuTab.includes(learningMenu[0]) && !learningMenuTab.includes("&") && <MyLearningPage />}
				{learningMenuTab.includes(learningMenu[1]) && !learningMenuTab.includes("&") && <LearningPath />}
				{learningMenuTab.includes(learningMenu[2]) && !learningMenuTab.includes("&") && <History />}
				{learningMenuTab.includes(learningMenu[3]) && !learningMenuTab.includes("&") && <LearningCatalog />}
				{(detailViewPage === navigateLink.LearningCoursedetail?.split("&")[1] ||
					detailViewPage === navigateLink.CatalogCoursedetail?.split("&")[1]) && <LearningCourseDetails />}
				{(detailViewPage === navigateLink.CatalogAssesmentdetail?.split("&")[1] ||
					detailViewPage === navigateLink.learningAssesmentDetails?.split("&")[1]) && (
					<LearningAssesmentDetails />
				)}
			</div>
		</Page>
	);
}

export default LearningPage;
