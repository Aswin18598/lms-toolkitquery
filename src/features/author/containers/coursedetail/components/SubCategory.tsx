import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { setSelectedSubCategoryID, useGetCoursesSubCategoryQuery } from "../store";

interface Iprops {
	selectedSubCatogery: any;
	setSelectedSubCatogery: any;
}
const SubCategory = ({ selectedSubCatogery, setSelectedSubCatogery }: Iprops) => {
	const dispatch = useDispatch();
	const user = getLoggedUser();
	const { SubCategories, CategoryID } = useAppSelector((state: any) => state.CourseDetailReducer);
	const { refetch } = useGetCoursesSubCategoryQuery({ UserID: user.UserId, CategoryID: CategoryID });

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedSubCategoryID(e.target.value));
		setSelectedSubCatogery(e.target.value);
	};

	useEffect(() => {
		refetch();
	}, [CategoryID]);

	return (
		<select
			value={selectedSubCatogery}
			placeholder="SubCategory"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={0}>{"SubCategory (All)"}</option>
			{SubCategories?.length > 0 &&
				SubCategories?.map((GridOption: any) => {
					return (
						<option key={GridOption?.SubCategoryID} value={GridOption?.SubCategoryID}>
							{GridOption?.Name + " " + "(" + GridOption.Version + ")"}
						</option>
					);
				})}
		</select>
	);
};

export default SubCategory;
