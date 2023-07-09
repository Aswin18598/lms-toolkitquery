import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import Category from "./components/Category";
import CourseDetailReport from "./components/CourseDetailReport";
import CourseToggle from "./components/CourseToggle";
import SubCategory from "./components/SubCategory";
import { useGetCoursesCanCopyCSVQuery, useGetCoursesCanCopyQuery, useGetCoursesCategoryQuery } from "./store";

const CourseDetail = () => {
	const user = getLoggedUser();
	const [selectedCategory, setSelectedCategory] = useState<number>(0);
	const [selectedSubCatogery, setSelectedSubCatogery] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [pageSizeCSV, setPageSizeCSV] = useState<number>(0);
	const [Status, setStatus] = useState(-1);
	const { CategoryID, SubCategoryID } = useAppSelector((state: any) => state.CourseDetailReducer);
	const { CoursesCanCopyCSV } = useAppSelector((state: any) => state.CourseDetailReducer);

	const CSVFile = useGetCoursesCanCopyCSVQuery({
		UserID: user.UserId,
		CategoryID: CategoryID,
		SubcategoryID: SubCategoryID,
		Custom: -1,
		LastModifiedBy: Status,
		PageNumber: pageNumber,
		PageSize: pageSizeCSV
	});

	const { refetch, isFetching, isLoading } = useGetCoursesCanCopyQuery({
		UserID: user.UserId,
		CategoryID: CategoryID,
		SubcategoryID: SubCategoryID,
		Custom: -1,
		LastModifiedBy: Status,
		PageNumber: pageNumber,
		PageSize: pageSize
	});

	useEffect(() => {
		setTimeout(() => {
			refetch();
			CSVFile.refetch();
		});
	}, [pageNumber, pageSize, selectedCategory, selectedSubCatogery, Status]);

	useEffect(() => {
		setTimeout(() => {
			CSVFile.refetch();
		});
	}, [pageSizeCSV]);

	const tableHeader: any[] = useMemo(
		() => [
			{ label: "CourseID", key: "CourseID" },
			{ label: "Title", key: "Title" },
			{ label: "LastModifiedByName", key: "LastModifiedByName" },
			{ label: "LastModifiedDate", key: "LastModifiedDate" },
			{ label: "Course Status", key: "CourseStatus" }
		],

		[]
	);

	return (
		<div className="w-full">
			<div className="flex lg:flex-row flex-col justify-between my-4 gap-4">
				<CourseToggle setStatus={setStatus} Status={Status} />
				<div className="flex items-center md:flex-row flex-col gap-4">
					{!isLoading && (
						<CSVLink
							filename="courseDetailReports.csv"
							data={
								(CoursesCanCopyCSV?.CourseBuilderCopyExistingCourses?.length > 0 &&
									CoursesCanCopyCSV?.CourseBuilderCopyExistingCourses) ||
								[]
							}
							headers={tableHeader}
						>
							<button className="btn space-x-2 rounded-full bg-white border font-medium hover:bg-primary/60 hover:text-white">
								<Icon icon="mingcute:download-2-line" className="w-4 h-4" />
								<span>CSV</span>
							</button>
						</CSVLink>
					)}
					<div className="my-2 min-w-[300px]">
						<Category setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
					</div>
					<div className="my-2 min-w-[300px]">
						<SubCategory
							selectedSubCatogery={selectedSubCatogery}
							setSelectedSubCatogery={setSelectedSubCatogery}
						/>
					</div>
				</div>
			</div>
			{/* <div className="flex items-center justify-between space-x-8 my-4">
				<div className="my-2 sm:my-0 min-w-[300px]">
					<CourseToggle setStatus={setStatus} Status={Status} />
				</div>
				<div className="w-[220px]"></div>
				<div className="my-2 sm:my-0 min-w-[300px]">
					<Category setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
				</div>
				<div className="my-2 sm:my-0 min-w-[300px]">
					<SubCategory
						selectedSubCatogery={selectedSubCatogery}
						setSelectedSubCatogery={setSelectedSubCatogery}
					/>
				</div>
			</div> */}
			<CourseDetailReport
				isFetching={isFetching}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				pageSize={pageSize}
				setPageSize={setPageSize}
			/>
		</div>
	);
};

export default CourseDetail;
