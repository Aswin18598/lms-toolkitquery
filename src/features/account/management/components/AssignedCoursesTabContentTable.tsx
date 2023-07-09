import { Icon } from "@iconify/react";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import { ILearningPathItems } from "../@types";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { assignedLearning, useLearningPathItemActionMutation, useAssignedCoursesAndAssessmentsQuery } from "../store";
import { useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { useState, useEffect } from "react";
import Pagination from "~/features/Subscriptions/components/Pagination";

const SortableItem = SortableElement(({ item, handleResetDate, handleRemoveLpItem }: any) => (
	<tr className="border-b-2 border-slate-200 bg-white cursor-move">
		<td className="text-sm+ font-dmsans text-[#020A12]/60 px-4 py-3">{item?.CourseID}</td>
		<td className="text-sm+ font-dmsans text-[#020A12]/60 px-4 py-3">{item?.Type}</td>
		<td className="text-sm+ font-dmsans text-[#020A12]/60 px-4 py-3">{item?.Title}</td>
		<td className="text-sm+ font-dmsans text-[#020A12]/60 px-4 py-3">
			{item?.StartDate ? new Date(item?.StartDate).toLocaleDateString() : "null"}
		</td>
		<td className="text-sm+ font-dmsans text-[#020A12]/60 px-4 py-3">
			{item?.DueDate ? new Date(item?.DueDate).toLocaleDateString() : "null"}
		</td>
		<td className="font-dmsans text-[#020A12]/60 px-4 py-3 text-center">
			<div className="w-full flex items-center gap-2">
				<Tippy content={"Clear Date"} placement={"bottom"}>
					<div className="w-fit">
						<Icon
							icon={"bx:window-close"}
							className={"cursor-pointer"}
							height={20}
							width={20}
							onClick={() => handleResetDate(item)}
						/>
					</div>
				</Tippy>
				<Tippy content={"Delete"} placement={"bottom"}>
					<div className="w-fit">
						<Icon
							icon={"material-symbols:delete-outline-rounded"}
							className={"cursor-pointer"}
							height={20}
							width={20}
							onClick={() => handleRemoveLpItem(item)}
						/>
					</div>
				</Tippy>
			</div>
		</td>
	</tr>
));
const SortableList = SortableContainer((props: any) => {
	const { items, handleResetDate, handleRemoveLpItem, text, ...others } = props;
	return (
		<tbody className="bg-white">
			{items
				?.filter((u: any) => u?.Title?.toLowerCase()?.includes(text.toLowerCase()))
				?.map((value: any, index: any) => (
					<SortableItem
						key={`item-${index}`}
						index={index}
						item={value}
						handleResetDate={handleResetDate}
						handleRemoveLpItem={handleRemoveLpItem}
						{...others}
					/>
				))}
		</tbody>
	);
});

interface IAssignedCoursesTabContentTableProps {
	text: string;
}
function AssignedCoursesTabContentTable(props: IAssignedCoursesTabContentTableProps) {
	const [assignedCoursePageNumber, setAssignedCoursePageNumber] = useState(1);
	const [assignedCoursePageSize, setAssignedCoursePageSize] = useState(10);
	const { text } = props;
	const isEditPage = window.location.pathname.includes("edit");
	const location = useLocation();
	const [learningPathItemAction, { isLoading }] = useLearningPathItemActionMutation();
	const { assignedCoursesAndAssessments, learningPathItemsEmptyMessage, pathId } = useAppSelector(assignedLearning);
	const { isFetching, refetch } = useAssignedCoursesAndAssessmentsQuery({
		PathID: isEditPage ? location.state?.PathID : pathId,
		PageNumber: assignedCoursePageNumber,
		PageSize: assignedCoursePageSize
	});
	const [sortableItems, setSortableItems] = useState<ILearningPathItems[]>([]);
	const handleResetDate = async (lpItem: ILearningPathItems) => {
		try {
			await learningPathItemAction({
				Action: "SETNULL",
				ItemID: lpItem.CourseID,
				PathID: lpItem.PathID,
				ItemType: lpItem.Type === "Course" ? 1 : lpItem.Type === "Assessment" ? 2 : 3
			}).unwrap();
			refetch();
		} catch (error) {
			console.error("error", error);
		}
	};
	const handleRemoveLpItem = async (lpItem: ILearningPathItems) => {
		try {
			await learningPathItemAction({
				Action: "DELETE",
				ItemID: lpItem.CourseID,
				PathID: lpItem.PathID,
				ItemType: lpItem.Type === "Course" ? 1 : lpItem.Type === "Assessment" ? 2 : 3
			}).unwrap();
			refetch();
		} catch (error) {
			console.error("error", error);
		}
	};
	const onSortEnd = async ({ oldIndex, newIndex }: any) => {
		const tempLearningPathItemsDetails = JSON.parse(JSON.stringify(sortableItems));
		const updatedArray: ILearningPathItems[] = arrayMoveImmutable(tempLearningPathItemsDetails, oldIndex, newIndex);
		updatedArray.forEach(async (item: ILearningPathItems, index: number) => {
			item.ItemSequence = index + 1;
			await learningPathItemAction({
				PathID: item.PathID,
				Action: "SEQ",
				ItemType: item.Type === "Course" ? 1 : item.Type === "Assessment" ? 2 : 3,
				ItemID: item.CourseID,
				ItemSequence: index + 1
			}).unwrap();
		});
		setSortableItems(updatedArray);
	};
	useEffect(() => {
		if (assignedCoursesAndAssessments?.LearningPathItems?.length) {
			setSortableItems(assignedCoursesAndAssessments?.LearningPathItems);
		}
	}, [assignedCoursesAndAssessments?.LearningPathItems]);
	if (isFetching && !assignedCoursesAndAssessments?.LearningPathItems?.length)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!assignedCoursesAndAssessments?.LearningPathItems?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={learningPathItemsEmptyMessage}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 bg-white min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500 ">
				{/* {isLoading && (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<Spinner />
				</section>
			)} */}
				<table className="w-full">
					<thead>
						<tr className="bg-table-header text-left">
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Item ID
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Type
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Title
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Start Date
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								End Date
							</th>
							<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
								Action
							</th>
						</tr>
					</thead>
					<SortableList
						items={sortableItems}
						handleResetDate={handleResetDate}
						handleRemoveLpItem={handleRemoveLpItem}
						onSortEnd={onSortEnd}
						lockAxis={"y"}
						distance={1}
						text={text}
						lockToContainerEdges
					/>
				</table>
			</div>
			<Pagination
				PaginationData={{
					TotalPages: assignedCoursesAndAssessments.TotalPages,
					TotalItems: assignedCoursesAndAssessments.TotalItems
				}}
				isTableView={true}
				pageNumber={assignedCoursePageNumber}
				pageSize={assignedCoursePageSize}
				setPageNumber={setAssignedCoursePageNumber}
				setPageSize={setAssignedCoursePageSize}
			/>
		</>
	);
}

export default AssignedCoursesTabContentTable;
