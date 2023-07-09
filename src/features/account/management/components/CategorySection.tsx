import React from "react";
import { ICategories } from "../@types";
interface ICategorySectionProps {
	category: number | string;
	setCategory: React.Dispatch<React.SetStateAction<number>>;
	categories: ICategories[];
}
function CategorySection(props: ICategorySectionProps) {
	const { category, setCategory, categories } = props;
	return (
		<div className="w-full">
			<p className="text-sm font-medium">Category</p>
			<select
				value={category}
				onChange={e => setCategory(+e.target.value)}
				className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
			>
				<option value={0}>All</option>
				{categories?.length > 0
					? categories?.map((c: ICategories, i: number) => (
							<option key={i} value={c?.CategoryID}>
								{c?.CategoryName}
							</option>
					  ))
					: null}
			</select>
		</div>
	);
}

export default CategorySection;
