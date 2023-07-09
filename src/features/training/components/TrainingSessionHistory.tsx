import { useState, useEffect } from "react";
import { Spinner } from "~/components/spinner";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import CreateSession from "./CreateSession";
import EditSession from "./EditSession";
import TrainingActionItems from "./TrainingActionItems";
import { useGetAllTrainingsQuery, useGetTrainingSessionsQuery, useDeleteSessionMutation } from "../store";
import { getLoggedUser } from "~/helpers/auth";

interface ISessionHistoryProps {
	clickHide: Function;
	training: any;
	refetchTraining: Function;
}
const TrainingSessionHistory = ({ clickHide, training, refetchTraining }: ISessionHistoryProps) => {
	const dispatch = useDispatch();
	const [showCreateScreen, setShowCreateScreen] = useState(false);
	const [showEditScreen, setShowEditScreen] = useState(false);
	const [sessionData, setSessionData] = useState({});
	const user = getLoggedUser();
	const { PageNumber, PageSize } = useAppSelector((state: any) => state.instructor);
	const { isLoading, refetch } = useGetTrainingSessionsQuery({ Id: training?.TrainingID });
	const { TrainingSessionList } = useAppSelector((state: any) => state.instructor);
	// 	useEffect(() => {
	// 		if (training?.TrainingID) {
	// 			getTrainingSessions({ Id: training.TrainingID })
	// 				.unwrap()
	// 				.then((resp: any) => {
	// 					console.log(resp);
	// 					if (resp.Data) {
	// 						setSessionList(resp.Data);
	// 					}
	// 				});
	// 		}
	// 		// eslint-disable-next-line
	// 	}, [training.TrainingID]);

	function setCreateMode(): void {
		setShowCreateScreen(true);
	}

	function setEditMode(session: any): void {
		setShowEditScreen(true);
		setSessionData(session);
	}

	function getStatusColorCode(status: string) {
		switch (status) {
			case "Upcoming":
				return "text-[#1268B3]";
			case "Ended":
				return "text-[#020A12]/60";
		}
	}

	function formatDate(dateString: any, delimiter: string) {
		const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		const date = new Date(dateString);
		const day = date.getDate(),
			month = monthList[date.getMonth()],
			year = date.getFullYear();
		return "" + (day <= 9 ? "0" + day : day) + delimiter + month + delimiter + year;
	}

	return (
		<>
			{showCreateScreen && (
				<CreateSession
					training={training}
					showCreateScreen={setShowCreateScreen}
					refetch={refetch}
					refetchTraining={refetchTraining}
				/>
			)}
			{showEditScreen && (
				<EditSession
					training={training}
					sessionData={sessionData}
					showEditScreen={setShowEditScreen}
					refetch={refetch}
					refetchTraining={refetchTraining}
				/>
			)}
			{isLoading && (
				<tr>
					<td colSpan={10}>
						<Spinner />
					</td>
				</tr>
			)}
			{!isLoading && (
				<tr
					key={training.TrainingID}
					className="border-y border-transparent border-b-slate-200 text-[#020A12]/60"
				>
					<td colSpan={10}>
						<div className="mt-6 overflow-auto pl-14">
							<div className="pl-5">{training.Description}</div>
							{!TrainingSessionList?.length && (
								<div className="pl-5 mt-2">No sessions available. Create a New Session.</div>
							)}
							{TrainingSessionList?.length >= 1 && (
								<table className="border border-transparent border-b-slate-200 dark:border-b-navy-500 is-hoverable w-full text-left">
									<thead>
										<tr className="font-inter font-medium text-sm text-[#020A1299]/60 rounded-tl-lg">
											<th className="w-[2rem] px-4 py-3 lg:px-5">#</th>
											<th className=" px-4 py-3 lg:px-5">Session Name</th>
											<th className=" px-4 py-3 lg:px-5">Start Date</th>
											<th className=" px-4 py-3 lg:px-5">End Date</th>
											<th className=" px-4 py-3 lg:px-5">Created by</th>
											<th className=" px-4 py-3 lg:px-5">Timings</th>
											<th className=" px-4 py-3 lg:px-5">Location</th>
											<th className=" px-4 py-3 lg:px-5">Status</th>
											<th className=" px-4 py-3 lg:px-5">Action</th>
										</tr>
									</thead>
									<tbody className="bg-[#FFFFFF]">
										{TrainingSessionList?.map((session: any, index: number) => (
											<tr
												key={session?.TrainingSessionID}
												className="border-y border-transparent border-b-slate-200"
											>
												<td className="w-[2rem] whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{index + 1}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{session.Name}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{formatDate(session.StartDateTime, "-")}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{formatDate(session.EndDateTime, "-")}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-1  sm:px-5">
													<div className="flex text-left">
														<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
															{session.CreatedBy}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{new Date(session.StartDateTime).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit"
															}) +
																" - " +
																new Date(session.EndDateTime).toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit"
																})}
															{/* Convert the date format to time without seconds displayed 03:00 */}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{session.Location}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<div className={"text-left " + getStatusColorCode(session.Status)}>
														<p className="text-sm font-dmsans">{session.Status}</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
													<TrainingActionItems
														type="session"
														SessionPrivileged={session.IsPrivileged}
														item={session}
														edit={setEditMode}
														refetch={refetch}
														refetchTraining={refetchTraining}
													/>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
							{(user.UserTypeID === "2" || user.UserTypeID === "4") && (
								<div className="w-full p-2 border border-transparent border-b-slate-200 dark:border-b-navy-500">
									<button
										onClick={() => setCreateMode()}
										className="px-[10px] py-[7px] rounded-2xl text-[14px] font-bold text-[#1268B3]"
									>
										+ Create new
									</button>
								</div>
							)}
							<div className="w-full p-2 text-right">
								<button
									onClick={() => clickHide()}
									className="px-[10px] py-[7px] rounded-2xl text-[14px] font-bold text-[#1268B3]"
								>
									Hide
								</button>
							</div>
						</div>
					</td>
				</tr>
			)}
		</>
	);
};

export default TrainingSessionHistory;
