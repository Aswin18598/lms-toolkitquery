import React from "react";
import SearchBox from "./SearchBox";
interface IEditAssignedLearningTabFilterProps {
	selectedTab: string;
	assignedCourseSearchText: string;
	setAssignedCourseSearchText: React.Dispatch<React.SetStateAction<string>>;
	assignedUserSearchText: string;
	setAssignedUserSearchText: React.Dispatch<React.SetStateAction<string>>;
	assignedGroupSearchText: string;
	setAssignedGroupSearchText: React.Dispatch<React.SetStateAction<string>>;
	conditionalUsersSearchText: string;
	setConditionalUsersSearchText: React.Dispatch<React.SetStateAction<string>>;
}

function EditAssignedLearningTabFilter(props: IEditAssignedLearningTabFilterProps) {
	const {
		selectedTab,
		assignedCourseSearchText,
		setAssignedCourseSearchText,
		assignedUserSearchText,
		setAssignedUserSearchText,
		assignedGroupSearchText,
		setAssignedGroupSearchText,
		conditionalUsersSearchText,
		setConditionalUsersSearchText
	} = props;
	return (
		<div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
			{selectedTab !== "Groups" && selectedTab !== "Users" && selectedTab !== "Conditional" && (
				<SearchBox
					value={assignedCourseSearchText}
					setState={setAssignedCourseSearchText}
					placeholder={"Search by title..."}
				/>
			)}
			{selectedTab === "Users" && (
				<div className="my-1.5 w-full">
					<SearchBox value={assignedUserSearchText} setState={setAssignedUserSearchText} />
				</div>
			)}
			{selectedTab === "Groups" && (
				<SearchBox
					value={assignedGroupSearchText}
					setState={setAssignedGroupSearchText}
					placeholder={"Search by name..."}
				/>
			)}
			{selectedTab === "Conditional" && (
				<SearchBox
					value={conditionalUsersSearchText}
					setState={setConditionalUsersSearchText}
					placeholder={"Search..."}
				/>
			)}
		</div>
	);
}

export default EditAssignedLearningTabFilter;
