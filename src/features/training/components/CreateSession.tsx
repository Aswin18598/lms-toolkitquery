import { formatDate, notify } from "~/helpers";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateTrainingSession from "./CreateTrainingSession";
import Session from "./Session";
import { Icon } from "@iconify/react";
import {
	useCreateSessionMutation,
	handleInstructorAttendeeList,
	getInstructorAttendeeList,
	useGetTrainingByTrainingIdQuery,
	removeAllInstructorAttendeeList
} from "~/features/training/store";
import { Modal } from "~/components";
import { convertLocalISOString } from "~/features/training/constants";

interface IProps {
	training?: any;
	sessionData?: any;
	showCreateScreen?: Function;
	refetch?: Function;
	refetchTraining?: Function;
}

function CreateSession({ training, sessionData, showCreateScreen, refetch, refetchTraining }: any) {
	const dispatch = useDispatch();
	const [isCreateSessionScreen, showCreateSessionScreen] = useState(false);
	const [saveSession, { isLoading }] = useCreateSessionMutation();
	const attendeesList = useSelector(getInstructorAttendeeList);
	const sessionFormRef = useRef<any>();
	const { data, ...config } = useGetTrainingByTrainingIdQuery({ Id: training.TrainingID });
	const [sessionvalidation, setSessionValidation] = useState<boolean>(false);
	const [sessionFormValue, setSessionFormValue] = useState({
		Name: "",
		Description: "",
		Location: "",
		PlatformTypeID: "",
		InstructorName: ""
	});

	useEffect(() => {
		if (data?.Data?.Attendees?.length) {
			dispatch(removeAllInstructorAttendeeList());
			dispatch(handleInstructorAttendeeList(data.Data.Attendees));
		}
	}, [data]);

	const createNewSession = async () => {
		const formState = sessionFormRef.current.formState;
		const formData = sessionFormRef.current.getValues();
		setSessionValidation(true);
		if (
			sessionFormValue.Description === "" ||
			sessionFormValue.Name === "" ||
			sessionFormValue.Location === "" ||
			sessionFormValue.InstructorName === ""
		) {
			setSessionValidation(true);
		} else if (formData.StartDate < formatDate(new Date()) || formData.StartDate > formData.EndDate) {
			notify("recurly_error", { message: "Please, Check StartDate and EndDate" });
		} else if (checkTimeValid(formData.StartTime, formData.EndTime)) {
			notify("recurly_error", { message: "EndTime should be greater than StartTime" });
		} else if (!attendeesList.length) {
			notify("recurly_error", { message: "Attendees cannot be empty" });
		} else {
			const payload = updatePayload(formData);
			await saveSession(payload)
				.unwrap()
				.then(() => {
					showCreateScreen(false);
					dispatch(removeAllInstructorAttendeeList());
					refetch();
					refetchTraining();
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		}
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
			TrainingID: training.TrainingID,
			Name: data.Name,
			Description: data.Description,
			StartDateTime: Begin,
			EndDateTime: End,
			Recurrence: Number(data.Recurrence),
			Location: data.Location,
			PlatformTypeID: Number(data.PlatformTypeID),
			InstructorName: data.InstructorName,
			Attendees: attendeesList,
			TimeZone: "India Standard Time"
		};
	}

	function closeEditScreen(): void {
		showCreateScreen(false);
		dispatch(removeAllInstructorAttendeeList());
	}

	return (
		<>
			{!isCreateSessionScreen && (
				<Modal position="right" className="w-1/3 h-screen">
					<div className="offcanvas-header flex items-center justify-between mb-5 bg-slate-150 pl-7 p-2">
						<div className="w-full flex">
							<div className="w-[70%] flex">
								<span className="text-sm font-semibold">Create New Session</span>
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<button
								onClick={() => closeEditScreen()}
								disabled={isLoading}
								className="px-[12px] py-[5px] rounded-2xl text-[14px] my-1 bg-white border"
							>
								Cancel
							</button>

							<button
								onClick={() => createNewSession()}
								disabled={isLoading}
								className="px-[12px] py-[5px] mr-3 rounded-2xl text-[14px] my-1 bg-[#1268B3] text-[#ffffff]"
							>
								Create
							</button>
							{isLoading && <Icon width={22} className="animate-spin mt-2" icon="bx:loader-alt" />}
						</div>
					</div>

					<div className="offcanvas-body flex-grow p-4 pr-6 overflow-y-auto training-height">
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
						<span className="pl-16">
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
							training={training}
							ref={sessionFormRef}
							validation={sessionvalidation}
							sessionFormValue={sessionFormValue}
							setSessionFormValue={setSessionFormValue}
						/>
					</div>
				</Modal>
			)}

			{isCreateSessionScreen && (
				<CreateTrainingSession
					showCreateSessionScreen={showCreateSessionScreen}
					closeEditScreen={closeEditScreen}
					refetchTraining={refetchTraining}
				/>
			)}
		</>
	);
}

export default CreateSession;
