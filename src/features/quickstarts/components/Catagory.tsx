import { ChangeEvent, useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import { useGetCategoryQuery } from "~/features/quickstarts/store";
import { handleCategorySubCategoryIDPageNum } from "~/features/quickstarts/store";
import { useDispatch } from "react-redux";
interface IProps {
	UserID?: string;
}
const Catagory = ({ UserID }: IProps) => {
	const dispatch = useDispatch();
	const [selectedCategory, setSelectedCategory] = useState(0);
	useGetCategoryQuery(UserID);
	const { Category } = useAppSelector((state: any) => state.quickstarts);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(handleCategorySubCategoryIDPageNum({ CategoryID: selectedCategory, SubCategoryID: 0, PageNumber: 1 }));
	}, [selectedCategory]);

	return (
		<select
			value={selectedCategory}
			placeholder="Category"
			onChange={handleChange}
			className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option key={0} value="0">
				Category (All)
			</option>
			{Category.map((option: any, index: any) => {
				return (
					<option key={index + 1} value={option.CategoryID}>
						{option.CategoryName}
					</option>
				);
			})}
		</select>
	);
};

export default Catagory;
