import React from "react";
import { ISubCategories } from "../@types";
interface ISubCategorySectionProps {
	subCategory: number | string;
	category: number | string;
	setSubCategory: React.Dispatch<React.SetStateAction<number>>;
	subCategoriesList: ISubCategories[];
}
function SubCategorySection(props: ISubCategorySectionProps) {
	const { subCategory, setSubCategory, subCategoriesList, category } = props;
	return (
		<div className="w-full">
			<p className="text-sm font-medium">Sub-Category</p>
			<select
				disabled={!category}
				value={subCategory}
				placeholder="All Paths"
				onChange={e => setSubCategory(+e.target.value)}
				className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
			>
				<option value={0}>All</option>
				{subCategoriesList?.length > 0
					? subCategoriesList?.map((c: ISubCategories, i: number) => (
							<option key={i} value={c?.SubCategoryID}>
								{c?.Name}
							</option>
					  ))
					: null}
			</select>
		</div>
	);
}

export default SubCategorySection;
