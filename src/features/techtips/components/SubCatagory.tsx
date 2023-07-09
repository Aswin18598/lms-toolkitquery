import { ChangeEvent, useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import {
	useGetTechTipSubcategoryQuery,
	getCategorySubCategoryIDTopicIDPageNum,
	handleCategorySubCategoryIDTopicIDPageNum,
	handleApply
} from "~/features/techtips/store";
import { useDispatch, useSelector } from "react-redux";
interface IProps {
	UserID?: string;
	isDisabled: boolean;
}
const SubCatagory = ({ UserID, isDisabled }: IProps) => {
	const dispatch = useDispatch();

	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const CategoryID = CategorySubCategoryIDPageNum["CategoryID"];
	const [selectedSubcategory, setSelectedSubcategory] = useState(-1);

	// useGetTechTipSubcategoryQuery({ UserID, CategoryID });
	const { Subcategory, PreferenceDetails } = useAppSelector((state: any) => state.techtips);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubcategory(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({
				CategoryID: CategoryID,
				SubCategoryID: selectedSubcategory,
				TopicID: -1,
				PageNumber: 1
			})
		);
		dispatch(handleApply(false));
	}, [selectedSubcategory]);

	useEffect(() => {
		if (PreferenceDetails.length > 0) setSelectedSubcategory(PreferenceDetails[0]?.PrefSubcategory);
	}, [PreferenceDetails]);

	return (
		<div>
			<label className="block">
				<span>SubCategory</span>
				<select
					value={selectedSubcategory}
					placeholder="Category"
					onChange={handleChange}
					disabled={isDisabled}
					className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					<option key={-1} value="-1">
						SubCategory All
					</option>
					{/* <option>
						{subCategoryName}
					</option> */}
					{Subcategory.map((option: any, index: any) => {
						return (
							<option key={index + 1} value={option.SubCategoryID}>
								{option.Name}
							</option>
						);
					})}
				</select>
			</label>
		</div>
	);
};

export default SubCatagory;
