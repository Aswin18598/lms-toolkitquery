import { ChangeEvent } from "react";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { useGetSubCategoryListQuery } from "../store";

interface Iprops {
	setLoader: any;
	selectedLearningCatogery: any;
	setSelectedLearningSubCatogery: any;
	selectedLearningSubCatogery: any;
}
const LearningSubCategory = ({
	setLoader,
	selectedLearningCatogery,
	setSelectedLearningSubCatogery,
	selectedLearningSubCatogery
}: Iprops) => {
	const { SubCategoryList } = useAppSelector((state: any) => state.learningReducer);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLoader(true);
		setSelectedLearningSubCatogery(e.target.value);
	};

	return (
		<select
			value={selectedLearningSubCatogery}
			placeholder="SubCategory"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={0}>{"SubCategory (All)"}</option>
			{SubCategoryList?.length > 0 &&
				SubCategoryList?.map((GridOption: any) => {
					return (
						<option key={GridOption?.SubCategoryID} value={GridOption?.SubCategoryID}>
							{GridOption?.Name}
						</option>
					);
				})}
		</select>
	);
};

export default LearningSubCategory;
