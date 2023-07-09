import { Icon } from "@iconify/react";
import Select from "react-select";
import { useMap } from "react-use";
import { dispatch, useAppSelector } from "~/config/store";
import { Page } from "../@types";
import { skillAdvisorAction, useGetSoftwareListQuery, useGetUserTypeRolesQuery } from "../store";
import { useEffect } from "react";

const { setCurrentPage, setFilterValue } = skillAdvisorAction;

function Filter() {
	const { filterValues } = useAppSelector((state: any) => state.skillAdvisor);
	const userTypeRole = useGetUserTypeRolesQuery();
	const [filters, filter] = useMap({ role: "", plan: "" });
	const software = useGetSoftwareListQuery(filters.role, { skip: filters.role === "" });

	useEffect(() => {
		filter.set("role", filterValues?.RoleID || "");
		filter.set("plan", filterValues?.CategoryID || "");
	}, [filterValues]);

	const reset = () => {
		dispatch(setCurrentPage(Page.banner));
		filter.reset();
	};
	return (
		<aside className="h-auto shrink-0 w-full flex flex-col bg-white lg:w-96">
			<div className="flex-1 flex flex-col space-y-5 h-ful p-5">
				<label className="space-y-1">
					<span className="text-lg">What role would you like to learn?</span>
					<Select
						placeholder="Select Role"
						options={userTypeRole?.data?.Data}
						isLoading={userTypeRole.isLoading}
						getOptionLabel={(option: any) => option.RoleName}
						getOptionValue={(option: any) => option.RoleID}
						value={
							userTypeRole.data?.Data?.find((role: any) => role.RoleID === Number(filters.role)) || null
						}
						onChange={(option: any) => {
							filter.set("role", option.RoleID);
							dispatch(setFilterValue({ RoleID: option.RoleID }));
						}}
					/>
				</label>
				<label className="space-y-1">
					<span className="text-lg">What software will you focus on?</span>
					<Select
						placeholder="Select Plan"
						options={software?.data?.Data}
						isLoading={software.isLoading}
						getOptionLabel={(option: any) => option.MasterCategoryName}
						getOptionValue={(option: any) => option.ID}
						value={software.data?.Data?.find((sf: any) => sf.ID === Number(filters.plan)) || null}
						onChange={(option: any) => {
							filter.set("plan", option.ID);
							dispatch(setFilterValue({ CategoryID: option.ID }));
						}}
					/>
				</label>
				<div className="flex items-center justify-end gap-3">
					<button
						onClick={() => reset()}
						className="btn space-x-1 border border-primary text-primary rounded-full hover:opacity-80"
					>
						<Icon icon="mingcute:refresh-1-line" className="w-4 h-4" />
						<span>Reset</span>
					</button>
					<button
						onClick={() => dispatch(setCurrentPage(Page.plan))}
						className="btn space-x-1 bg-primary text-white rounded-full hover:opacity-80"
					>
						<span>View Plans</span>
						<Icon icon="mingcute:arrow-right-line" className="w-5 h-5" />
					</button>
				</div>
			</div>
		</aside>
	);
}

export default Filter;
