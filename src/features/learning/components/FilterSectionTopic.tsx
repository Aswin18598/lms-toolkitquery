import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { setSelectedPageSize, setSelectedSearchText, useGetTopicsListQuery } from "../store";

interface IProps {
	setTopicIDAndShow: any;
	selectedTopicID: number;
}

function FilterSectionTopic({ setTopicIDAndShow, selectedTopicID }: IProps) {
	const dispatch = useDispatch();
	const { TopicLists, CourseCatagoryID } = useAppSelector((state: any) => state.learningReducer);
	const { refetch } = useGetTopicsListQuery(CourseCatagoryID, { skip: CourseCatagoryID === 0 });

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedSearchText(""));
		setTopicIDAndShow(e.target.value);
		dispatch(setSelectedPageSize(12));
	};

	useEffect(() => {
		refetch();
	}, [CourseCatagoryID]);

	return (
		<select
			value={selectedTopicID}
			placeholder="Topic"
			onChange={handleChange}
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			<option value={-1}>{"Topic (All)"}</option>
			{TopicLists?.length > 0 &&
				TopicLists?.map((GridOption: any) => {
					return (
						<option key={GridOption?.ID} value={GridOption?.ID}>
							{GridOption?.Name}
						</option>
					);
				})}
		</select>
	);
}

export default FilterSectionTopic;
