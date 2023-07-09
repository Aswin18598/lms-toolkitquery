import { Icon } from "@iconify/react";
import React from "react";
import { IGroupListsForLearningPath } from "../@types";
import SearchBox from "./SearchBox";
interface IAssignableTabFilterSectionProps {
	selectedTab: string;
	courseSearchText: string;
	setCourseSearchText: React.Dispatch<React.SetStateAction<string>>;
	integrationSearchText: string;
	setIntegrationSearchText: React.Dispatch<React.SetStateAction<string>>;
	setIsAddNewIntegrationClicked: React.Dispatch<React.SetStateAction<boolean>>;
	userSearchText: string;
	setUserSearchText: React.Dispatch<React.SetStateAction<string>>;
	groupListsForLearningPath: IGroupListsForLearningPath;
	groupSearchText: string;
	setGroupSearchText: React.Dispatch<React.SetStateAction<string>>;
	assessmentsSearchText: string;
	setAssessmentsSearchText: React.Dispatch<React.SetStateAction<string>>;
	userSelectOption: number | string;
	setUserSelectOption: React.Dispatch<React.SetStateAction<number>>;
	handleSearchIconClick?: () => Promise<void>;
	handleSearchAssignableUsersOnBlur?: (event: any) => Promise<void>;
}
function AssignableTabFilterSection(props: IAssignableTabFilterSectionProps) {
	const {
		selectedTab,
		courseSearchText,
		setCourseSearchText,
		integrationSearchText,
		setIntegrationSearchText,
		setIsAddNewIntegrationClicked,
		userSearchText,
		setUserSearchText,
		groupListsForLearningPath,
		groupSearchText,
		setGroupSearchText,
		assessmentsSearchText,
		setAssessmentsSearchText,
		userSelectOption,
		setUserSelectOption,
		handleSearchIconClick,
		handleSearchAssignableUsersOnBlur
	} = props;
	const titlePlaceholder = "Search by title...";
	return (
		<div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
			{selectedTab === "Courses" && (
				<SearchBox value={courseSearchText} setState={setCourseSearchText} placeholder={titlePlaceholder} />
			)}
			{selectedTab === "Assessments" && (
				<SearchBox
					value={assessmentsSearchText}
					setState={setAssessmentsSearchText}
					placeholder={titlePlaceholder}
				/>
			)}
			{selectedTab === "Aggregations" && (
				<>
					<SearchBox
						value={integrationSearchText}
						setState={setIntegrationSearchText}
						placeholder={titlePlaceholder}
					/>
					<div className="w-full flex items-center justify-end">
						<button
							className="flex gap-1 text-primary items-center text-sm font-semibold"
							onClick={() => setIsAddNewIntegrationClicked(true)}
						>
							<Icon icon={"material-symbols:add"} />
							Add new
						</button>
					</div>
				</>
			)}
			{selectedTab === "Users" && (
				<>
					<SearchBox
						value={userSearchText}
						setState={setUserSearchText}
						placeholder={"Search Email"}
						handleClick={handleSearchIconClick}
						isUsersTabContent={true}
						handleBlur={handleSearchAssignableUsersOnBlur}
					/>
					<div className="w-full">
						<select
							value={userSelectOption}
							placeholder="All"
							onChange={e => setUserSelectOption(+e.target.value)}
							className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
						>
							{groupListsForLearningPath?.GroupListByManager?.map(
								(
									g: {
										GroupID: number;
										GroupName: string;
										Type: number;
									},
									i: number
								) => (
									<option value={g.GroupID} key={i}>
										{g.GroupName}
									</option>
								)
							)}
						</select>
					</div>
				</>
			)}
			{selectedTab === "Groups" && (
				<SearchBox value={groupSearchText} setState={setGroupSearchText} placeholder={"Search by name..."} />
			)}
		</div>
	);
}

export default AssignableTabFilterSection;
