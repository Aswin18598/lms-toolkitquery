import { formatDate, notify } from "~/helpers";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Training from "./Training";
import Session from "./Session";
import { Icon } from "@iconify/react";
import {
	useCreateTrainingMutation,
	useCreateSessionMutation,
	removeAllInstructorAttendeeList,
	getNewTrainingId,
	getInstructorAttendeeList,
	getSpecificCourseID
} from "~/features/training/store";
import Stepper from "./Stepper";
import { convertLocalISOString } from "~/features/training/constants";

function CreateTrainingSession({ showCreateSessionScreen, closeEditScreen, refetchTraining }: any) {
	const dispatch = useDispatch();
	const [btnText, setBtnText] = useState("Next");
	const [trainingStep, setTrainingStep] = useState(1);
	const [validation, setValidation] = useState<boolean>(false);
	const [sessionvalidation, setSessionValidation] = useState<boolean>(false);
	const [createTraining, { isLoading }] = useCreateTrainingMutation();
	const [createSession, { isLoading: isSessionLoading }] = useCreateSessionMutation();
	const attendeesList = useSelector(getInstructorAttendeeList);
	const SpecificCourseID = useSelector(getSpecificCourseID);
	const trainingFormRef = useRef<any>();
	const sessionFormRef = useRef<any>();
	let trainingId = useSelector(getNewTrainingId);
	const [formValue, setFormValue] = useState({ Name: "", Description: "", Category: "", subCategory: "" });
	const [sessionFormValue, setSessionFormValue] = useState({
		Name: "",
		Description: "",
		Location: "",
		PlatformTypeID: "",
		InstructorName: ""
	});

	function reset(): void {
		if (closeEditScreen) {
			closeEditScreen();
		}
		showCreateSessionScreen(false);
		dispatch(removeAllInstructorAttendeeList());
	}

	const createNewTraining = async (formData: any) => {
		await createTraining(formData).unwrap();
	};

	const createNewSession = async (formData: any) => {
		await createSession(formData).unwrap();
	};

	function checkTimeValid(startTime: string, endTime: string) {
		const StartTime = new Date("01/01/2007 " + startTime).getTime();
		const EndTime = new Date("01/01/2007 " + endTime).getTime();
		return !(StartTime < EndTime);
	}

	function updateStep(stepVal: any): void {
		if (stepVal === "next" && trainingStep === 1) {
			invokeCreateTraining();
		} else if (stepVal === "next" && trainingStep === 2) {
			invokeCreateSession();
		} else if (stepVal === "previous") {
			setBtnText("Next");
			setTrainingStep(step => step - 1);
		}
	}

	function invokeCreateTraining(): void {
		const formState = trainingFormRef.current.formState;
		let payload = trainingFormRef.current.getValues();
		payload.Attendees = attendeesList;
		payload.CourseID = SpecificCourseID;
		if (
			formValue.Description === "" ||
			formValue.Name === "" ||
			formValue.Category === "" ||
			formValue.subCategory === ""
		) {
			setValidation(true);
		} else if (!attendeesList.length) {
			notify("recurly_error", { message: "Attendees cannot be empty" });
		} else {
			createNewTraining(payload)
				.then(data => {
					setBtnText("Create");
					setTrainingStep(step => step + 1);
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		}
	}

	function invokeCreateSession(): void {
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
		} else {
			const payload = updatePayload(formData);
			createNewSession(payload)
				.then(() => {
					if (closeEditScreen) {
						closeEditScreen();
						refetchTraining();
					}
					showCreateSessionScreen(false);
					dispatch(removeAllInstructorAttendeeList());
				})
				.catch(data => {
					notify("recurly_error", { message: data?.data?.Message });
				});
		}
	}

	function updatePayload(data: any) {
		const Begin = convertLocalISOString(new Date(data.StartDate + " " + data.StartTime));
		const End = convertLocalISOString(new Date(data.EndDate + " " + data.EndTime));
		return {
			TrainingID: trainingId,
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

	return (
		<section className="w-full z-[55] h-screen fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex justify-end items-end">
			<main className="bg-white h-full w-full -right-full sm:w-[30vw] absolute sm:-right-[30vw] rounded-tl-lg rounded-bl-lg animate-[canvas-slide_0.3s_ease-in-out_forwards] overflow-hidden">
				<div className="offcanvas-header w-full flex rounded-tl-lg items-center justify-between h-[65px] bg-slate-150 pl-7 p-2">
					<div className="w-full flex">
						<div className="w-[70%] flex">
							<span className="text-sm font-semibold">
								{trainingStep == 1 ? "Create Training" : "Create Session"}
							</span>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<button
							onClick={() => reset()}
							disabled={isLoading || isSessionLoading}
							className="px-[12px] py-[5px] rounded-2xl text-[14px] my-1 bg-white border"
						>
							Cancel
						</button>

						<button
							onClick={() => updateStep("next")}
							disabled={isLoading || isSessionLoading}
							type="submit"
							formTarget="TrainingForm"
							className="px-[12px] py-[5px] mr-3 rounded-2xl text-[14px] my-1 bg-[#1268B3] text-[#ffffff]"
						>
							{btnText}
						</button>
						{(isLoading || isSessionLoading) && (
							<Icon width={22} className="animate-spin mt-2" icon="bx:loader-alt" />
						)}
					</div>
				</div>
				<div className="offcanvas-body bg-white h-[calc(100vh-65px)] w-full flex-grow rounded-bl-lg p-4 pr-6 overflow-y-auto">
					<Stepper step={trainingStep} updateStep={updateStep} />
					{trainingStep == 1 && (
						<Training
							key="createSession"
							ref={trainingFormRef}
							validation={validation}
							formValue={formValue}
							setFormValue={setFormValue}
						/>
					)}
					{trainingStep == 2 && (
						<Session
							key="createSessions"
							ref={sessionFormRef}
							validation={sessionvalidation}
							sessionFormValue={sessionFormValue}
							setSessionFormValue={setSessionFormValue}
						/>
					)}
				</div>
			</main>
		</section>
	);
}

export default CreateTrainingSession;
