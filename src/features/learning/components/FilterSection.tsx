import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	setSelectedCatagoryID,
	setSelectedSkillLevelID,
	setSelectedSubCatagoryID,
	setSelectedTopicID
} from "~/features/learning/store";
import FilterSectionSkill from "./FilterSectionSkill";
import FilterSectionCategory from "./FilterSectionCategory";
import FilterSectionSubCategory from "./FilterSectionSubCategory";
import FilterSectionTopic from "./FilterSectionTopic";
import { useLocation } from "react-router-dom";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

interface IProps {
	setLoader: any;
}

function FilterSection({ setLoader }: IProps) {
	const location = useLocation();
	const { CategoryLists, CategoryList, SkillLevelID, SubCatagoryID, CourseCatagoryID, TopicID, TypeID } =
		useAppSelector((state: any) => state?.learningReducer);
	const [categoryID, setCategoryID] = useState<number>(CourseCatagoryID);
	const [subCategoryID, setSubCategoryID] = useState<number>(SubCatagoryID);
	const [skillID, setSkillID] = useState<number>(SkillLevelID);
	const [topicID, setTopicID] = useState<number>(TopicID);
	const dispatch = useDispatch();

	useEffect(() => {
		setLoader(true);
	}, [categoryID, skillID, topicID, subCategoryID]);

	useEffect(() => {
		setCategoryID(CourseCatagoryID);
	}, [CourseCatagoryID]);

	useEffect(() => {
		dispatch(setSelectedCatagoryID(categoryID));
	}, [categoryID]);

	useEffect(() => {
		dispatch(setSelectedSubCatagoryID(subCategoryID));
	}, [subCategoryID]);

	useEffect(() => {
		dispatch(setSelectedSkillLevelID(skillID));
	}, [skillID]);

	useEffect(() => {
		dispatch(setSelectedTopicID(topicID));
	}, [topicID]);

	useEffect(() => {
		if (location?.state?.CategoryID && TypeID !== 2) {
			setCategoryID(location.state.CategoryID);
			dispatch(setSelectedCatagoryID(location.state.CategoryID));
		} else if (CategoryLists.length > 0) {
			setCategoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID);
			dispatch(setSelectedCatagoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID));
		} else {
			setCategoryID(-1);
			dispatch(setSelectedCatagoryID(-1));
		}
	}, [CategoryLists, CategoryList]);

	useEffect(() => {
		setSubCategoryID(-1);
		setSkillID(-1);
		setTopicID(-1);
	}, [TypeID]);

	useEffect(() => {
		setSubCategoryID(-1);
		setTopicID(-1);
	}, [categoryID]);

	useEffect(() => {
		setTopicID(-1);
	}, [subCategoryID]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 my-4">
			<div className="my-2 sm:my-0 min-w-[300px]">
				<FilterSectionCategory setCategoryIdAndShow={setCategoryID} selectedCatagoryID={categoryID} />
			</div>
			<div className="my-2 sm:my-0 min-w-[300px]">
				<FilterSectionSubCategory
					setSubCategoryIdAndShow={setSubCategoryID}
					selectedSubCategoryID={subCategoryID}
				/>
			</div>
			{TypeID === 1 && (
				<>
					<div className="my-2 sm:my-0 min-w-[300px]">
						<FilterSectionTopic setTopicIDAndShow={setTopicID} selectedTopicID={topicID} />
					</div>
					<div className="my-2 sm:my-0 min-w-[300px]">
						<FilterSectionSkill setSkillIDAndShow={setSkillID} selectedSkillID={skillID} />
					</div>
				</>
			)}
		</div>
	);
}

export default FilterSection;
