import { Icon } from "@iconify/react";
import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import {
	assignedLearning,
	useLazyConditionalUsersDynamicFieldOptionsQuery,
	useSetDynamicGroupAttributeMutation
} from "../store";

interface IConditionalUserList {
	userRole?: string | number | any;
	filterOption?: string | number;
	dynamicFieldOption?: string | number;
	condition?: string | number;
}
interface IDynamicFieldOptions {
	[key: number | string]: [
		{
			Txt: string;
			Val: string;
		}
	];
}
interface ISavedConditions {
	ConditionID?: number;
	FieldID?: number;
	Filter?: string | number;
	ID?: number;
	MainConditionID?: number;
}
interface IConditionalTabContentProps {
	conditionalUsersForLearningPath: IConditionalUserList[];
	setConditionalUsersList: React.Dispatch<React.SetStateAction<IConditionalUserList[]>>;
	conditionalTabDynamicFieldOptions: IDynamicFieldOptions;
	setConditionalTabDynamicFieldOptions: React.Dispatch<React.SetStateAction<IDynamicFieldOptions>>;
	refetchConditionalUsers: () => void;
}

function ConditionalTabContent(props: IConditionalTabContentProps) {
	const location = useLocation();
	const {
		conditionalUsersForLearningPath,
		setConditionalUsersList,
		conditionalTabDynamicFieldOptions,
		setConditionalTabDynamicFieldOptions,
		refetchConditionalUsers
	} = props;
	const { dynamicGroupInfoLp } = useAppSelector(assignedLearning);
	const [triggerFetchDynamicFieldOptions] = useLazyConditionalUsersDynamicFieldOptionsQuery();
	const [triggerSetDynamicGroupAttr] = useSetDynamicGroupAttributeMutation();
	const inputFieldsConditions = useMemo(() => [8, 9, 10, 11, 12, 13, 14, 15], []);
	useEffect(() => {
		if (dynamicGroupInfoLp?.GroupConditions?.length) {
			const savedConditions = dynamicGroupInfoLp?.GroupConditions?.map((c: ISavedConditions) => ({
				userRole: c.FieldID,
				filterOption: c.ConditionID,
				dynamicFieldOption: c.Filter,
				condition: c.MainConditionID
			}));

			setConditionalUsersList(savedConditions);
			fetchSavedDynamicFieldOptions();
		}
	}, [dynamicGroupInfoLp?.GroupConditions?.length]);
	const fetchSavedDynamicFieldOptions = async () => {
		try {
			const savedConditionalTabDynamicFieldOptions: IDynamicFieldOptions = {};
			for (let i = 0; i < dynamicGroupInfoLp?.GroupConditions?.length; i++) {
				const response: any = await triggerFetchDynamicFieldOptions({
					FieldID: dynamicGroupInfoLp?.GroupConditions[i]?.FieldID
				});
				savedConditionalTabDynamicFieldOptions[i] = response?.data?.Data;
			}
			setConditionalTabDynamicFieldOptions(savedConditionalTabDynamicFieldOptions);
		} catch (error) {
			console.error("error", error);
		}
	};
	const hanldeUserRoleChange = async (event: any, index: any) => {
		const fieldId = +event.target.value;
		const tempConditionalUsersLists = [...conditionalUsersForLearningPath];
		tempConditionalUsersLists[index].userRole = fieldId;
		tempConditionalUsersLists[index].dynamicFieldOption = "";
		setConditionalUsersList(tempConditionalUsersLists);
		try {
			const response: any = await triggerFetchDynamicFieldOptions({ FieldID: fieldId });
			setConditionalTabDynamicFieldOptions(prev => ({ ...prev, [index]: response?.data?.Data }));
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleRemoveConUser = async (index: number) => {
		const tempConditionalUsersLists = [...conditionalUsersForLearningPath];
		const tempDynamicFieldOptions = { ...conditionalTabDynamicFieldOptions };
		delete tempDynamicFieldOptions[`${index}`];
		tempConditionalUsersLists.splice(index, 1);
		setConditionalTabDynamicFieldOptions(tempDynamicFieldOptions);
		setConditionalUsersList(tempConditionalUsersLists);
		try {
			let AttrID = [];
			for (const element of tempConditionalUsersLists) {
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
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleFilterConditionChange = (event: any, index: number) => {
		const filterValue = event.target.value;
		const tempConditionalUsersLists = [...conditionalUsersForLearningPath];
		tempConditionalUsersLists[index].filterOption = filterValue;
		setConditionalUsersList(tempConditionalUsersLists);
	};
	const handleDynamicFieldOptionChange = (event: any, index: number) => {
		const dynamicFieldValue = event.target.value;
		const tempConditionalUsersLists = [...conditionalUsersForLearningPath];
		tempConditionalUsersLists[index].dynamicFieldOption = dynamicFieldValue;
		setConditionalUsersList(tempConditionalUsersLists);
	};
	const handleConditionChange = (event: any, index: any) => {
		const tempConditionalUsersLists = [...conditionalUsersForLearningPath];
		tempConditionalUsersLists[index].condition = +event.target.value;
		setConditionalUsersList(tempConditionalUsersLists);
	};
	return (
		<>
			{conditionalUsersForLearningPath?.map((conUser, i) => (
				<section className="w-full py-2 px-4 my-2 rounded-md border bg-white space-y-2" key={i}>
					<div className="flex flex-col md:flex-col lg:flex-row gap-2 items-center justify-between">
						<select
							onChange={event => hanldeUserRoleChange(event, i)}
							value={conUser.userRole}
							className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
						>
							<option value={""} disabled>
								All
							</option>
							{dynamicGroupInfoLp?.PossibleFields?.map(
								(pFields: { FieldID: number; FieldLabel: string }, i: number) => (
									<option key={i} value={pFields.FieldID}>
										{pFields.FieldLabel}
									</option>
								)
							)}
						</select>
						<select
							value={conUser.filterOption}
							onChange={e => handleFilterConditionChange(e, i)}
							className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
						>
							{dynamicGroupInfoLp?.RowConditions?.map(
								(pFields: { ConditionID: number; ConditionLabel: string }, i: number) => (
									<option key={i} value={pFields.ConditionID}>
										{pFields.ConditionLabel}
									</option>
								)
							)}
						</select>
						{inputFieldsConditions.includes(conUser.userRole) ? (
							<input
								type="text"
								className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-2.5
                            text-sm
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded-md
                            transition
                            ease-in-out
                            my-1.5
                            focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
                        "
								placeholder="Custom Attribute"
								name={"Title"}
								value={conUser.dynamicFieldOption}
								onChange={e => handleDynamicFieldOptionChange(e, i)}
								required
							/>
						) : (
							<select
								value={conUser.dynamicFieldOption}
								onChange={e => handleDynamicFieldOptionChange(e, i)}
								disabled={!conUser.userRole}
								className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
							>
								<option value={""} disabled>
									Select
								</option>
								{conditionalTabDynamicFieldOptions[`${i}`]?.length > 0
									? conditionalTabDynamicFieldOptions[`${i}`]?.map((opt, index) => (
											<option key={index} value={opt?.Val}>
												{opt?.Txt}
											</option>
									  ))
									: null}
							</select>
						)}
						<div>
							<Icon
								icon={"mingcute:close-circle-line"}
								cursor={"pointer"}
								width={18}
								height={18}
								onClick={() => handleRemoveConUser(i)}
							/>
						</div>
					</div>
					<div className="flex gap-8">
						<div className={"relative flex items-center"}>
							<input
								type="radio"
								name={`user${i}`}
								id={`and-${i}`}
								className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
								checked={conditionalUsersForLearningPath[i].condition === 6}
								onChange={event => handleConditionChange(event, i)}
								value={6}
							/>
							<label htmlFor={`and-${i}`} className="ml-5">
								AND
							</label>
							<label
								className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
								htmlFor={`and-${i}`}
							></label>
						</div>
						<div className={"relative flex items-center"}>
							<input
								type="radio"
								name={`user${i}`}
								id={`or-${i}`}
								className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
								checked={conditionalUsersForLearningPath[i].condition === 7}
								onChange={event => handleConditionChange(event, i)}
								value={7}
							/>
							<label htmlFor={`or-${i}`} className="ml-5">
								OR
							</label>
							<label
								className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
								htmlFor={`or-${i}`}
							></label>
						</div>
					</div>
				</section>
			))}
		</>
	);
}

export default ConditionalTabContent;
