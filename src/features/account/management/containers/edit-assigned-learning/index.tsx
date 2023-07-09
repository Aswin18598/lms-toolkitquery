import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import { useAppSelector } from "~/config/store";
import { notify } from "~/helpers";
import { ILPItemActionBody } from "../../@types";
import AddNewIntegration from "../../components/AddNewIntegration";
import AssessmentsTabContentTable from "../../components/AssessmentsTabContentTable";
import AssignableItemsTabs from "../../components/AssignableItemsTabs";
import AssignableTabFilterSection from "../../components/AssignableTabFilterSection";
// import AssignedAggregationsTabContentTable from "../../components/AssignedAggregationsTabContentTable";
import AssignedCoursesTabContentTable from "../../components/AssignedCoursesTabContentTable";
import AssignedPathConditionalUsersTabContentTable from "../../components/AssignedPathConditionalUsersTabContentTable";
import AssignedPathGroupsTabContentTable from "../../components/AssignedPathGroupsTabContentTable";
import AssignedPathTabs from "../../components/AssignedPathTabs";
import AssignedPathUsersTabContentTable from "../../components/AssignedPathUsersTabContentTable";
import AssignLearningPathSection from "../../components/AssignLearningPathSection";
import CategorySection from "../../components/CategorySection";
import ConditionalTabContent from "../../components/ConditionalTabContent";
import CoursesTabContentTable from "../../components/CoursesTabContentTable";
import EditAssignedLearningAssignmentType from "../../components/EditAssignedLearningAssignmentType";
import EditAssignedLearningDescription from "../../components/EditAssignedLearningDescription";
import EditAssignedLearningSpinner from "../../components/EditAssignedLearningSpinner";
import EditAssignedLearningTabFilter from "../../components/EditAssignedLearningTabFilter";
import EditAssignedLearningTitle from "../../components/EditAssignedLearningTitle";
import GroupsTabContentTable from "../../components/GroupsTabContentTable";
import IntegrationTabContentTable from "../../components/IntegrationTabContentTable";
import SendEmailNotification from "../../components/SendEmailNotification";
import SubCategorySection from "../../components/SubCategorySection";
import TabPanel from "../../components/TabPanel";
import UsersTabContentTable from "../../components/UsersTabContentTable";
import {
	assignedLearning,
	useAssessmentsForLearningPathQuery,
	useAssignedGroupForLearningPathQuery,
	useAssignedAggregationsForLearningPathQuery,
	useAssignedUsersForLearningPathQuery,
	useCategoriesListQuery,
	useConditionalUsersForLearningPathQuery,
	useDynamicFieldOptionsQuery,
	useGroupListForLearningPathQuery,
	useIntegrationsForLearningPathQuery,
	useLazyAssignedCoursesAndAssessmentsQuery,
	useCoursesForLearningPathQuery,
	useLearningPathActionsInputMutation,
	useLearningPathItemActionMutation,
	useSubCategoriesQuery,
	useSetDynamicGroupAttributeMutation,
	useDynamicGroupInfoLpQuery,
	useUnAssignedGroupsForLearningPathQuery,
	useLazyUserListForLearningPathQuery
} from "../../store";
interface IDynamicFieldOptions {
	[key: number | string]: [
		{
			Txt: string;
			Val: string;
		}
	];
}
interface IConditionalUserList {
	userRole?: string | number | any;
	filterOption?: string | number;
	dynamicFieldOption?: string | number;
	condition?: string | number;
}

