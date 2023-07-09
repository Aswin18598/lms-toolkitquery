import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import FilterSection from "./FilterSection";
import CatalogCourseCard from "./CatalogCourseCard";
import CatalogAssesmentCard from "./CatalogAssesmentCard";
import {
	setSelectedCatagoryID,
	setSelectedSkillLevelID,
	setSelectedSubCatagoryID,
	setSelectedTopicID,
	setSelectedSearchText,
	useGetFilterCoursesQuery,
	setCourseDataToEmpty,
	setAssesmentsDataToEmpty,
	setSelectedPageNumber,
	setSelectedPageSize
} from "../store";
import { useAppSelector } from "~/config/store";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

const myLearningCatogeries = ["Courses", "Assessments"];

function CatalogCourses() {
	const location = useLocation();
	const {
		CourseCatagoryID,
		SubCatagoryID,
		SkillLevelID,
		Rating,
		CategoryLists,
		CategoryList,
		TopicID,
		TypeID,
		SearchText,
		PageNumber,
		PageSize
	} = useAppSelector((state: any) => state.learningReducer);
	const [loader, setLoader] = useState<boolean>(false);
	const [skip, setSkip] = useState<boolean>(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isFetching, refetch } = useGetFilterCoursesQuery(
		{
			TopicID: TopicID,
			CatagoryID: CourseCatagoryID,
			SubCategoryID: SubCatagoryID,
			SkillLevelID: SkillLevelID,
			Rating: Rating,
			SearchText: SearchText.length > 0 ? SearchText : -1,
			PageNumber: PageNumber,
			PageSize: PageSize
		},
		{
			skip:
				PageSize === 10 ||
				!!!CourseCatagoryID ||
				CourseCatagoryID === 0 ||
				(skip && location?.state?.CategoryID && location?.state?.CategoryID !== CourseCatagoryID)
		}
	);
	// console.log("CourseCatagory", CourseCatagoryID, skip, location, location?.state?.CategoryID, TypeID);

	useEffect(() => {
		setLoader(true);
	}, []);

	const handleTabChange = (index: number) => {
		dispatch(setCourseDataToEmpty([]));
		dispatch(setAssesmentsDataToEmpty([]));
		setLoader(true);
		navigate(navigateLink.learning + "?Catalog-" + (index + 1));
		dispatch(setSelectedCatagoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID));
		dispatch(setSelectedSubCatagoryID(-1));
		dispatch(setSelectedSkillLevelID(-1));
		dispatch(setSelectedTopicID(-1));
		dispatch(setSelectedSearchText(""));
		dispatch(setSelectedPageNumber(1));
		dispatch(setSelectedPageSize(12));
	};

	useEffect(() => {
		if (+CourseCatagoryID !== +location?.state?.CategoryID) {
			setSkip(false);
		}
	}, [CourseCatagoryID]);

	useEffect(() => {
		dispatch(setCourseDataToEmpty([]));
		dispatch(setAssesmentsDataToEmpty([]));
		setTimeout(() => {
			if (TypeID === 1) {
				setLoader(true);
				refetch();
			}
		}, 600);
	}, [CourseCatagoryID, SubCatagoryID, SkillLevelID, SearchText, TopicID, TypeID, PageNumber, PageSize]);

	useEffect(() => {
		setLoader(true);
		dispatch(setSelectedPageNumber(1));
	}, [CourseCatagoryID, SubCatagoryID, SkillLevelID, SearchText, TopicID, TypeID]);

	useEffect(() => {
		return () => {
			dispatch(setCourseDataToEmpty([]));
			dispatch(setAssesmentsDataToEmpty([]));
			if (location?.state?.CategoryID && TypeID !== 2) {
				console.log(+location?.state?.CategoryID, "location?.state?.CategoryID");
				dispatch(setSelectedCatagoryID(location.state.CategoryID));
				setSkip(!!location?.state?.CategoryID);
			} else if (CategoryLists.length > 0) {
				dispatch(setSelectedCatagoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID));
			} else {
				dispatch(setSelectedCatagoryID(-1));
			}
			dispatch(setSelectedSubCatagoryID(-1));
			dispatch(setSelectedSkillLevelID(-1));
			dispatch(setSelectedTopicID(-1));
			dispatch(setSelectedSearchText(""));
			dispatch(setSelectedPageNumber(1));
			dispatch(setSelectedPageSize(12));
		};
	}, [CategoryLists, location, TypeID, CategoryList]);

	useEffect(() => {
		return () => {
			if (+CourseCatagoryID === -1) {
				dispatch(setCourseDataToEmpty([]));
				dispatch(setAssesmentsDataToEmpty([]));
			}
		};
	}, []);

	return (
		<>
			<div className="h-fit">
				<div className="flex justify-between flex-wrap gap-4">
					<div className="flex flex-wrap flex-row space-x-4">
						{myLearningCatogeries.map((category: any, index: number) => (
							<button
								key={category}
								onClick={() => handleTabChange(index)}
								className={`px-3 py-2 rounded-full text-sm font-bold my-1 ${
									TypeID === index + 1 ? "bg-[#1268B3] text-[#ffffff]" : "bg-slate-200"
								}`}
							>
								{category}
							</button>
						))}
					</div>
					<div className="my-2 sm:my-0 w-64">
						<SearchBar setLoader={setLoader} />
					</div>
				</div>
				<FilterSection setLoader={setLoader} />
				{TypeID === 1 && <CatalogCourseCard loader={isFetching} setLoader={setLoader} />}
				{TypeID === 2 && <CatalogAssesmentCard loader={isFetching} setLoader={setLoader} />}
			</div>
		</>
	);
}

export default CatalogCourses;
