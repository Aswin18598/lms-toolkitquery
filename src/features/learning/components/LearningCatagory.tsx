import { ChangeEvent, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { useGetCategoryListQuery, useGetSubCategoryListQuery } from "../store/query";

interface IProps {
	selectedLearningCatogery: number;
	setSelectedLearningCatogery: any;
	setLoader?: any;
}

const LearningCatagory = ({ selectedLearningCatogery, setSelectedLearningCatogery, setLoader }: IProps) => {
	const { UserId } = getLoggedUser();
	useGetCategoryListQuery(UserId);
	const { refetch } = useGetSubCategoryListQuery({ UserID: UserId, CategoryID: selectedLearningCatogery });
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLoader(true);
		setSelectedLearningCatogery(e.target.value);
	};
	const { CategoryList } = useAppSelector((state: any) => state.learningReducer);

	// useEffect(()=>{
	//     refetch()
	// },[selectedLearningCatogery])

	return (
		<select
			value={selectedLearningCatogery}
			placeholder="Category"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={0}>{"Category (All)"}</option>
			{CategoryList?.length > 0 &&
				CategoryList?.map((GridOption: any) => {
					return (
						<option key={GridOption?.CategoryID} value={GridOption?.CategoryID}>
							{GridOption?.CategoryName}
						</option>
					);
				})}
		</select>
	);
};

export default LearningCatagory;
