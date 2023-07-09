import { useState } from "react";
import { notify } from "~/helpers";
import { Icon } from "@iconify/react";
import {
	useDeleteTrainingMutation,
	useDeleteSessionMutation,
	useGetSessionAttendanceReportMutation,
	setShowFeedbackModel
} from "../store";
import { Modal } from "~/components";
import { dispatch, useAppSelector } from "~/config/store";

interface IActionItemsProps {
	type: string;
	item: any;
	edit: Function;
	refetch: Function;
	refetchTraining: Function;
	SessionPrivileged?: any;
	TrainPrivileged?: any;
}

function TrainingActionItems({
	type,
	item,
	edit,
	refetch,
	refetchTraining,
	TrainPrivileged,
	SessionPrivileged
}: IActionItemsProps) {
	const [deleteTraining, { isLoading: isTrainingDeleteLoading }] = useDeleteTrainingMutation();
	const [deleteSession, { isLoading: isSessionDeleteProgress }] = useDeleteSessionMutation();
	const [getSessionAttendanceReport, getDownloadReportOption] = useGetSessionAttendanceReportMutation();
	const { FeedBackSessionsList } = useAppSelector((state: any) => state.instructor);
	const [showModal, setShowModal] = useState(false);
	const removeTraining = async (item: any) => {
		if (type == "session") {
			setShowModal(false);
			await deleteSession(item)
				.unwrap()
				.then(data => {
					refetch();
					refetchTraining();
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		} else {
			setShowModal(false);
			await deleteTraining({ Id: item.TrainingID })
				.unwrap()
				.then(data => {
					refetch();
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		}
	};

	const downloadReport = async (session: any) => {
		await getSessionAttendanceReport({ Id: session.MeetingID })
			.unwrap()
			.then(resp => {
				if (resp.Data) {
					downloadReportAsFile(resp.Data, "AttendanceReport");
				}
			})
			.catch(data => {
				notify("recurly_error", { message: data?.data?.Message });
			});
	};

	function downloadReportAsFile(data: any, name: string): void {
		const convertedCSV = formMeetingDetails(data);
		const blob = new Blob([convertedCSV], { type: "text/csv; charset=utf-8;" });
		const downloadUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.setAttribute("href", downloadUrl);
		anchor.setAttribute("download", name + ".csv");
		document.body.appendChild(anchor); // required for firefox
		anchor.click();
		anchor.remove();
	}

	function formMeetingDetails(items: any) {
		const meetingDetailsMap: any = {
			SessionName: "Meeting Title",
			CourseName: "Course Name",
			TrainingName: "Training Name",
			TotalParticipantCount: "Attended",
			StartTime: "Start Time",
			EndTime: "End Time"
		};
		let meetingDetailContent = "";
		for (let i = 0; i < items.length; i++) {
			for (let index in items[i]) {
				if (index === "Participants") {
					meetingDetailContent += "\r\n\r\n";
					const formattedStr = formatParticipantsList(items[i][index]);
					meetingDetailContent += formattedStr + "\r\n";
				} else if (index === "StartTime" || index === "EndTime") {
					meetingDetailContent += meetingDetailsMap[index] + "," + formatDate(items[i][index]) + "\r\n";
				} else {
					meetingDetailContent += meetingDetailsMap[index] + "," + items[i][index] + "\r\n";
				}
			}
		}
		return meetingDetailContent;
	}

	function formatSecToTime(seconds: number) {
		let date = new Date(0);
		date.setSeconds(seconds);
		return date.toISOString().substr(11, 8);
	}

	function formatDate(dateStr: string) {
		let date = new Date(dateStr);
		let hours = date.getHours();
		let minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const AMPM = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 ? hours : 12;
		const mins = minutes < 10 ? "0" + minutes : minutes;
		const strTime = hours + ":" + mins + ":" + seconds + " " + AMPM;
		return (date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime).toString();
	}

	function formatParticipantsList(items: any) {
		const participantsDetailsMap: any = {
			Email: "Email",
			Role: "Role",
			JoinedAt: "JoinedAt",
			LeftAt: "LeftAt",
			TotalDurationInSeconds: "In-meeting duration"
		};
		let participantsListContent = "Email, Role, Joined At, Left At, In-meeting Duration" + "\r\n";
		for (let i = 0; i < items.length; i++) {
			for (let index in items[i]) {
				if (index === "Attendances") {
					const attendees = items[i][index][0];
					participantsListContent +=
						formatDate(attendees.JoinedAt) + "," + formatDate(attendees.LeftAt) + ",";
				} else if (index === "TotalDurationInSeconds") {
					participantsListContent += formatSecToTime(items[i][index]) + ",";
				} else if (participantsDetailsMap[index]) participantsListContent += items[i][index] + ",";
			}
			participantsListContent += "\r\n";
		}
		return participantsListContent;
	}

	return (
		<>
			<div>
				{type == "training" && TrainPrivileged === "Yes" && (
					<div className="flex items-center space-x-2 text-left">
						<button
							title="Edit"
							className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
							disabled={TrainPrivileged === "No"}
							onClick={() => edit(item)}
						>
							<Icon className="w-4 h-4" icon="cil:pencil" />
						</button>
						<button
							title="Delete"
							className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
							disabled={TrainPrivileged === "No"}
							onClick={() => setShowModal(true)}
						>
							{!isTrainingDeleteLoading && <Icon className="w-4 h-4" icon="mingcute:delete-2-line" />}
							{isTrainingDeleteLoading && <Icon className="animate-spin w-4 h-4" icon="bx:loader-alt" />}
						</button>
					</div>
				)}

				{type == "session" && (
					<div className="flex items-center space-x-2 text-left">
						{FeedBackSessionsList.length > 0 ? (
							<button
								title="FeedBack"
								className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer"
								onClick={() => dispatch(setShowFeedbackModel(true))}
							>
								<img src="/assets/images/chat-active.svg" alt="FeedBack" />
							</button>
						) : (
							<img src="/assets/images/chat_inactive.svg" alt="FeedBack" />
						)}
						{item.Status != "Ended" && SessionPrivileged === "Yes" && (
							<button
								title="Edit"
								className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
								disabled={SessionPrivileged === "No" || item.Status == "Ended"}
								onClick={() => edit(item)}
							>
								<Icon className="w-4 h-4" icon="cil:pencil" />
							</button>
						)}
						{item.Status == "Ended" && SessionPrivileged === "Yes" && (
							<button
								title="Download"
								disabled={SessionPrivileged === "No"}
								className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
								onClick={() => downloadReport(item)}
							>
								{!getDownloadReportOption.isLoading && (
									<Icon className="w-4 h-4" icon="fluent:people-20-regular" />
								)}
								{getDownloadReportOption.isLoading && (
									<Icon className="animate-spin w-4 h-4" icon="bx:loader-alt" />
								)}
							</button>
						)}
						{/* <button
							title="Meeting"
							disabled={item.Status != "Ended"}
							className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
						>
							<Icon className="w-4 h-4" icon="gala:video" />
						</button> */}
						{SessionPrivileged === "Yes" && (
							<button
								title="Delete"
								className="text-sm font-dmsans text-[#020A12]/60 cursor-pointer disabled:cursor-not-allowed"
								disabled={SessionPrivileged === "No"}
								onClick={() => setShowModal(true)}
							>
								{!isSessionDeleteProgress && <Icon className="w-4 h-4" icon="mingcute:delete-2-line" />}
								{isSessionDeleteProgress && (
									<Icon className="animate-spin w-4 h-4" icon="bx:loader-alt" />
								)}
							</button>
						)}
					</div>
				)}
			</div>
			{showModal ? (
				<Modal>
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div
							className="fixed inset-0 w-full h-full bg-black opacity-40"
							onClick={() => setShowModal(false)}
						></div>
						<div className="flex items-center min-h-screen px-4 py-8">
							<div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
								<div className="mt-3 sm:flex">
									<div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-[#dae7f3] rounded-full">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-6 h-6 text-[#1268B3]"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="text-center sm:ml-4 sm:text-left">
										<h4 className="text-lg font-medium text-gray-800">Delete record ?</h4>
										<p className="mt-2 text-[15px] mr-10 sm:mr-8 leading-relaxed text-gray-500">
											Are you sure you want to delete this record ?
										</p>
										<div className="items-center gap-2 mt-3 sm:flex">
											<button
												className="w-[50%] mt-2 p-2.5 flex-1 text-white bg-[#1268B3] rounded-md outline-none ring-offset-2 ring-red-600"
												onClick={() => removeTraining(item)}
											>
												Delete
											</button>
											<button
												className="w-[50%] mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600"
												onClick={() => setShowModal(false)}
											>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			) : null}
		</>
	);
}

export default TrainingActionItems;
