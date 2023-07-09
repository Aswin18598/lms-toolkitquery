import { ChangeEvent, useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import {
	useGetSubcategoryQuery,
	getCategorySubCategoryIDPageNum,
	handleCategorySubCategoryIDPageNum
} from "~/features/quickstarts/store";
import { useDispatch, useSelector } from "react-redux";
interface IProps {
	UserID?: string;
}
const SubCatagory = ({ UserID }: IProps) => {
	const dispatch = useDispatch();

	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDPageNum);
	const CategoryID = CategorySubCategoryIDPageNum["CategoryID"];
	const [selectedSubcategory, setSelectedSubcategory] = useState(0);
	useGetSubcategoryQuery({ UserID, CategoryID }, { skip: CategoryID === 0 });
	const { Subcategory } = useAppSelector((state: any) => state.quickstarts);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubcategory(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDPageNum({
				CategoryID: CategoryID,
				SubCategoryID: selectedSubcategory,
				PageNumber: 1
			})
		);
	}, [selectedSubcategory]);

	return (
		<select
			value={selectedSubcategory}
			placeholder="Category"
			onChange={handleChange}
			className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option key={0} value="0">
				Subcategory (All)
			</option>
			{CategoryID !== 0 &&
				Subcategory.map((option: any, index: any) => {
					return (
						<option key={index + 1} value={option.SubCategoryID}>
							{option.Name}
						</option>
					);
				})}
		</select>
	);
};

export default SubCatagory;
