import { ChangeEvent, useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import { getCategorySubCategoryIDTopicIDPageNum, useGetTechTipCategoryQuery } from "~/features/techtips/store";
import { handleCategorySubCategoryIDTopicIDPageNum, handleApply } from "~/features/techtips/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
interface IProps {
	UserID?: string;
	isDisabled: boolean;
}
const Catagory = ({ UserID, isDisabled }: IProps) => {
	const dispatch = useDispatch();
	const [selectedCategory, setSelectedCategory] = useState(-1);
	// useGetTechTipCategoryQuery(UserID);
	const { Category, PreferenceDetails } = useAppSelector((state: any) => state.techtips);
	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const subCategoryID = CategorySubCategoryIDPageNum["subCategoryID"];
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({
				CategoryID: selectedCategory,
				SubCategoryID: -1,
				TopicID: -1,
				PageNumber: 1
			})
		);
		dispatch(handleApply(false));
	}, [selectedCategory]);
	useEffect(() => {
		if (PreferenceDetails.length > 0) {
			setSelectedCategory(PreferenceDetails[0]?.CategoryID);
			dispatch(
				handleCategorySubCategoryIDTopicIDPageNum({
					CategoryID: PreferenceDetails[0]?.CategoryID,
					SubCategoryID: PreferenceDetails[0]?.PrefSubcategory,
					TopicID: -1,
					PageNumber: 1
				})
			);
			dispatch(handleApply(false));
		}
	}, [PreferenceDetails]);

	return (
		<div>
			<label className="block">
				<span>Category</span>
				<select
					value={selectedCategory}
					placeholder="Category"
					onChange={handleChange}
					disabled={isDisabled}
					className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					<option key={-1} value="-1">
						Category All
					</option>
					{/* <option> 
						{categoryName}	
					</option> */}
					{Category.map((option: any, index: any) => {
						return (
							<option key={index + 1} value={option.CategoryID}>
								{option.CategoryName}
							</option>
						);
					})}
				</select>
			</label>
		</div>
	);
};

export default Catagory;
