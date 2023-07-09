import { notify } from "~/helpers";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { Modal } from "~/components";
import {
	useGetSessionBySessionIdQuery,
	handleReadOnlySession,
	useGetPlatformsQuery,
	removeAllInstructorAttendeeList,
	useUpdateSessionMutation,
	useDeleteSessionMutation,
	getInstructorAttendeeList
} from "~/features/training/store";
import { Spinner } from "~/components/spinner";
import Session from "./Session";
import { convertLocalISOString } from "~/features/training/constants";

function ReadOnlySession({ sessionId, reload }: any) {
	const dispatch = useDispatch();
	const { data: platforms } = useGetPlatformsQuery({});
	const { data, ...config } = useGetSessionBySessionIdQuery({ Id: sessionId });
	const [updateSession, { isLoading: isUpdateLoading }] = useUpdateSessionMutation();
	const [deleteSession, { isLoading: isSessionDeleteProgress }] = useDeleteSessionMutation();
	const attendeesList = useSelector(getInstructorAttendeeList);
	const [session, setSession] = useState<any>();
	const [readOnlySession, setReadOnlySession] = useState<any>({});
	const [isEditSession, setIsEditSession] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const sessionFormRef = useRef<any>();

	useEffect(() => {
		if (data?.Data?.TrainingSessionID) {
			setSession(data.Data);
			splitDateAndTime(data.Data);
		}
	}, [data?.Data]);

	const getPlatformType = (platformTypeId: any) => {
		const filterPlatform = platforms?.Data?.filter((platform: any) => {
			return platform.PlatformTypeID == platformTypeId;
		});
		return filterPlatform && filterPlatform.length ? filterPlatform[0].PlatformTypeName : "--";
	};

	const editSession = async () => {
		const formState = sessionFormRef.current.formState;
		const formData = sessionFormRef.current.getValues();
		if (!formState.isValid) {
			notify("recurly_error", { message: "Form is invalid" });
		} else if (!formData.StartDate || !formData.EndDate || formData.StartDate > formData.EndDate) {
			notify("recurly_error", { message: "Please, Check StartDate and EndDate" });
		} else if (!attendeesList.length) {
			notify("recurly_error", { message: "Attendees cannot be empty" });
		} else if (formState.isValid) {
			const payload = updatePayload(formData);
			await updateSession(payload)
				.unwrap()
				.then(() => {
					closeScreen();
					dispatch(removeAllInstructorAttendeeList());
					reload();
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		}
	};

	const removeSession = async (session: any) => {
		setShowModal(false);
		await deleteSession(session)
			.unwrap()
			.then(data => {
				closeScreen();
				reload();
				dispatch(removeAllInstructorAttendeeList());
			})
			.catch(data => {
				notify("recurly_error", data);
			});
	};

	function updatePayload(data: any) {
		const Begin = convertLocalISOString(new Date(data.StartDate + " " + data.StartTime));
		const End = convertLocalISOString(new Date(data.EndDate + " " + data.EndTime));
		return {
			TrainingID: data.TrainingID,
			TrainingSessionID: data.TrainingSessionID,
			Name: data.Name,
			Description: data.Description,
			StartDateTime: Begin,
			EndDateTime: End,
			Recurrence: Number(data.Recurrence),
			Location: data.Location,
			PlatformTypeID: Number(data.PlatformTypeID),
			InstructorName: data.InstructorName,
			Attendees: attendeesList,
			TimeZone: "India Standard Time",
			MeetingID: session.MeetingID,
			EventID: session.EventID
		};
	}

	function closeScreen(): void {
		dispatch(handleReadOnlySession({}));
	}

	function calculateTimeDiff(StartTime: any, EndTime: any) {
		if (!StartTime || !EndTime) return;
		const startTime = new Date("01/01/2007 " + StartTime).valueOf();
		const endTime = new Date("01/01/2007 " + EndTime).valueOf();
		const hourDiff = (endTime - startTime) / 60 / 60 / 1000;
		if (hourDiff > 0) {
			if (hourDiff < 1) {
				return "30 mins";
			} else {
				return hourDiff + " hrs";
			}
		}
	}

	function splitDateAndTime(data: any): void {
		const startDateTime = new Date(data.StartDateTime);
		const endDateTime = new Date(data.EndDateTime);
		const endTime = endDateTime.getHours() + ":" + endDateTime.getMinutes();
		const startTime = startDateTime.getHours() + ":" + startDateTime.getMinutes();
		const obj = {
			Name: data.Name,
			Description: data.Description,
			StartDateTime: data.StartDateTime,
			EndDateTime: data.EndDateTime,
			Duration: calculateTimeDiff(startTime, endTime),
			StartDate: new Date(data.StartDateTime).toLocaleDateString("en-us", {
				weekday: "long",
				year: "numeric",
				month: "short",
				day: "numeric"
			}),
			StartTime: new Date(data.StartDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
			EndDate: new Date(data.EndDateTime).toLocaleDateString("en-us", {
				weekday: "long",
				year: "numeric",
				month: "short",
				day: "numeric"
			}),
			EndTime: new Date(data.EndDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
			Recurrence: "Does not repeat",
			Location: data.Location,
			PlatformType: getPlatformType(data.PlatformTypeID),
			InstructorName: data.InstructorName,
			TrainingSessionID: data.TrainingSessionID,
			TrainingID: data.TrainingID,
			TrainingName: data.TrainingName,
			Attendees: data.Attendees
		};
		setReadOnlySession(obj);
	}
	console.log("session", session);

	return (
		<>
			<Modal position="right" className="w-1/3 h-screen">
				<div className="offcanvas-header flex items-center justify-between mb-5 bg-slate-150 pl-7 p-2">
					<div className="w-full flex">
						<div className="w-[70%] flex">
							<span className="text-sm font-semibold">
								{!isEditSession ? "Session Details" : "Edit Session"}
							</span>
						</div>
					</div>
					<div className="flex flex-row items-center gap-2">
						<a
							title="Join Meeting"
							className="px-[10px] py-[7px] rounded-2xl text-[14px] my-1 bg-white border cursor-pointer disabled:cursor-not-allowed"
							href={`${session?.MeetingUrl}`}
							target="_blank"
						>
							<Icon icon="ic:outline-date-range" width={16} color="blue" />
						</a>
						{session?.IsPrivileged === "Yes" && (
							<button
								title="Delete"
								className="px-[10px] py-[7px] rounded-2xl text-[14px] my-1 bg-white border cursor-pointer disabled:cursor-not-allowed"
								onClick={() => setShowModal(true)}
								disabled={session?.IsPrivileged === "No"}
							>
								<Icon width={16} icon="mingcute:delete-2-line" color="#d01" />
							</button>
						)}
						<button
							className="px-[12px] py-[5px] rounded-2xl text-[14px] my-1 bg-white border"
							onClick={() => closeScreen()}
						>
							Cancel
						</button>
						{!isEditSession && session?.Status != "Ended" && (
							<button
								className="px-[12px] py-[5px] rounded-2xl text-[14px] bg-[#1268B3] text-[#ffffff]"
								onClick={() => setIsEditSession(true)}
							>
								Edit
							</button>
						)}
						{isEditSession && (
							<button
								className="px-[12px] py-[5px] rounded-2xl text-[14px] bg-[#1268B3] text-[#ffffff]"
								onClick={() => editSession()}
							>
								Update
							</button>
						)}
					</div>
				</div>

				<div className="offcanvas-body flex-grow p-4 pr-6 overflow-y-auto training-height">
					{(config.isLoading ||
						config.status != "fulfilled" ||
						isUpdateLoading ||
						isSessionDeleteProgress) && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
							<Spinner />
						</div>
					)}

					{!isEditSession && (
						<section className="session-form">
							<form>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="TrainingName">
										<Icon
											icon="mingcute:grid-line"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">{readOnlySession.TrainingName}</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="Name">
										<Icon
											icon="mingcute:grid-line"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">{readOnlySession.Name}</div>
								</div>
								<div className="flex mb-7">
									<div className="p-2 pr-4" title="Description">
										<Icon
											icon="mingcute:grid-line"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">{readOnlySession.Description}</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="Date and Time">
										<Icon
											icon="ic:outline-date-range"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">
										<div>{readOnlySession.StartDate}</div>
										<div>{readOnlySession.StartTime + " - " + readOnlySession.EndTime}</div>
										<div>{`Duration: ${readOnlySession.Duration}`}</div>
									</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="Recurrence">
										<Icon
											icon="ri:repeat-2-fill"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">{readOnlySession.Recurrence}</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="Location">
										<Icon
											icon="carbon:location"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">
										<div>{readOnlySession?.Location}</div>
									</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="Teams">
										<Icon
											icon="mingcute:link-2-line"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">
										<div>{readOnlySession?.PlatformType}</div>
									</div>
								</div>
								<div className="flex items-center mb-7">
									<div className="p-2 pr-4" title="InstructorName">
										<Icon
											icon="radix-icons:avatar"
											className="h-6 w-6 text-slate-500 dark:text-navy-100"
										/>
									</div>
									<div className="w-full">{readOnlySession.InstructorName}</div>
								</div>
								{readOnlySession?.Attendees?.length && (
									<div className="flex items-center mb-7">
										<div className="p-2 pr-4" title="Attendees">
											<Icon
												icon="fluent:people-20-regular"
												className="h-6 w-6 text-slate-500 dark:text-navy-100"
											/>
										</div>
										<div className="w-full">{`${readOnlySession.Attendees.length} Attendees`}</div>
									</div>
								)}
							</form>
						</section>
					)}

					{isEditSession && (
						<>
							<div className="flex items-center mb-1 pr-6 pl-4">
								<div className="p-2 pr-4" title="TrainingName">
									<Icon
										icon="mingcute:grid-line"
										className="h-6 w-6 text-slate-500 dark:text-navy-100"
									/>
								</div>
								<input
									disabled
									value={readOnlySession.TrainingName}
									type="text"
									className=" mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
								/>
							</div>
							<Session session={session} ref={sessionFormRef} />
						</>
					)}
				</div>
				{showModal ? (
					<>
						<div className="fixed inset-0 z-10 overflow-y-auto">
							<div
								className="fixed inset-0 w-full h-full bg-black opacity-40"
								onClick={() => setShowModal(false)}
							></div>
							<div className="flex items-center min-h-screen px-4 py-8">
								<div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
									<div className="mt-3 sm:flex">
										<div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-6 h-6 text-red-600"
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
													className="w-full mt-2 p-2.5 flex-1 text-white bg-[#1268B3] rounded-md outline-none ring-offset-2 ring-red-600"
													onClick={() => removeSession(session)}
												>
													Delete
												</button>
												<button
													className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600"
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
					</>
				) : null}
			</Modal>
		</>
	);
}

export default ReadOnlySession;
