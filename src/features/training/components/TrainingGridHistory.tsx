import Pagination from "./Pagination";
import { Fragment } from "react";
import { useAppSelector } from "~/config/store";
import { dateFormatWithDelimiter } from "../constants";
import TrainingActionItems from "./TrainingActionItems";
import TrainingSessionHistory from "./TrainingSessionHistory";
import { Icon } from "@iconify/react";

interface Iprops {
	expanded: any;
	editTraining: any;
	clickHide: any;
	refetch: any;
	toggleCollapse: any;
}
const TrainingGridHistory = ({ expanded, editTraining, clickHide, refetch, toggleCollapse }: Iprops) => {
	const { TrainingListHistory } = useAppSelector((state: any) => {
		return state.instructor;
	});
	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
				<table className="w-full">
					<thead className="bg-[#E2E8F0]">
						<tr className="border border-slate-150 font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
							<th className="w-[2rem] px-4 py-3 lg:px-5">#</th>
							<th className="px-4 py-3 lg:px-5">TRAINING NAME</th>
							<th className="px-4 py-3 lg:px-5">COURSE NAME</th>
							<th className="px-4 py-3 lg:px-5">NO.OF SESSIONS</th>
							<th className="px-4 py-3 lg:px-5">START DATE</th>
							<th className="px-4 py-3 lg:px-5">END DATE</th>
							<th className="px-4 py-3 lg:px-5">CREATED BY</th>
							<th className="px-4 py-3 lg:px-5">DATE CREATED</th>
							<th className=" px-4 py-3 lg:px-5">ACTION</th>
							<th className=" px-4 py-3 lg:px-5"></th>
						</tr>
					</thead>
					<tbody className="bg-[#FFFFFF]">
						{TrainingListHistory?.TrainingData?.length > 0 ? (
							TrainingListHistory.TrainingData.map((item: any, index: string) => (
								<Fragment>
									<tr key={index} className="border-transparent border-b-slate-200">
										<td className="w-[2rem] whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 text-sm font-dmsans text-[#020A12]/60">
													{index + 1}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<div className="flex text-left font-semibold text-[#020A12]/60">
												{item.Name}
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5 w-[10rem]">
											<div className="flex text-left cursor-pointer" title={item.CourseName}>
												<p className="w-[10rem] truncate font-semibold text-[#020A12]/60">
													{item.CourseName}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-1  sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
													{item.NoOfSession}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-1  sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
													{dateFormatWithDelimiter(item.SessionStartTime.split(" ")[0], " ")}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-1  sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
													{dateFormatWithDelimiter(item.SessionEndTime.split(" ")[0], " ")}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-1  sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
													{item.CreatedBy}
												</p>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-1  sm:px-5">
											<div className="flex text-left">
												<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
													{dateFormatWithDelimiter(item.CreatedDate, " ")}
												</p>
											</div>
										</td>

										<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
											<TrainingActionItems
												type="training"
												item={item}
												TrainPrivileged={item.IsPrivileged}
												edit={editTraining}
												refetchTraining={() => {}}
												refetch={refetch}
											/>
										</td>
										<td className="whitespace-nowrap">
											<button className="btn" onClick={(): void => toggleCollapse(index + 1)}>
												{!expanded.get(index + 1) && (
													<Icon
														className="w-5 h-5"
														icon="material-symbols:keyboard-arrow-up-rounded"
														color="rgba(2, 10, 18, 0.6)"
														rotate={2}
													/>
												)}
												{expanded.get(index + 1) && (
													<Icon
														className="w-5 h-5"
														icon="material-symbols:keyboard-arrow-down-rounded"
														color="rgba(2, 10, 18, 0.6)"
														rotate={2}
													/>
												)}
											</button>
										</td>
									</tr>
									{expanded.get(index + 1) && (
										<TrainingSessionHistory
											key={item.TrainingID}
											clickHide={clickHide}
											training={item}
											refetchTraining={refetch}
										/>
									)}
								</Fragment>
							))
						) : (
							<>
								<tr className={"border border-slate-150"}>
									<td colSpan={10} className="whitespace-nowrap px-3 py-3 sm:px-5">
										<div className="flex flex-col text-center items-center justify-center px-64 py-32">
											<img
												className="h-40 my-auto"
												src="/assets/images/Tiger_images/tiger-logoutX400.png"
											/>

											<p className="text-xs+ text-[#020A12]/60">No trainings found.</p>
										</div>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</table>
			</div>
			<Pagination PaginationData={TrainingListHistory} count={10} />
		</>
	);
};

export default TrainingGridHistory;
