import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { useGetSubCategoriesListQuery, useGetSubCategoryListQuery } from "../store/query";
import { setSelectedPageSize, setSelectedSearchText, setSelectedTopicID } from "../store/slice";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

interface IProps {
	setSubCategoryIdAndShow: any;
	selectedSubCategoryID: number;
}

function FilterSectionSubCategory({ setSubCategoryIdAndShow, selectedSubCategoryID }: IProps) {
	const { UserId } = getLoggedUser();
	const dispatch = useDispatch();
	const { SubCategoryLists, CourseCatagoryID, SubCategoryList } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const { refetch } = useGetSubCategoriesListQuery(CourseCatagoryID, { skip: CourseCatagoryID === 0 });
	useGetSubCategoryListQuery({ UserID: UserId, CategoryID: +CourseCatagoryID === -1 ? 0 : CourseCatagoryID });

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedSearchText(""));
		setSubCategoryIdAndShow(e.target.value);
		dispatch(setSelectedPageSize(12));
	};

	useEffect(() => {
		dispatch(setSelectedTopicID(-1));
	}, [selectedSubCategoryID]);

	useEffect(() => {
		refetch();
	}, [CourseCatagoryID]);

	return (
		<select
			value={selectedSubCategoryID}
			placeholder="SubCategory"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={-1}>{"SubCategory (All)"}</option>
			{(checkIsB2B() ? SubCategoryList : SubCategoryLists)?.length > 0 &&
				(checkIsB2B() ? SubCategoryList : SubCategoryLists)?.map((GridOption: any) => {
					return (
						<option key={GridOption?.SubCategoryID} value={GridOption?.SubCategoryID}>
							{GridOption?.Name + (GridOption.Version && " " + "(" + GridOption.Version + ")")}
						</option>
					);
				})}
		</select>
	);
}

export default FilterSectionSubCategory;
