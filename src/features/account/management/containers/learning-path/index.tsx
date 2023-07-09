import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "~/config/store";
import LearningAssignmentsTable from "../../components/LearningAssignmentsTable";
import {
	assignedLearning,
	useLearningAssignmentsListQuery,
	usePreDefinedLearningPathListQuery,
	useLazyLearningPathItemsQuery,
	useSubCategoriesListQuery
} from "../../store";
import PreDefinedPathItemsTable from "../../components/PreDefinedPathItemsTable";
import { ILearningAssignments, ISubCategories } from "../../@types";
import { Spinner } from "~/components/spinner";
import { CSVLink } from "react-csv";
import Tippy from "@tippyjs/react";

function LearningPath() {
	const learningPathMenus = useMemo(() => ["Learning Assignments", "Pre-defined Learning Path Templates"], []);
	const [preDefinedPageNumber, setPreDefinedPageNumber] = useState<number>(1);
	const [preDefinedPageSize, setPreDefinedPageSize] = useState<any>(10);
	const [assignmentPageNumber, setAssignmentPageNumber] = useState<number>(1);
	const [assignmentPageSize, setAssignmentPageSize] = useState<any>(10);
	const [selectedCatalog, setSelectedCatalog] = useState(learningPathMenus[0]);
	const [expandedRowIndex, setExpandedRowIndex] = useState<number | any>(null);
	const [pathId, setPathId] = useState<number | any>(0);
	const [availablePaths, setAvailablePaths] = useState<number>(0);
	const icons = useMemo(
		() => [
			{ icon: "material-symbols:download-rounded", name: "Download" },
			{ icon: "bx:pencil", name: "Edit" },
			{ icon: "heroicons-outline:speakerphone", name: "Send Notification" },
			{ icon: "mingcute:delete-2-line", name: "Delete" }
		],
		[]
	);
	const { preDefinedSubCategories, learningAssignments } = useAppSelector(assignedLearning);
	const { isFetching: isLearningAssignmentFetching, refetch: refetchLearningAssignments } =
		useLearningAssignmentsListQuery({ PageNumber: assignmentPageNumber, PageSize: assignmentPageSize });
	const { isFetching: isPreDefinedPathFetching, refetch } = usePreDefinedLearningPathListQuery({
		PageNumber: preDefinedPageNumber,
		PageSize: preDefinedPageSize,
		CategoryId: availablePaths
	});
	const [triggerLearningPathItemsQuery, { isFetching: isLearningPathItemsFetching }] =
		useLazyLearningPathItemsQuery();
	useSubCategoriesListQuery({}); //dropdown fetch query
	useEffect(() => {
		if (expandedRowIndex) {
			triggerLearningPathItemsQuery({ PathID: pathId });
		}
	}, [expandedRowIndex, pathId]);
	useEffect(() => {
		refetch();
	}, [preDefinedPageNumber, preDefinedPageSize, availablePaths]);
	useEffect(() => {
		refetchLearningAssignments();
	}, [assignmentPageNumber, assignmentPageSize]);
	const tableHeader: any[] = useMemo(
		() => [
			{ label: "PathID", key: "PathID" },
			{ label: "Name", key: "Name" },
			{ label: "CoursesCount", key: "CoursesCount" },
			{ label: "AssessmentsCount", key: "AssessmentsCount" }
		],

		[]
	);
	const tableBody: any[] = useMemo(
		() =>
			learningAssignments?.LearningAssignments?.length > 0
				? learningAssignments?.LearningAssignments?.map((a: ILearningAssignments) => ({
						PathID: a.PathID,
						Name: a.Name,
						CoursesCount: a.CoursesCount,
						AssessmentsCount: a.AssessmentsCount
				  }))
				: [],
		[learningAssignments]
	);
	return (
		<section className="w-full mt-8">
			<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-xl">Assigned Learning</h2>
			<div className="w-full grid grid-cols-1 sm:grid-cols-2 justify-between items-center my-6">
				<div className="rounded-lg bg-slate-150 flex px-[6px] w-fit">
					{learningPathMenus.map((menu: any) => (
						<button
							key={menu}
							onClick={() => {
								setSelectedCatalog(menu);
							}}
							className={`px-[10px] py-[7px] mr-3 text-slate-500 rounded-lg text-[14px] font-bold my-1 ${
								selectedCatalog === menu ? "bg-white p-4" : ""
							}`}
						>
							{menu}
						</button>
					))}
				</div>
				<div className="my-3 sm:m-0 gap-5 flex sm:justify-end self-start w-full">
					{selectedCatalog === learningPathMenus[0] ? (
						<>
							{learningAssignments?.LearningAssignments?.length > 0 && (
								<CSVLink
									data={tableBody}
									headers={tableHeader}
									target={"_blank"}
									filename={"course-details"}
								>
									<Tippy content={"Download"} placement={"bottom"}>
										<button className="bg-white rounded-[30px] border border-gray-200 py-3 px-4">
											<Icon icon={"material-symbols:download-rounded"} width={16} height={16} />
										</button>
									</Tippy>
								</CSVLink>
							)}
							<Link to={"/account/assigned-learning"}>
								<button className="px-4 py-2 bg-primary text-white text-sm rounded-lg flex items-center gap-1">
									<Icon icon={"ic:baseline-plus"} width={12} height={12} />
									Create
								</button>
							</Link>
						</>
					) : (
						<select
							value={availablePaths}
							placeholder="All Paths"
							onChange={e => {
								setAvailablePaths(+e.target.value);
								setPreDefinedPageNumber(1);
								setPreDefinedPageSize(10);
							}}
							className="form-select text-sm w-full sm:max-w-[300px] truncate rounded-lg border border-slate-300 bg-white px-4 pr-20 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
						>
							<option value={0}>All Paths</option>
							{preDefinedSubCategories?.length > 0
								? preDefinedSubCategories?.map((cat: ISubCategories, i: number) => (
										<option value={cat?.SubCategoryID} key={i}>
											{cat.Name}
										</option>
								  ))
								: null}
						</select>
					)}
				</div>
			</div>
			{selectedCatalog === learningPathMenus[0] &&
				(isLearningAssignmentFetching ? (
					<div className="mx-auto my-12">
						<Spinner />
					</div>
				) : (
					<LearningAssignmentsTable
						icons={icons}
						isLearningAssignmentFetching={isLearningAssignmentFetching}
						refetch={refetchLearningAssignments}
						assignmentPageNumber={assignmentPageNumber}
						assignmentPageSize={assignmentPageSize}
						setAssignmentPageNumber={setAssignmentPageNumber}
						setAssignmentPageSize={setAssignmentPageSize}
					/>
				))}
			{selectedCatalog === learningPathMenus[1] &&
				(isPreDefinedPathFetching ? (
					<div className="mx-auto my-12">
						<Spinner />
					</div>
				) : (
					<PreDefinedPathItemsTable
						expandedRowIndex={expandedRowIndex}
						setExpandedRowIndex={setExpandedRowIndex}
						setPathId={setPathId}
						isPreDefinedPathFetching={isPreDefinedPathFetching}
						isLearningPathItemsFetching={isLearningPathItemsFetching}
						preDefinedPageNumber={preDefinedPageNumber}
						preDefinedPageSize={preDefinedPageSize}
						setPreDefinedPageNumber={setPreDefinedPageNumber}
						setPreDefinedPageSize={setPreDefinedPageSize}
					/>
				))}
		</section>
	);
}

export default LearningPath;
