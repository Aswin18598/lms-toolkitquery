import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { setSelectedCatagoryID } from "../store";

interface IProps {
	setCategoryIdAndShow: any;
	selectedCatagoryID: number;
	setLoader: any;
	setSkip: any;
}

function FilterSectionCategory({ setCategoryIdAndShow, selectedCatagoryID, setLoader, setSkip }: IProps) {
	const { CategoryLists } = useAppSelector((state: any) => state.learningReducer);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLoader(true);
		dispatch(setSelectedCatagoryID(e.target.value));
		setCategoryIdAndShow(e.target.value);
		setSkip(false);
	};
	const dispatch = useDispatch();

	return (
		<select
			value={selectedCatagoryID}
			placeholder="Category"
			onChange={handleChange}
			className="bg-white border w-full rounded-md outline-none py-2 px-2 pr-6 cursor-pointer"
		>
			<option value={-1}>{"Category (All)"}</option>
			{CategoryLists?.length > 0 &&
				CategoryLists?.map((GridOption: any, index: number) => {
					return (
						<option key={GridOption?.CategoryID + "" + index} value={GridOption?.CategoryID}>
							{GridOption?.CategoryName}
						</option>
					);
				})}
		</select>
	);
}

export default FilterSectionCategory;
