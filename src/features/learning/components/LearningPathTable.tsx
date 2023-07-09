import { Fragment, useState, useEffect } from "react";
import _ from "lodash";
import CourseTable from "./CourseTable";
import { useAppSelector } from "~/config/store";
import { Spinner } from "~/components/spinner";
import Pagination from "./Pagination";

interface IProps {
	loader: boolean;
	refetch: any;
	setLoader: any;
}

function LearningPathTable({ loader, refetch, setLoader }: IProps) {
	const { PageNumber, PageSize, LearningPathMessage, LearningPath } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const [expanded, setCollapseExpanded] = useState<Map<string, boolean>>(new Map<string, boolean>());

	function showTableRowBorder(index: string): string {
		if (expanded.has(index)) {
			return "";
		}
		return "border-y";
	}

	const toggleCollapse = (index: string) => {
		const localMap = new Map<string, boolean>();
		if (!expanded.has(index)) {
			localMap.set(index, true);
		}
		setCollapseExpanded(localMap);
	};

	const clickHide = () => {
		const localMap = new Map<string, boolean>();
		setCollapseExpanded(localMap);
	};

	function rotateCollapse180(index: string): string {
		if (expanded.has(index)) {
			return "-rotate-180";
		}
		return "";
	}

	const LearningPathData = () => {
		return LearningPath?.LearningPathDetailedList?.map((item: any, index: number) => {
			return (
				<Fragment key={item.SNo}>
					<tr
						className={` ${showTableRowBorder(
							item.SNo
						)} border-transparent border-b-slate-200 cursor-pointer`}
						key={item.SNo}
						onClick={(): void => toggleCollapse(`${index}`)}
					>
						<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
							<div className="flex text-left">
								<p className=" text-sm font-dmsans text-[#020A12]/60">
									{(PageNumber === 1 ? 0 : PageNumber * PageSize - PageSize) + index + 1}
								</p>
							</div>
						</td>
						<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
							<div className="flex text-left">
								<p className="text-sm font-dmsans text-[#020A12]/60">{item.LearningPathName}</p>
							</div>
						</td>
						<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
							<div className="flex text-left">
								<p className="text-sm font-dmsans text-[#020A12]/60">
									{item.LearningPathCourseDetails.length} items
								</p>
							</div>
						</td>
						<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
							<div className="flex text-left">
								<p className="text-sm font-dmsans text-[#020A12]/60">
									{(item.CompletedLP || 0) + "/" + (item.TotalLP || 0)}
								</p>
							</div>
						</td>
						<td className="whitespace-nowrap">
							<button
								className="btn"
								title={rotateCollapse180(`${index}`) ? "Collapse" : "Expand"}
								onClick={(): void => toggleCollapse(`${index}`)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-4.5 w-4.5 text-sm font-dmsans text-[#020A12]/60  ${rotateCollapse180(
										`${index}`
									)}`}
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
								</svg>
							</button>
						</td>
					</tr>
					{expanded.get(`${index}`) && (
						<CourseTable
							clickHide={clickHide}
							courseDetails={item.LearningPathCourseDetails}
							refetch={refetch}
						/>
					)}
				</Fragment>
			);
		});
	};

	useEffect(() => {
		setLoader(!!!LearningPathData);
	}, [LearningPath]);

	return (
		<>
			{loader && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!loader && (
				<>
					{!!LearningPathData && LearningPath?.LearningPathDetailedList?.length > 0 ? (
						<>
							<div className="col-span-12 overflow-x-auto bg-white border rounded-lg mt-6">
								<table className="is-hoverable w-full text-left">
									<thead>
										<tr className="bg-[#E2E8F0]">
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 lg:px-5">
												#
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 lg:px-5">
												LEARNING PATH NAME
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 lg:px-5">
												ITEMS
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 lg:px-5">
												Completion Status
											</th>
											<th className=" whitespace-nowrap text-sm+ bg-slate-200/50 px-4 py-3 font-semibold uppercase text-slate-800 lg:px-5"></th>
										</tr>
									</thead>
									<tbody>
										<LearningPathData />
									</tbody>
								</table>
							</div>
							<Pagination PaginationData={LearningPath} />
						</>
					) : (
						<>
							<div className="flex flex-col text-center items-center mx-auto py-12">
								{LearningPathMessage.toLowerCase().includes("success") || LearningPathMessage === "" ? (
									<></>
								) : !LearningPathMessage.toLowerCase().includes("fail") ? (
									<>
										<img
											className="h-40 my-auto"
											src="assets/images/Tiger_images/tiger-logoutX400.png"
											alt={LearningPathMessage}
										/>
										<p className="text-xs+ text-[#020A12]/60">{LearningPathMessage}</p>
									</>
								) : (
									<>
										<img
											className="h-40 my-auto"
											src="assets/images/Tiger_images/tiger-logoutX400.png"
											alt={"No records found"}
										/>
										<p className="text-xs+ text-[#020A12]/60">{"No records found"}</p>
									</>
								)}
							</div>
						</>
					)}
				</>
			)}
		</>
	);
}
export default LearningPathTable;
