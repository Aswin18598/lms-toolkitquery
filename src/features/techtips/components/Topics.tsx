import { ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	useGetTechTipFilterTopicQuery,
	getCategorySubCategoryIDTopicIDPageNum,
	handleCategorySubCategoryIDTopicIDPageNum,
	handleApply
} from "~/features/techtips/store";

interface IProps {
	isDisabled: boolean;
}

const Topics = ({ isDisabled }: IProps) => {
	const dispatch = useDispatch();
	const [selectedTopics, setSelectedTopics] = useState(-1);

	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const CategoryID = CategorySubCategoryIDPageNum["CategoryID"];
	const SubCategoryID = CategorySubCategoryIDPageNum["SubCategoryID"];
	useGetTechTipFilterTopicQuery({ SubCategoryID }, { skip: SubCategoryID === -1 });
	const { FilterTopic } = useAppSelector((state: any) => state.techtips);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedTopics(Number(e.target.value));
	};

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({
				CategoryID: CategoryID,
				SubCategoryID: SubCategoryID,
				TopicID: selectedTopics,
				PageNumber: 1
			})
		);
		dispatch(handleApply(false));
	}, [selectedTopics]);

	return (
		<div>
			<label className="block">
				<span>Topic</span>
				<select
					value={selectedTopics}
					placeholder="Category"
					onChange={handleChange}
					disabled={isDisabled}
					className="form-select cursor-pointer text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					<option key={-1} value="-1">
						Topics (All)
					</option>
					{SubCategoryID !== -1 &&
						FilterTopic?.map((option: any, index: any) => {
							return (
								<option key={index + 1} value={option.TopicID}>
									{option.TopicName}
								</option>
							);
						})}
				</select>
			</label>
		</div>
	);
};

export default Topics;
