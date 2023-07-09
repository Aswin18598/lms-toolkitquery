import { ChangeEvent, useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import { useGetTechTipCategoryQuery } from "~/features/techtips/store";
import { handleCategorySubCategoryIDTopicIDPageNum, handleApply } from "~/features/techtips/store";
import { useDispatch } from "react-redux";
interface IProps {
	UserID?: string;
}
const Catagory = ({ UserID }: IProps) => {
	const dispatch = useDispatch();
	const [selectedCategory, setSelectedCategory] = useState(0);
	useGetTechTipCategoryQuery(UserID);
	const { Category } = useAppSelector((state: any) => state.techtips);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({
				CategoryID: selectedCategory,
				SubCategoryID: -1,
				TopicID: -1,
				PageNumber: 1
			})
		);
		dispatch(handleApply(false));
	}, [selectedCategory]);

	return (
		<div>
			<div className="text-sm mb-1">Catagory</div>
			<select
				value={selectedCategory}
				placeholder="Category"
				onChange={handleChange}
				className="border border-slate-100 rounded-lg h-10 bg-white border w-full px-1"
			>
				<option key={-1} value="-1">
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
		</div>
	);
};

export default Catagory;
