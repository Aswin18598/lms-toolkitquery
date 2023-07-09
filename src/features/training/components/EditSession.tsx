import { formatDate, notify } from "~/helpers";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import { Spinner } from "~/components/spinner";
import CreateTrainingSession from "./CreateTrainingSession";
import Session from "./Session";
import { Icon } from "@iconify/react";
import {
	useCreateSessionMutation,
	useUpdateSessionMutation,
	useGetSessionBySessionIdQuery,
	useDeleteSessionMutation,
	getInstructorAttendeeList,
	removeAllInstructorAttendeeList
} from "~/features/training/store";
import { Modal } from "~/components";
import { convertLocalISOString } from "~/features/training/constants";

interface IProps {
	training?: any;
	sessionData?: any;
	showEditScreen?: Function;
	refetch?: Function;
	refetchTraining?: Function;
}

function EditSession({ training, sessionData, showEditScreen, refetch, refetchTraining }: any) {
	const dispatch = useDispatch();
	const [isCreateSessionScreen, showCreateSessionScreen] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [sessionvalidation, setSessionValidation] = useState<boolean>(false);
	const [updateSession, { isLoading: isUpdateLoading }] = useUpdateSessionMutation();
	const [deleteSession, { isLoading: isSessionDeleteProgress }] = useDeleteSessionMutation();
	const { data, ...config } = useGetSessionBySessionIdQuery({ Id: sessionData.TrainingSessionID });
	const [sessionFormValue, setSessionFormValue] = useState({
		Name: sessionData.Name,
		Description: sessionData.Description,
		Location: sessionData.Location,
		PlatformTypeID: sessionData.PlatformTypeID,
		InstructorName: sessionData.InstructorName
	});

	const attendeesList = useSelector(getInstructorAttendeeList);
	const sessionFormRef = useRef<any>();
	let dataSession = {};
	const editSession = async () => {
		const formState = sessionFormRef.current.formState;
		const formData = sessionFormRef.current.getValues();
		if (
			sessionFormValue.Description === "" ||
			sessionFormValue.Name === "" ||
			sessionFormValue.Location === "" ||
			sessionFormValue.InstructorName === ""
		) {
			setSessionValidation(true);
		} else if (
			!formData.StartDate ||
			!formData.EndDate ||
			formData.StartDate < formatDate(new Date()) ||
			formData.StartDate > formData.EndDate
		) {
			notify("recurly_error", { message: "Please, Check StartDate and EndDate" });
		} else if (checkTimeValid(formData.StartTime, formData.EndTime)) {
			notify("recurly_error", { message: "EndTime should be greater than StartTime" });
		} else if (!attendeesList.length) {
			notify("recurly_error", { message: "Attendees cannot be empty" });
		} else if (formState.isValid) {
			const payload = updatePayload(formData);
			await updateSession(payload)
				.unwrap()
				.then(() => {
					showEditScreen(false);
					dispatch(removeAllInstructorAttendeeList());
					refetch();
				})
				.catch(error => {
					// notify("recurly_error", { message: "Form is invalid" });
				});
		}
	};

	const removeSession = async (session: any) => {
		setShowModal(false);
		await deleteSession(session)
			.unwrap()
			.then(data => {
				showEditScreen(false);
				dispatch(removeAllInstructorAttendeeList());
				refetch();
				refetchTraining();
			})
			.catch(data => {
				notify("recurly_error", { message: data?.data?.Message });
			});
	};

	function showCreateTrainingScreen(): void {
		showCreateSessionScreen(true);
		dispatch(removeAllInstructorAttendeeList());
	}

	function checkTimeValid(startTime: string, endTime: string) {
		const StartTime = new Date("01/01/2007 " + startTime).getTime();
		const EndTime = new Date("01/01/2007 " + endTime).getTime();
		return !(StartTime < EndTime);
	}

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
			MeetingID: sessionData.MeetingID,
			EventID: sessionData.EventID
		};
	}

	function saveSession(): void {
		editSession();
	}

	function closeEditScreen(): void {
		showEditScreen(false);
		dispatch(removeAllInstructorAttendeeList());
	}

	return (
		<>
			{!isCreateSessionScreen && (
				<Modal position="right" className="w-1/3 h-screen">
					<div className="offcanvas-header flex items-center justify-between mb-5 bg-slate-150 pl-7 p-2">
						<div className="w-full flex">
							<div className="w-[70%] flex">
								<span className="text-sm font-semibold">Edit Session</span>
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<button
								title="Delete"
								className="px-[10px] py-[7px] rounded-2xl text-[14px] my-1 bg-white border"
								disabled={isUpdateLoading || isSessionDeleteProgress}
								onClick={() => setShowModal(true)}
							>
								<Icon width={16} icon="mingcute:delete-2-line" color="#d01" />
							</button>
							<button
								onClick={() => closeEditScreen()}
								disabled={isUpdateLoading || isSessionDeleteProgress}
								className="px-[12px] py-[5px] rounded-2xl text-[14px] my-1 bg-white border"
							>
								Cancel
							</button>

							<button
								onClick={() => saveSession()}
								onMouseUp={() => saveSession()}
								disabled={isUpdateLoading || isSessionDeleteProgress}
								className="px-[12px] py-[5px] mr-3 rounded-2xl text-[14px] my-1 bg-[#1268B3] text-[#ffffff]"
							>
								Update
							</button>
							{(isUpdateLoading || isSessionDeleteProgress) && (
								<Icon width={22} className="animate-spin mt-2" icon="bx:loader-alt" />
							)}
						</div>
					</div>

					<div className="offcanvas-body flex-grow p-4 pr-6 overflow-y-auto training-height">
						{(config.isLoading || config.status != "fulfilled") && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
								<Spinner />
							</div>
						)}
						<div className="flex items-center mb-1 pr-6 pl-4">
							<div className="p-2 pr-4">
								<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
							</div>
							<input
								disabled
								value={training.Name}
								type="text"
								className=" mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
							/>
						</div>
						<span className="pl-16" hidden>
							or{" "}
							<span
								className="underline cursor-pointer text-primary"
								onClick={() => showCreateTrainingScreen()}
							>
								create new
							</span>{" "}
							training
						</span>
						<Session
							session={data?.Data}
							ref={sessionFormRef}
							validation={sessionvalidation}
							sessionFormValue={sessionFormValue}
							setSessionFormValue={setSessionFormValue}
						/>
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
														onClick={() => removeSession(sessionData)}
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
			)}

			{isCreateSessionScreen && (
				<CreateTrainingSession
					training={training}
					showCreateSessionScreen={showCreateSessionScreen}
					closeEditScreen={closeEditScreen}
					refetchTraining={refetchTraining}
				/>
			)}
		</>
	);
}

export default EditSession;
