import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	setSelectedCatagoryID,
	setSelectedPageSize,
	setSelectedSearchText,
	setSelectedSubCatagoryID,
	setSelectedTopicID
} from "../store/slice";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

interface IProps {
	setCategoryIdAndShow: any;
	selectedCatagoryID: number;
}

function FilterSectionCategory({ setCategoryIdAndShow, selectedCatagoryID }: IProps) {
	const { CourseCatagoryID, CategoryLists, CategoryList } = useAppSelector((state: any) => state.learningReducer);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedSearchText(""));
		dispatch(setSelectedCatagoryID(e.target.value));
		setCategoryIdAndShow(e.target.value);
		dispatch(setSelectedPageSize(12));
	};
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setSelectedSubCatagoryID(-1));
		dispatch(setSelectedTopicID(-1));
	}, [CourseCatagoryID]);

	return (
		<select
			value={selectedCatagoryID}
			placeholder="Category"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={-1}>{"Category (All)"}</option>
			{(checkIsB2B() ? CategoryList : CategoryLists)?.length > 0 &&
				(checkIsB2B() ? CategoryList : CategoryLists)?.map((GridOption: any, index: number) => {
					return (
						<option key={GridOption?.CategoryID} value={GridOption?.CategoryID}>
							{GridOption?.CategoryName}
						</option>
					);
				})}
		</select>
	);
}

export default FilterSectionCategory;
