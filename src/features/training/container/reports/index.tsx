import { Fragment, useEffect, useMemo, useState } from "react";
import { Spinner } from "~/components/spinner";

import Pagination from "./Pagination";
import { useGetTrainingReportsQuery } from "../../store";
import { useAppSelector } from "~/config/store";
import DownloadReport from "./DownloadReport";

function TrainingReports() {
	const [StartDate, setStartDate] = useState(-1);
	const [EndDate, setEndDate] = useState(-1);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	const { TrainingReports } = useAppSelector((state: any) => state.instructor);
	const { isLoading, refetch } = useGetTrainingReportsQuery(
		{ StartDate: StartDate, EndDate: EndDate, PageNumber: pageNumber, PageSize: pageSize },
		{ skip: StartDate === -1 || EndDate === -1 }
	);
	function startDateChange(event: any): void {
		setStartDate(event.target.value);
	}

	function endDateChange(event: any): void {
		setEndDate(event.target.value);
	}
	useEffect(() => {
		refetch();
	}, [StartDate, EndDate, pageNumber, pageSize]);

	return (
		<section className="w-full mt-8">
			<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-xl mb-3">Training Reports</h2>
			<div className="font-medium text-sm text-[#0A4B94]">Select Date Range </div>
			<div className="flex flex-col sm:flex-row items-start sm:items-center text-center justify-between mt-2">
				<div className="flex sm:flex-row flex-col gap-2 items-start">
					<input
						className="form-date w-60 rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						id="first-name"
						type="date"
						placeholder="Start Date"
						onChange={startDateChange}
						value={StartDate}
					/>
					<input
						className="form-date w-60 rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						id="grid-last-name"
						type="date"
						placeholder="End Date"
						onChange={endDateChange}
						value={EndDate}
					/>
				</div>
				<div className="col-span-12 sm:col-span-7 flex flex-col sm:flex-row justify-center sm:gap-4 items-start sm:justify-end">
					<DownloadReport StartDate={StartDate} EndDate={EndDate} />
				</div>
			</div>
			{isLoading && <Spinner />}
			{!isLoading && (
				<>
					<div className="mt-6 overflow-auto">
						<table className="mb-0.5 is-hoverable w-full text-left">
							<thead className="bg-[#E2E8F0]">
								<tr className="border border-slate-150 font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
									<th className="w-[2rem] px-4 py-3 lg:px-5">#</th>
									<th className="px-4 py-3 lg:px-5">TRAINING NAME</th>
									<th className="px-4 py-3 lg:px-5">SESSION NAME</th>
									<th className="px-4 py-3 lg:px-5">STARTDATE</th>
									<th className="px-4 py-3 lg:px-5">ENDDATE</th>
									<th className=" px-4 py-3 lg:px-5">REGISTERED</th>
									<th className=" px-4 py-3 lg:px-5">ATTENDED</th>
									<th className=" px-4 py-3 lg:px-5">LOCATION</th>
								</tr>
							</thead>
							<tbody className="bg-[#FFFFFF]">
								{TrainingReports?.TrainingReports?.length > 0 ? (
									TrainingReports?.TrainingReports.map((item: any, index: string) => (
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
														{item.TrainingName}
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5 w-[10rem]">
													<div className="flex text-left cursor-pointer">
														<p className="w-[10rem] truncate font-semibold text-[#020A12]/60">
															{item.SessionName}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.StartDateTime?.split("T")[0]}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.EndDateTime?.split("T")[0]}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.TotalRegistered}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.TotalAttended}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{item.Location}
														</p>
													</div>
												</td>
											</tr>
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
													<p className="text-xs+ text-[#020A12]/60">
														No training reports found.
													</p>
												</div>
											</td>
										</tr>
									</>
								)}
							</tbody>
						</table>
					</div>
					{TrainingReports?.TrainingReports?.length > 0 ? (
						<Pagination
							PaginationData={TrainingReports}
							count={10}
							pageNumber={pageNumber}
							setPageNumber={setPageNumber}
							pageSize={pageSize}
							setPageSize={setPageSize}
						/>
					) : null}
				</>
			)}
		</section>
	);
}

export default TrainingReports;
