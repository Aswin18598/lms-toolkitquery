import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { useMap } from "react-use";
import { CatalogApi } from "../store";

const skillLevel = [
	{ label: "Basic", value: "1" },
	{ label: "Intermediate", value: "2" },
	{ label: "Advanced", value: "3" }
];

export function CatalogFilter({ isOpen, handleApplyFilter, onClose }: any) {
	const [Search, setSearch] = useState("-1");
	const category = CatalogApi.endpoints.getCategories.useQuery();
	const [getSubCategory, subCategory] = CatalogApi.endpoints.getSubCategories.useLazyQuery();
	const [getTopics, topics] = CatalogApi.endpoints.getCategoriesTopics.useLazyQuery();
	const [searchParams] = useSearchParams();

	const [filters, filter] = useMap({
		topicId: "-1",
		catagoryId: "-1",
		subCategoryId: "-1",
		skillLevelId: "-1",
		rating: "-1",
		searchText: "-1"
	});

	useEffect(() => {
		if (searchParams?.get("cat_id")) {
			filter.set("catagoryId", searchParams?.get("cat_id") || "-1");
			getSubCategory(searchParams.get("cat_id") || "-1");
			getTopics(searchParams.get("cat_id") || "-1");
		}
	}, [searchParams]);

	useEffect(() => {
		handleApplyFilter(filters);
	}, [filters]);

	return (
		<div
			className={classNames(
				"fixed inset-x-0 bottom-0 z-10 flex-col bg-white p-4 shadow-2xl rounded-t-2xl lg:static lg:shadow-none lg:bg-transparent lg:p-0",
				{ flex: isOpen },
				{ hidden: !isOpen }
			)}
		>
			<div className="flex lg:hidden items-center justify-between pb-3">
				<h3 className="font-medium text-black">Apply Filter</h3>
				<button onClick={onClose} className="btn w-6 h-6 p-0 rounded-md hover:bg-slate-300/20">
					<Icon icon="mingcute:close-line" className="w-4 h-4 transition-colors duration-200" />
				</button>
			</div>
			<div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full pb-5">
				<label className="relative flex h-10">
					<input
						value={filters.searchText === "-1" ? "" : decodeURIComponent(filters.searchText)}
						onChange={e =>
							filter.set("searchText", e.target.value === "" ? "-1" : encodeURIComponent(e.target.value))
						}
						className="form-input bg-white peer w-full rounded-lg border border-slate-300 px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
						placeholder="Search by Course Title..."
						type="text"
					/>
					<div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
						<Icon icon="mingcute:search-line" className="h-4.5 w-4.5 transition-colors duration-200" />
					</div>
				</label>
				<Select
					className="h-10"
					value={
						category.data?.Data?.getCategories?.find(
							(category: any) => category.CategoryID === Number(filters.catagoryId)
						) || null
					}
					options={category.data?.Data?.getCategories || []}
					getOptionLabel={(option: any) => option.CategoryName}
					getOptionValue={(option: any) => option.CategoryID}
					isClearable
					onChange={option => {
						filter.set("catagoryId", option?.CategoryID || "-1");
						getSubCategory(option?.CategoryID || "-1");
						getTopics(option?.CategoryID || "-1");
						if (!option?.CategoryID) {
							filter.setAll({ ...filters, catagoryId: "-1", subCategoryId: "-1", topicId: "-1" });
						}
					}}
					placeholder="Category (All)"
					isLoading={category.isLoading}
				/>
				<Select
					className="h-10"
					value={
						subCategory.data?.Data?.find(
							(category: any) => category.SubCategoryID === Number(filters.subCategoryId)
						) || null
					}
					isDisabled={filters.catagoryId === "-1"}
					options={subCategory.data?.Data || []}
					getOptionLabel={(option: any) => option.Version}
					getOptionValue={(option: any) => option.SubCategoryID}
					isClearable
					onChange={option => {
						filter.set("subCategoryId", option?.SubCategoryID || "-1");
					}}
					placeholder="Sub Category (All)"
					isLoading={subCategory.isLoading}
				/>
				<Select
					className="h-10"
					value={topics.data?.Data?.find((topic: any) => topic.ID === Number(filters.topicId)) || null}
					isDisabled={filters.catagoryId === "-1"}
					options={topics.data?.Data || []}
					getOptionLabel={(option: any) => option.Name}
					getOptionValue={(option: any) => option.ID}
					isClearable
					onChange={option => {
						filter.set("topicId", option?.ID || "-1");
					}}
					placeholder="Topics (All)"
					isLoading={topics.isLoading}
				/>
				<Select
					className="h-10"
					value={skillLevel.find((skill: any) => skill.value === filters.skillLevelId) || null}
					options={skillLevel}
					isClearable
					onChange={option => {
						filter.set("skillLevelId", option?.value || "-1");
					}}
					placeholder="Skill Level (All)"
				/>
			</div>
			<div className="hidden flex-col lg:hidden gap-2">
				<button
					className="btn bg-primary text-white"
					onClick={() => {
						onClose();
					}}
				>
					Apply
				</button>
				<button className="btn bg-primary text-white" onClick={filter.reset}>
					Reset
				</button>
			</div>
		</div>
	);
}
