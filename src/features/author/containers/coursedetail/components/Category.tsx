import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { setSelectedCategoryID, useGetCoursesCategoryQuery } from "../store";

interface Iprops {
	selectedCategory: any;
	setSelectedCategory: any;
}
const Category = ({ selectedCategory, setSelectedCategory }: Iprops) => {
	const dispatch = useDispatch();
	const { Categories } = useAppSelector((state: any) => state.CourseDetailReducer);
	useGetCoursesCategoryQuery("");

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedCategoryID(e?.target?.value));
		setSelectedCategory(e.target.value);
	};

	return (
		<select
			value={selectedCategory}
			placeholder="Category"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={0}>{"Category (All)"}</option>
			{Categories?.length > 0 &&
				Categories?.map((GridOption: any, index: number) => {
					return (
						<option key={GridOption?.CategoryID} value={GridOption?.CategoryID}>
							{GridOption?.CategoryName}
						</option>
					);
				})}
		</select>
	);
};

export default Category;
