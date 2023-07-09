import { Icon } from "@iconify/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	getSpecificCourseID,
	handleCourseID,
	setSelectedCatagoryID,
	setSelectedSubCatagoryID,
	useGetCategoriesQuery,
	useGetCourseTitlesQuery,
	useGetSubCategoriesListQuery
} from "../store";
import { useSelector } from "react-redux";

interface Iprops {
	updateCourse: any;
	Edit: any;
	data: any;
	formValue: any;
	setFormValue: any;
	validation: boolean;
}
const FilterCourse = ({ updateCourse, Edit, data, formValue, setFormValue, validation }: Iprops) => {
	const dispatch = useDispatch();
	useGetCategoriesQuery();
	const { CatagoryID, SubCatagoryID, CategoryLists, SubCategoryLists, CourseTitles } = useAppSelector(
		(state: any) => state.instructor
	);
	const { refetch, isFetching } = useGetSubCategoriesListQuery(CatagoryID, {
		skip: CatagoryID === -1 || CatagoryID === undefined
	});
	const CourseTitle = useGetCourseTitlesQuery(
		{ CategoryID: CatagoryID, SubCategoryID: SubCatagoryID },
		{ skip: CatagoryID === -1 || SubCatagoryID === -1 }
	);
	const [categoryID, setCategoryID] = useState<any>(CatagoryID);
	const [categoryName, setCategoryName] = useState<any>("Catagory");
	const [subCategoryID, setSubCategoryID] = useState<any>(SubCatagoryID);
	const [subCategoryName, setSubCategoryName] = useState<any>("Sub-Catagory");
	const [searchTerm, setSearchTerm] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState<Array<any>>([]);

	useEffect(() => {
		const getCourseDetails = async () => {
			const editValue = await updateCourse?.currentData?.Data?.find(
				(option: any) => option.CourseID === data?.CourseID
			);
			setSearchTerm(editValue?.Title);
		};
		getCourseDetails();
	}, [updateCourse]);

	useEffect(() => {
		const PreSelectedCategory = CategoryLists.find((option: any) => option.CategoryID === data?.Category);
		setCategoryName(PreSelectedCategory?.CategoryName);
		dispatch(setSelectedCatagoryID(PreSelectedCategory?.CategoryID));
		refetch();
	}, [updateCourse]);

	useEffect(() => {
		const PreSelectedSubCategory = SubCategoryLists?.find(
			(option: any) => option.SubCategoryID === data?.SubCategory
		);
		const SubcategoryName = PreSelectedSubCategory?.Name;
		const value = PreSelectedSubCategory?.Name + " " + "(" + PreSelectedSubCategory?.Version + ")";
		if (SubcategoryName === undefined) {
			setSubCategoryName("Sub-Category");
		} else {
			setSubCategoryName(value);
		}
	}, [isFetching]);

	const handleChangeOnCategory = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedCatagoryID(e.target.value));
		setCategoryID(e.target.value);
		setFormValue({ ...formValue, Category: e.target.value });
	};
	const handleChangeOnSubCategory = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSelectedSubCatagoryID(e.target.value));
		setSubCategoryID(e.target.value);
		setFormValue({ ...formValue, subCategory: e.target.value });
	};

	const handleInputChange = (e: any) => {
		const searchTerm = e.target.value;
		setSearchTerm(searchTerm);
		setFilteredOptions(
			CourseTitles.filter((items: any) => items.Title.toLowerCase().includes(searchTerm.toLowerCase()))
		);
		setShowDropdown(true);
	};

	const handleOptionSelect = (option: any) => {
		setSearchTerm(option.Title);
		dispatch(handleCourseID(option.CourseID));
		setShowDropdown(false);
	};

	useEffect(() => {
		refetch();
	}, [CatagoryID]);

	useEffect(() => {
		CourseTitle.refetch();
	}, [SubCatagoryID]);

	useEffect(() => {
		setFilteredOptions(CourseTitles);
	}, [CourseTitles]);

	return (
		<div>
			<div className="flex items-center mb-7">
				<div className="p-2 pr-4" title="Category">
					<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
				</div>
				<div className="w-full">
					<select
						onChange={handleChangeOnCategory}
						className="form-select mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						placeholder="Category"
					>
						<option value={-1}>{Edit ? categoryName : "Category"}</option>
						{CategoryLists?.length > 0 &&
							CategoryLists?.map((GridOption: any, index: number) => {
								return (
									<option key={GridOption?.CategoryID} value={GridOption?.CategoryID}>
										{GridOption?.CategoryName}
									</option>
								);
							})}
					</select>
					{formValue?.Category === "" && validation && (
						<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"*Category is required"}</p>
					)}
				</div>
			</div>
			<div className="flex items-center mb-7">
				<div className="p-2 pr-4" title="SubCategory">
					<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
				</div>
				<div className="w-full">
					<select
						className="form-select mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						placeholder="Sub - Category"
						onChange={handleChangeOnSubCategory}
					>
						<option value={-1}>{Edit ? subCategoryName : "Sub-Category"}</option>
						{SubCategoryLists?.length > 0 &&
							SubCategoryLists?.map((GridOption: any) => {
								return (
									<option key={GridOption?.SubCategoryID} value={GridOption?.SubCategoryID}>
										{GridOption?.Name + " " + "(" + GridOption.Version + ")"}
									</option>
								);
							})}
					</select>
					{formValue?.subCategory === "" && validation && (
						<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"*Sub-Category is required"}</p>
					)}
				</div>
			</div>
			<div className="relative flex items-center mb-7">
				<div className="p-2 pr-4" title="Course Name">
					<svg
						viewBox="0 0 12 13"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-slate-500 dark:text-navy-100 iconify iconify--ic"
					>
						<path
							d="M9.33463 0.333984C10.3998 0.333984 11.3346 1.20065 11.3346 2.33398V11.0007C11.3346 12.134 10.4013 13.0007 9.33463 13.0007H2.0013C1.29839 13.0007 0.667969 12.3673 0.667969 11.6673V1.66732C0.667969 0.96441 1.3013 0.333984 2.0013 0.333984H9.33463ZM9.33463 1.66732H4.66797V11.6673H9.33463C9.67653 11.6673 10.0013 11.4073 10.0013 11.0007V2.33398C10.0013 1.9921 9.67463 1.66732 9.33463 1.66732ZM3.33464 1.66732H2.0013V11.6673H3.33464V1.66732Z"
							fill="#64748beb"
						/>
					</svg>
				</div>
				<div className="relative w-full">
					<div className="w-full">
						<input
							type="text"
							value={searchTerm}
							onChange={handleInputChange}
							onFocus={() => setShowDropdown(true)}
							className="form-input mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
							placeholder="Course *"
						/>
					</div>
					{showDropdown && (
						<div className="absolute z-10 w-50 border bg-white w-full rounded-lg shadow-soft bg-shadow-[0_0_6px#becadb] line-clamp-1 text-left">
							<div className="recent-search-p flex flex-col w-full">
								{filteredOptions.map((option: any) => (
									<span
										key={option.CourseID}
										className="p-3 hover:bg-slate-150"
										onClick={() => handleOptionSelect(option)}
									>
										{option.Title}
									</span>
								))}
							</div>
						</div>
					)}
					{searchTerm === undefined && validation && (
						<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"*Course is required"}</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilterCourse;