function EditAssignedLearning() {
	const navigate = useNavigate();
	const {
		categories,
		subCategoriesList,
		coursesForLearningPath,
		coursesForLearningPathEmptyMessage,
		assessmentsForLearningPath,
		assessmentsForLearningPathEmptyMessage,
		integrationsForLearningPath,
		integrationsForLearningPathEmptyMessage,
		userListsForLearningPath,
		userListsForLearningPathEmptyMessage,
		groupListsForLearningPath,
		unAssignedGroupsForLearningPath,
		assignedUsersForLearningPath,
		assignedUsersForLearningPathEmptyMessage,
		assignedGroupsForLearningPath,
		// assignedAggregationsForLearningPath,
		assignedGroupsForLearningPathEmptyMessage,
		conditionalUsersForLearningPath,
		dynamicFieldOptions
	} = useAppSelector(assignedLearning);
	const location = useLocation();
	const [category, setCategory] = useState(0);
	const [isChecked, setIsChecked] = useState(location.state?.ForceOrder || false);
	const [conditionalUsersLists, setConditionalUsersList] = useState<IConditionalUserList[]>([]);
	const [conditionalTabDynamicFieldOptions, setConditionalTabDynamicFieldOptions] = useState<IDynamicFieldOptions>(
		{}
	);
	const [subCategory, setSubCategory] = useState(0);
	const [selectedTab, setSelectedTab] = useState<string>("Courses");
	const [courseSearchText, setCourseSearchText] = useState("");
	const [integrationSearchText, setIntegrationSearchText] = useState("");
	const [userSearchText, setUserSearchText] = useState("");
	const [groupSearchText, setGroupSearchText] = useState("");
	const [assignedCourseSearchText, setAssignedCourseSearchText] = useState("");
	const [assignedUserSearchText, setAssignedUserSearchText] = useState("");
	const [assignedGroupSearchText, setAssignedGroupSearchText] = useState("");
	const [assessmentsSearchText, setAssessmentsSearchText] = useState("");
	const [conditionalUsersSearchText, setConditionalUsersSearchText] = useState("");
	const [userSelectOption, setUserSelectOption] = useState(0);
	const [isAddNewIntegrationClicked, setIsAddNewIntegrationClicked] = useState(false);
	const [isSendEmailNotificationClicked, setIsSendEmailNotificationClicked] = useState(false);
	const [isFieldEdited, setIsFieldEdited] = useState(false);
	const [assignableUsersPageNumber, setAssignableUsersPageNumber] = useState<number>(1);
	const [assignableUsersPageSize, setAssignableUsersPageSize] = useState<any>(10);
	const [newAssignedLearningDetails, setNewAssignedLearningDetails] = useState({
		title: location.state?.Name || "",
		description: location.state?.Description || "",
		type: location.state?.TypeID || 1
	});
	const [startDateValue, setStartDateValue] = useState<{ startDate: any; endDate: any }>({
		startDate: null,
		endDate: null
	});
	const [endDateValue, setEndDateValue] = useState<{ startDate: any; endDate: any }>({
		startDate: null,
		endDate: null
	});
	useCategoriesListQuery({}); // query for category dropdown
	const { refetch: refetchSubCategories } = useSubCategoriesQuery({ CategoryID: category }); // query for sub-category dropdown
	const { isFetching: isCoursesForLearningFetching, refetch: refetchCourse } = useCoursesForLearningPathQuery({
		CategoryID: category,
		SubcategoryID: subCategory
	}); // courseTab content query
	const { isFetching: isAssessmentsForLearningPathFetching, refetch: refetchAssessments } =
		useAssessmentsForLearningPathQuery({ CategoryID: category, SubcategoryID: subCategory });
	const [triggerFetchAssignableUsers, { isFetching: isUsersListsForLearningFetching }] =
		useLazyUserListForLearningPathQuery({}); // usersTab content
	const { isFetching: isIntegrationsForLearningFetching, refetch: refetchIntegrations } =
		useIntegrationsForLearningPathQuery({}); // integrationTab content
	useDynamicFieldOptionsQuery({});
	useGroupListForLearningPathQuery({}); // groupsTab content
	const { isFetching: isUnAssignedGroupFetching } = useUnAssignedGroupsForLearningPathQuery({
		PathID: location.state?.PathID
	}); // groupsTab content
	const { isFetching: isConditionalUsersForLearningFetching, refetch: refetchConditionalUsers } =
		useConditionalUsersForLearningPathQuery({
			PathID: location.state?.PathID
		}); // conditionalTab content
	const { refetch: refetchDynamicGroupInfoLP } = useDynamicGroupInfoLpQuery({ PathID: location.state?.PathID });

	const [refetchAssignedCourses] = useLazyAssignedCoursesAndAssessmentsQuery();
	const { isFetching: isAssignedUsersForLearningFetching, refetch: refetchAssignedUsers } =
		useAssignedUsersForLearningPathQuery({
			PathID: location.state?.PathID
		}); //assigneduserstabe content
	const { isFetching: isAssignedGroupForLearningFetching } = useAssignedGroupForLearningPathQuery({
		PathID: location.state?.PathID
	}); //assignedgroupstab content
	const { isFetching: isAssignedAggregationsForLearningFetching } = useAssignedAggregationsForLearningPathQuery({
		PathID: location.state?.PathID
	}); //assignedgroupstab content
	const [triggerLPItemAction, { isLoading: isLPItemActionLoading }] = useLearningPathItemActionMutation();
	const [triggerSetDynamicGroupAttr] = useSetDynamicGroupAttributeMutation();
	const [learningPathActionInput, { isLoading: isLearningPathActionInputLoading }] =
		useLearningPathActionsInputMutation();

	const renderTabValue = useMemo(() => {
		let value = "Courses";
		if (selectedTab === "Assessments") {
			value = "Assessments";
		}
		if (selectedTab === "Aggregations") {
			value = "Aggregations";
		}
		return value;
	}, [selectedTab]);
	const handleStartDateValueChange = (newValue: any) => {
		setStartDateValue(newValue);
	};
	const handleEndDateValueChange = (newValue: any) => {
		setEndDateValue(newValue);
	};
	const assignableItemsTabs = ["Courses", "Assessments", "Aggregations", "Users", "Groups", "Conditional"];

	const handleUpdateLPActionInput = () => {
		if (!newAssignedLearningDetails.title) {
			notify("create_lp_action", { Message: "Please Enter Title" });
			return undefined;
		}
		if (!newAssignedLearningDetails.description) {
			notify("create_lp_action", { Message: "Please Enter Description" });
			return undefined;
		}
		learningPathActionInput({
			Action: "U",
			Name: newAssignedLearningDetails?.title,
			TypeID: newAssignedLearningDetails?.type,
			PathID: location.state.PathID,
			Description: newAssignedLearningDetails?.description,
			ForceOrder: isChecked,
			Subcategory: subCategory
		})
			.then((response: any) => {
				toast.success(response?.data?.Message, { id: "assignNewLP_success_message" });
			})
			.catch(error => {
				notify("assignNewLP_error_message", error?.data);
			});
	};
	useEffect(() => {
		if (!location.state?.PathID) {
			navigate("/account/management/learning-path");
		}
	}, [location.state?.PathID]);
	useEffect(() => {
		setSubCategory(0);
		refetchSubCategories();
		refetchCourse();
		refetchAssessments();
	}, [category]);
	useEffect(() => {
		refetchCourse();
	}, [subCategory]);
	useEffect(() => {
		if (userSearchText) {
			setAssignableUsersPageNumber(1);
			setAssignableUsersPageSize(10);
		}
		triggerFetchAssignableUsers({
			GroupID: userSelectOption,
			PageNumber: assignableUsersPageNumber,
			PageSize: assignableUsersPageSize,
			searchText: userSearchText || ""
		});
	}, [userSelectOption, assignableUsersPageNumber, assignableUsersPageSize]);
	useEffect(() => {
		triggerFetchAssignableUsers({
			GroupID: userSelectOption,
			PageNumber: assignableUsersPageNumber,
			PageSize: assignableUsersPageSize,
			searchText: userSearchText
		});
	}, []);

	const handleAddMoreConditionalUsers = () => {
		const newCondition = { userRole: "", filterOption: 1, condition: 6, dynamicFieldOption: "" };
		setConditionalUsersList(prev => [...prev, newCondition]);
	};
	const handleSetStartDate = async (isClear: boolean, date = "") => {
		const data: ILPItemActionBody = {
			Action: "SETSTART",
			PathID: location.state.PathID,
			ItemID: 0,
			ItemSequence: 0,
			ItemType: 0
		};
		if (!isClear) {
			data.StartDate = date;
		}
		try {
			const response: any = await triggerLPItemAction({
				...data
			});
			if (response?.error?.data?.Message) {
				notify("setStartDate", { Message: response?.error?.data?.Message });
				return undefined;
			}
			refetchAssignedCourses({ PathID: location.state?.PathID, PageNumber: 1, PageSize: 10 });
		} catch (error: any) {
			notify("setdue_error_message", { Message: error?.error?.data?.Message });
			console.error(error);
		}
	};
	const handleSetDueDate = async (isClear: boolean, date = "") => {
		const data: ILPItemActionBody = {
			Action: "SETDUE",
			PathID: location.state?.PathID,
			ItemID: 0,
			ItemSequence: 0,
			ItemType: 0
		};
		if (!isClear) {
			data.DueDate = date;
		}
		try {
			const response: any = await triggerLPItemAction({
				...data
			});
			if (response?.error?.data?.Message) {
				notify("setDueDate", { Message: response?.error?.data?.Message });
				return undefined;
			}
			refetchAssignedCourses({ PathID: location.state?.PathID, PageNumber: 1, PageSize: 10 });
		} catch (error: any) {
			notify("setdue_error_message", { Message: error?.error?.data?.Message });
			console.error(error);
		}
	};
	const handleEnforcement = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(event.target.checked);
		try {
			const response: any = await learningPathActionInput({
				ForceOrder: event.target.checked,
				PathID: location.state.PathID,
				Action: "F",
				Name: location.state?.Name
			});
			if (response.data?.Message) {
				toast.success(response.data?.Message, { id: "enforcement_success_message" });
			}
		} catch (error: any) {
			notify("enforcement_error_message", { Message: error?.error?.data?.Message });
			console.log("error", error);
		}
	};
	const handleCreateConditionlalUser = async () => {
		try {
			let AttrID = [];
			for (const element of conditionalUsersLists) {
				const FieldID = element.userRole;
				const Filter = element.filterOption;
				const ConditionID = element.condition;
				const DynamicFieldOption = element.dynamicFieldOption;
				AttrID.push(`0,${FieldID},${DynamicFieldOption},${Filter},${ConditionID}`);
			}
			await triggerSetDynamicGroupAttr({
				PathID: location.state.PathID,
				MainCondID: "6",
				AttrInfo: AttrID
			});
			refetchConditionalUsers();
			refetchDynamicGroupInfoLP();
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleCancellConditionalUsers = async () => {
		setConditionalUsersList([]);
		setConditionalTabDynamicFieldOptions({});
		try {
			await triggerSetDynamicGroupAttr({
				PathID: location.state.PathID,
				MainCondID: "6",
				AttrInfo: []
			});
			refetchConditionalUsers();
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleAssignableUsersSearchIconClick = async () => {
		try {
			setAssignableUsersPageNumber(1);
			setAssignableUsersPageSize(10);
			await triggerFetchAssignableUsers({
				GroupID: userSelectOption,
				PageNumber: 1,
				PageSize: 10,
				searchText: userSearchText || ""
			});
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleSearchAssignableUsersOnBlur = async (event: any) => {
		if (event.key === "Enter") {
			try {
				setAssignableUsersPageNumber(1);
				setAssignableUsersPageSize(10);
				await triggerFetchAssignableUsers({
					GroupID: userSelectOption,
					PageNumber: 1,
					PageSize: 10,
					searchText: userSearchText || ""
				});
			} catch (error) {
				console.error("error", error);
			}
		}
	};
	return (
		<section className="w-full h-full px-[var(--margin-x)] sm:px-8]">
			{/* loader */}
			<EditAssignedLearningSpinner
				isLearningPathActionInputLoading={isLearningPathActionInputLoading}
				isLPItemActionLoading={isLPItemActionLoading}
			/>
			<div className="flex items-center flex-col sm:flex-row gap-3 justify-between py-4 md:py-5 lg:py-6">
				<div className="flex items-center self-start sm:self-center">
					<h2 className="text-xl font-medium  text-slate-800 dark:text-navy-50 lg:text-2xl">
						Edit Learning Assignment
					</h2>
				</div>
				<div className="flex items-center  self-start sm:self-center gap-4">
					<Link to={"/account/management/learning-path"}>
						<button className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4">
							Back
						</button>
					</Link>
					<button
						className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
						onClick={() => setIsSendEmailNotificationClicked(true)}
					>
						Send Email Notification
					</button>
				</div>
			</div>
			<section className="w-full p-5 rounded-md bg-white flex flex-col gap-4 mb-5">
				{/* title section */}
				<EditAssignedLearningTitle
					newAssignedLearningDetails={newAssignedLearningDetails}
					setNewAssignedLearningDetails={setNewAssignedLearningDetails}
					setIsFieldEdited={setIsFieldEdited}
				/>
				{/* description section */}
				<EditAssignedLearningDescription
					newAssignedLearningDetails={newAssignedLearningDetails}
					setNewAssignedLearningDetails={setNewAssignedLearningDetails}
					setIsFieldEdited={setIsFieldEdited}
				/>
				{/* conditional Update Button section */}
				<AssignLearningPathSection
					handleUpdateLPActionInput={handleUpdateLPActionInput}
					isFieldEdited={isFieldEdited}
					setIsFieldEdited={setIsFieldEdited}
				/>
				<p className="text-sm font-medium mt-1">Select Assignment Type</p>
				<EditAssignedLearningAssignmentType
					newAssignedLearningDetails={newAssignedLearningDetails}
					setNewAssignedLearningDetails={setNewAssignedLearningDetails}
				/>
				{/* date section */}
				<div className="w-full grid gap-4 sm:grid-cols-4 grid-cols-1">
					{/* start date section */}
					<div className="w-full">
						<p className="text-sm font-medium mb-1">Start Date</p>
						<div className="flex">
							<Datepicker
								asSingle={true}
								value={startDateValue}
								readOnly
								onChange={handleStartDateValueChange}
								useRange={false}
								inputClassName={
									"border  rounded-none rounded-tl-md rounded-bl-md focus:outline-none focus:border-primary focus:shadow-none focus:ring-0"
								}
								toggleIcon={() => <Icon icon={"uil:calender"} />}
								placeholder={"Start date"}
								minDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
								displayFormat={"MM-DD-YYYY"}
							/>
							<button
								onClick={() => {
									setStartDateValue({
										startDate: null,
										endDate: null
									});
								}}
								className="btn rounded-l-none bg-error px-3 font-medium text-white hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div className="flex items-center gap-1 my-2">
							<button
								className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4"
								onClick={() =>
									handleSetStartDate(
										false,
										new Date(
											new Date(
												new Date(startDateValue.startDate).setDate(
													new Date(startDateValue.startDate).getDate() + 1
												)
											).setHours(0)
										).toISOString()
									)
								}
								disabled={!startDateValue.startDate}
							>
								Set Start Dates
							</button>
							<button
								className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
								onClick={() => handleSetStartDate(true)}
							>
								Clear Start Dates
							</button>
						</div>
					</div>
					{/* end date section */}
					<div className="w-full">
						<p className="text-sm font-medium mb-1">End Date</p>
						<div className="flex sm:items-center items-start gap-5 flex-col sm:flex-row">
							<div className="flex w-full">
								<Datepicker
									asSingle={true}
									value={endDateValue}
									onChange={handleEndDateValueChange}
									readOnly
									useRange={false}
									inputClassName={
										"border  rounded-none rounded-tl-md rounded-bl-md focus:outline-none focus:border-primary focus:shadow-none focus:ring-0"
									}
									toggleIcon={() => <Icon icon={"uil:calender"} />}
									placeholder={"End date"}
									minDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
									displayFormat={"MM-DD-YYYY"}
								/>
								<button
									onClick={() => setEndDateValue({ startDate: null, endDate: null })}
									className="btn rounded-l-none bg-error px-3 font-medium text-white hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>
						<div className="flex items-center gap-1 my-2">
							<button
								className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4"
								onClick={() =>
									handleSetDueDate(
										false,
										new Date(
											new Date(
												new Date(endDateValue.endDate).setDate(
													new Date(endDateValue.endDate).getDate() + 1
												)
											).setHours(0)
										).toISOString()
									)
								}
								disabled={!endDateValue.endDate}
							>
								Set Due Dates
							</button>
							<button
								className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
								onClick={() => handleSetDueDate(true)}
							>
								Clear Due Dates
							</button>
						</div>
					</div>
					<div className="w-full flex gap-2 items-center self-center">
						<div className="relative">
							<input
								type="checkbox"
								name={"user"}
								id={`enforce`}
								className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
								onChange={handleEnforcement}
								checked={isChecked}
							/>
							<label
								className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
								htmlFor={`enforce`}
							></label>
						</div>
						<label htmlFor="enforce" className="whitespace-nowrap ml-4">
							Enforce the order of the learning paths
						</label>
					</div>
				</div>
				{/* learning assignment details section */}
				<p className="text-md font-medium text-slate-800 dark:text-navy-50 lg:text-md+">
					Learning Assignment Details{" "}
				</p>
				<div className="w-full grid gap-4 sm:grid-cols-4 grid-cols-1">
					<CategorySection category={category} setCategory={setCategory} categories={categories} />
					<SubCategorySection
						category={category}
						subCategory={subCategory}
						setSubCategory={setSubCategory}
						subCategoriesList={subCategoriesList}
					/>
				</div>
				{/* Assignable items and assigned path section */}
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="w-full">
						<p className="text-md font-medium text-slate-800 dark:text-navy-50 lg:text-md+">
							Assignable Items
						</p>
						<div className="bg-body-background rounded-md p-5 w-full my-1.5">
							<AssignableItemsTabs
								assignableItemsTabs={assignableItemsTabs}
								selectedTab={selectedTab}
								setSelectedTab={setSelectedTab}
							/>
							<AssignableTabFilterSection
								selectedTab={selectedTab}
								courseSearchText={courseSearchText}
								setCourseSearchText={setCourseSearchText}
								integrationSearchText={integrationSearchText}
								setIntegrationSearchText={setIntegrationSearchText}
								setIsAddNewIntegrationClicked={setIsAddNewIntegrationClicked}
								userSearchText={userSearchText}
								setUserSearchText={setUserSearchText}
								groupListsForLearningPath={groupListsForLearningPath}
								groupSearchText={groupSearchText}
								setGroupSearchText={setGroupSearchText}
								assessmentsSearchText={assessmentsSearchText}
								setAssessmentsSearchText={setAssessmentsSearchText}
								userSelectOption={userSelectOption}
								setUserSelectOption={setUserSelectOption}
								handleSearchIconClick={handleAssignableUsersSearchIconClick}
								handleSearchAssignableUsersOnBlur={handleSearchAssignableUsersOnBlur}
							/>
							<div className="tab-content" id="tabs-tabContent">
								<TabPanel selectedTab={selectedTab} value={"Courses"}>
									<CoursesTabContentTable
										coursesForLearningPath={coursesForLearningPath}
										isCoursesForLearningFetching={isCoursesForLearningFetching}
										coursesForLearningPathEmptyMessage={coursesForLearningPathEmptyMessage}
										text={courseSearchText}
										category={category}
										subCategory={subCategory}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Assessments"}>
									<AssessmentsTabContentTable
										assessmentsForLearningPath={assessmentsForLearningPath}
										assessmentsForLearningPathEmptyMessage={assessmentsForLearningPathEmptyMessage}
										isAssessmentsForLearningPathFetching={isAssessmentsForLearningPathFetching}
										text={assessmentsSearchText}
										category={category}
										subCategory={subCategory}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Aggregations"}>
									<IntegrationTabContentTable
										integrationsForLearningPath={integrationsForLearningPath}
										integrationsForLearningPathEmptyMessage={
											integrationsForLearningPathEmptyMessage
										}
										isIntegrationsForLearningFetching={isIntegrationsForLearningFetching}
										text={integrationSearchText}
										refetchIntegrations={refetchIntegrations}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Users"}>
									<UsersTabContentTable
										isUsersListsForLearningFetching={isUsersListsForLearningFetching}
										userListsForLearningPath={userListsForLearningPath}
										userListsForLearningPathEmptyMessage={userListsForLearningPathEmptyMessage}
										refetchAssignedUsers={refetchAssignedUsers}
										pageNumber={assignableUsersPageNumber}
										pageSize={assignableUsersPageSize}
										setPageNumber={setAssignableUsersPageNumber}
										setPageSize={setAssignableUsersPageSize}
										userSearchText={userSearchText}
										userSelectOption={userSelectOption}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Groups"}>
									<GroupsTabContentTable
										isUnAssignedGroupFetching={isUnAssignedGroupFetching}
										unAssignedGroupsForLearningPath={unAssignedGroupsForLearningPath}
										text={groupSearchText}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Conditional"}>
									<ConditionalTabContent
										conditionalUsersForLearningPath={conditionalUsersLists}
										setConditionalUsersList={setConditionalUsersList}
										conditionalTabDynamicFieldOptions={conditionalTabDynamicFieldOptions}
										setConditionalTabDynamicFieldOptions={setConditionalTabDynamicFieldOptions}
										refetchConditionalUsers={refetchConditionalUsers}
									/>
									<div className="w-full mt-4">
										<button
											className="flex gap-1 text-primary items-center text-sm font-semibold"
											onClick={handleAddMoreConditionalUsers}
										>
											<Icon icon={"material-symbols:add"} />
											Add Condition
										</button>
									</div>
									<div className="flex items-center gap-4 mt-2">
										<button
											className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4"
											onClick={handleCancellConditionalUsers}
										>
											Cancel
										</button>
										<button
											className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
											onClick={handleCreateConditionlalUser}
										>
											Update
										</button>
									</div>
								</TabPanel>
							</div>
						</div>
					</div>
					{/* assigned path section */}
					<div className="w-full">
						<p className="text-md font-medium text-slate-800 dark:text-navy-50 lg:text-md+">
							Assigned Path
						</p>
						<div className="bg-body-background rounded-md p-5 w-full my-1.5">
							<AssignedPathTabs selectedTab={selectedTab} renderTabValue={renderTabValue} />
							<EditAssignedLearningTabFilter
								selectedTab={selectedTab}
								assignedCourseSearchText={assignedCourseSearchText}
								setAssignedCourseSearchText={setAssignedCourseSearchText}
								assignedUserSearchText={assignedUserSearchText}
								setAssignedUserSearchText={setAssignedUserSearchText}
								assignedGroupSearchText={assignedGroupSearchText}
								setAssignedGroupSearchText={setAssignedGroupSearchText}
								conditionalUsersSearchText={conditionalUsersSearchText}
								setConditionalUsersSearchText={setConditionalUsersSearchText}
							/>
							<div className="tab-content" id="tabs-subtabContent">
								<TabPanel selectedTab={selectedTab} value={renderTabValue}>
									<AssignedCoursesTabContentTable text={assignedCourseSearchText} />
								</TabPanel>
								{/* <TabPanel selectedTab={selectedTab} value={"Aggregations"}>
									<AssignedAggregationsTabContentTable
										isAssignedAggregationsForLearningFetching={
											isAssignedAggregationsForLearningFetching
										}
										assignedAggregationsForLearningPath={assignedAggregationsForLearningPath}
										text={assignedAggregationsSearchText}
									/>
								</TabPanel> */}
								<TabPanel selectedTab={selectedTab} value={"Users"}>
									<AssignedPathUsersTabContentTable
										isAssignedUsersForLearningFetching={isAssignedUsersForLearningFetching}
										assignedUsersForLearningPath={assignedUsersForLearningPath}
										assignedUsersForLearningPathEmptyMessage={
											assignedUsersForLearningPathEmptyMessage
										}
										text={assignedUserSearchText}
										refetchAssignedUsers={refetchAssignedUsers}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Groups"}>
									<AssignedPathGroupsTabContentTable
										isAssignedGroupForLearningFetching={isAssignedGroupForLearningFetching}
										assignedGroupsForLearningPath={assignedGroupsForLearningPath}
										assignedGroupsForLearningPathEmptyMessage={
											assignedGroupsForLearningPathEmptyMessage
										}
										text={assignedGroupSearchText}
									/>
								</TabPanel>
								<TabPanel selectedTab={selectedTab} value={"Conditional"}>
									<AssignedPathConditionalUsersTabContentTable
										isConditionalUsersForLearningFetching={isConditionalUsersForLearningFetching}
										conditionalUsersForLearningPath={conditionalUsersForLearningPath}
										text={conditionalUsersSearchText}
									/>
								</TabPanel>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* modals */}
			<AddNewIntegration
				isAddNewIntegrationClicked={isAddNewIntegrationClicked}
				setIsAddNewIntegrationClicked={setIsAddNewIntegrationClicked}
				refetchIntegrations={refetchIntegrations}
				dynamicFieldOptions={dynamicFieldOptions}
			/>
			<SendEmailNotification
				isSendEmailNotificationClicked={isSendEmailNotificationClicked}
				setIsSendEmailNotificationClicked={setIsSendEmailNotificationClicked}
			/>
		</section>
	);
}

export default EditAssignedLearning;
