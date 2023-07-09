import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	getCategorySubCategoryIDTopicIDPageNum,
	handleApply,
	handleCategorySubCategoryIDTopicIDPageNum,
	useGetTechTipSubcategoryQuery,
	useGetUserPreferencesQuery,
	useSaveUserPreferenceMutation
} from "../store";

interface IProps {
	UserID: any;
}
const DefaultSubCategory = ({ UserID }: IProps) => {
	const dispatch = useDispatch();
	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const CategoryID = CategorySubCategoryIDPageNum["CategoryID"];
	const [selectedSubcategory, setSelectedSubcategory] = useState(-1);
	useGetTechTipSubcategoryQuery({ UserID: UserID, CategoryID: -1 });
	const { DefaultSubcategory, PreferenceDetails } = useAppSelector((state: any) => state.techtips);
	const [SaveUserPreference, { isLoading }] = useSaveUserPreferenceMutation();
	const { refetch } = useGetUserPreferencesQuery(UserID);
	const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubcategory(Number(e.target.value));
		const TechDetails: any = {
			UserID: Number(UserID),
			PreferredSubcategoryID: Number(e.target.value),
			CrsLayout: 0,
			ImgViewType: 0
		};
		await SaveUserPreference(TechDetails)
			.unwrap()
			.finally(() => {
				refetch();
			});
	};

	useEffect(() => {
		if (PreferenceDetails.length > 0)
			dispatch(
				handleCategorySubCategoryIDTopicIDPageNum({
					CategoryID: PreferenceDetails[0]?.CategoryID,
					SubCategoryID: PreferenceDetails[0]?.PrefSubcategory,
					TopicID: -1,
					PageNumber: 1
				})
			);
		console.log("PreferenceDetails[0]?.CategoryID", PreferenceDetails, PreferenceDetails[0]?.SubCategoryID);
	}, [PreferenceDetails]);

	return (
		<div>
			<label className="block">
				<span>SubCategory View</span>
				<select
					value={selectedSubcategory}
					placeholder="Category"
					onChange={handleChange}
					className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					{DefaultSubcategory.map((option: any, index: any) => {
						return (
							<option key={index + 1} value={option.SubCategoryID}>
								{option.Name}
							</option>
						);
					})}
				</select>
			</label>
		</div>
	);
};

export default DefaultSubCategory;
