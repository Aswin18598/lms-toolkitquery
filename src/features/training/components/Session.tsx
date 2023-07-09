import React, { forwardRef, useImperativeHandle } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import { Icon } from "@iconify/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { sessionValidationSchema } from "~/features/training/validation";
import {
	getInstructorAttendeeList,
	handleInstructorAttendeeList,
	useGetPlatformsQuery,
	removeInstructorAttendeeList,
	removeAllInstructorAttendeeList,
	useValidateUserMutation
} from "~/features/training/store";
import { formatDate, getCurrentDate, getCurrentHour, getCurrentMinute, regex, setMinDate } from "~/helpers";
import { useAppSelector } from "~/config/store";
import { toast } from "react-hot-toast";
import SessionCalendar from "./SessionCalendar";

interface IPlatformTypeProps {
	PlatformTypeID: number;
	PlatformTypeName: string;
}

const Session = forwardRef(({ session, validation, setSessionFormValue, sessionFormValue }: any, ref) => {
	const dispatch = useDispatch();
	const currentDate = getCurrentDate();
	const CurrentHour = getCurrentHour();
	const CurrentMinute = getCurrentMinute();
	const attendeesList = useSelector(getInstructorAttendeeList);
	const [StartDate, setStartDate] = useState(currentDate);
	const [EndDate, setEndDate] = useState(currentDate);
	const [userName, setUserName] = useState(null);
	const [StartTime, setStartTime] = useState("");
	const [EndTime, setEndTime] = useState("");
	const [timeDiff, setTimeDiff] = useState("");

	// const timeRanges = getTimeRanges();
	const { data } = useGetPlatformsQuery({});
	const maxDate = setMinDate();
	const { InstructorAttendeeList } = useAppSelector((state: any) => state.instructor);
	const [validateUser] = useValidateUserMutation();

	const { register, setValue, getValues, reset, formState } = useForm({
		resolver: yupResolver(sessionValidationSchema)
	});
	const { errors, isDirty, isValid } = formState;
	useImperativeHandle(ref, () => ({
		getValues: getValues,
		formState: formState
	}));

	useEffect(() => {
		setStartTime(CurrentHour + ":" + CurrentMinute);
		setEndTime(
			(CurrentMinute === "30" ? CurrentHour + 1 : CurrentHour) + ":" + (CurrentMinute === "30" ? "00" : "30")
		);
	}, [CurrentHour, CurrentMinute]);

	useEffect(() => {
		if (session?.TrainingSessionID) {
			splitDateAndTime(session);
			if (session.Attendees?.length) {
				dispatch(removeAllInstructorAttendeeList());
				dispatch(handleInstructorAttendeeList(session.Attendees));
			}
		} else {
			reset({
				Name: "",
				Description: "",
				StartDate: StartDate,
				EndDate: EndDate,
				StartTime: CurrentHour + ":" + CurrentMinute,
				EndTime:
					(CurrentMinute === "30" ? CurrentHour + 1 : CurrentHour) +
					":" +
					(CurrentMinute === "30" ? "00" : "30"),
				Recurrence: false,
				Location: "",
				PlatformTypeID: 1,
				InstructorName: ""
			});
		}
	}, [session]);

	function splitDateAndTime(data: any): void {
		const startDateTime = new Date(data.StartDateTime);
		const endDateTime = new Date(data.EndDateTime);
		setEndTime(endDateTime.getHours() + ":" + (endDateTime.getMinutes() === 0 ? "00" : "30"));
		setStartTime(startDateTime.getHours() + ":" + (startDateTime.getMinutes() === 0 ? "00" : "30"));
		setStartDate(formatDate(startDateTime));
		setEndDate(formatDate(endDateTime));
		reset({
			Name: data.Name,
			Description: data.Description,
			StartDate: formatDate(startDateTime),
			EndDate: formatDate(endDateTime),
			StartTime: startDateTime.getHours() + ":" + (startDateTime.getMinutes() === 0 ? "00" : "30"),
			EndTime: endDateTime.getHours() + ":" + (endDateTime.getMinutes() === 0 ? "00" : "30"),
			Recurrence: data.Recurrence === 1 ? true : false,
			Location: data.Location,
			PlatformTypeID: data.PlatformTypeID,
			InstructorName: data.InstructorName,
			TrainingSessionID: data.TrainingSessionID,
			TrainingID: data.TrainingID
		});
	}

	function removeAttendee(index: number): void {
		dispatch(removeInstructorAttendeeList(index));
	}

	function removeAllAttendee(): void {
		dispatch(removeAllInstructorAttendeeList());
	}

	// function addAttendeeList(event: any): void {
	// 	let emails = [];
	// 	const emailList = event.target.value.split(";").filter((i: any) => i);
	// 	for (let val of emailList) {
	// 		const trimmedValue = val.trim();
	// 		if (!trimmedValue.match(regex.email)) {
	// 			emails = [];
	// 			break;
	// 		} else {
	// 			emails.push(trimmedValue);
	// 		}
	// 	}
	// 	if (emails.length) {
	// 		setIsEmailValid(true);
	// 		event.target.value = "";
	// 		dispatch(handleInstructorAttendeeList(emails));
	// 	} else if (emailList.length) {
	// 		setIsEmailValid(false);
	// 	}
	// }

	// function getTimeRanges(interval = 30) {
	// 	const ranges = [];
	// 	const date = new Date();
	// 	for (let minutes = 0; minutes < 24 * 60; minutes = minutes + interval) {
	// 		date.setHours(0);
	// 		date.setMinutes(minutes);
	// 		ranges.push({
	// 			label: date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
	// 			value: date.getHours() + ":" + date.getMinutes()
	// 		});
	// 	}
	// 	return ranges;
	// }

	function startTimeChange(event: any): void {
		setStartTime(event.target.value);
		setValue("StartTime", event.target.value);
	}

	function endTimeChange(event: any): void {
		setEndTime(event.target.value);
		setValue("EndTime", event.target.value);
	}

	function startDateChange(event: any): void {
		setStartDate(event.target.value);
		setValue("StartDate", event.target.value);
	}

	function endDateChange(event: any): void {
		setEndDate(event.target.value);
		setValue("EndDate", event.target.value);
	}
	useEffect(() => {
		calculateTimeDiff();
	}, [StartTime, EndTime]);

	function calculateTimeDiff(): void {
		if (!StartTime || !EndTime) return;
		const startTime = new Date("01/01/2007 " + StartTime).valueOf();
		const endTime = new Date("01/01/2007 " + EndTime).valueOf();
		const hourDiff = (endTime - startTime) / 60 / 60 / 1000;
		if (hourDiff > 0) {
			setTimeDiff(hourDiff < 1 ? hourDiff + " mins" : hourDiff + " hrs");
		} else {
			setTimeDiff("Invalid Time");
		}
	}

	const handleBlur = async (event: any) => {
		let emails: string[] = [];
		if (event.key === "Enter" && userName !== null) {
			emails.push(userName);
			event.target.value = "";
			const response = await validateUser({
				UserName: emails
			})
				.unwrap()
				.then((response: any) => {
					if (response.Data.ValidEmail !== undefined) {
						if (!InstructorAttendeeList.includes(response.Data.ValidEmail[0])) {
							dispatch(handleInstructorAttendeeList(response.Data.ValidEmail));
						} else {
							toast.error("Duplicate users");
						}
					} else {
						toast.success(response?.Message);
					}
				})
				.catch(error => {
					toast.error(error?.data.Message);
				});
		}
	};
	const handleChange = (e: any) => {
		e.preventDefault();
		setUserName(e.target.value);
	};

	// useEffect(() => {
	// 	if (ValidateUsers.status === 400) {
	// 		toast.error(ValidateUsers?.data.Message);
	// 	}
	// }, [ValidateUsers]);

	return (
		<>
			<div className="flex-grow p-4 pr-6 overflow-y-auto">
				<section className="session-form">
					<form>
						<div className="flex items-center mb-7">
							<div className="p-2 pr-4" title="Session Name">
								<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
							</div>
							<div className="w-full">
								<input
									type="text"
									className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
									placeholder="Title *"
									{...register("Name")}
									value={sessionFormValue?.Name}
									onChange={e => setSessionFormValue({ ...sessionFormValue, Name: e.target.value })}
								/>
								{sessionFormValue?.Name === "" && validation && (
									<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"* Name is required"}</p>
								)}
							</div>
						</div>
						<div className="flex mb-7">
							<div className="p-2 pr-4" title="Session Description">
								<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
							</div>
							<div className="w-full">
								<textarea
									className="form-textarea dark:focus:border-accent mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
									placeholder="Description *"
									{...register("Description")}
									value={sessionFormValue?.Description}
									onChange={e =>
										setSessionFormValue({ ...sessionFormValue, Description: e.target.value })
									}
								></textarea>
								{sessionFormValue?.Description === "" && validation && (
									<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"*Description is required"}</p>
								)}
							</div>
						</div>
						<div className="flex flex-wrap mb-7">
							<div className="p-2 pr-4" title="Date and Time">
								<Icon
									icon="ic:outline-date-range"
									className="h-6 w-6 text-slate-500 dark:text-navy-100"
								/>
							</div>

							<div className="flex flex-col space-y-1 w-10/12">
								<div className="flex space-x-4 ">
									<input
										className="form-date mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
										id="first-name"
										type="date"
										placeholder="Jane"
										onChange={startDateChange}
										min={maxDate}
										value={StartDate}
									/>
									<input
										className="form-date mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
										id="grid-last-name"
										type="date"
										placeholder="Doe"
										onChange={endDateChange}
										min={StartDate}
										value={EndDate}
									/>
								</div>
								<div className="flex space-x-4 items-center">
									<input
										className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
										name="startTime"
										type="time"
										onChange={startTimeChange}
										value={StartTime}
									/>
									<input
										className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
										name="endTime"
										type="time"
										onChange={endTimeChange}
										value={EndTime}
									/>
								</div>
							</div>
						</div>
						<div className="flex items-center mb-7">
							<div className="p-2 pr-4" title="Location">
								<Icon icon="carbon:location" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
							</div>
							<div className="w-full">
								<input
									type="text"
									className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
									placeholder="Location"
									{...register("Location")}
									value={sessionFormValue?.Location}
									onChange={e =>
										setSessionFormValue({ ...sessionFormValue, Location: e.target.value })
									}
								/>
								{sessionFormValue?.Location === "" && validation && (
									<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"* Location is required"}</p>
								)}
							</div>
						</div>
						<div className="flex items-center mb-7">
							<div className="p-2 pr-4" title="Teams">
								<Icon
									icon="mingcute:link-2-line"
									className="h-6 w-6 text-slate-500 dark:text-navy-100"
								/>
							</div>
							<select
								placeholder="Category"
								{...register("PlatformTypeID")}
								className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
								value={sessionFormValue?.PlatformTypeID}
								onChange={e =>
									setSessionFormValue({ ...sessionFormValue, PlatformTypeID: e.target.value })
								}
							>
								{data?.Data.map((item: IPlatformTypeProps) => {
									return <option value={item.PlatformTypeID}>{item.PlatformTypeName}</option>;
								})}
							</select>
						</div>
						<div className="flex items-center mb-7">
							<div className="p-2 pr-4" title="InstructorName">
								<Icon icon="radix-icons:avatar" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
							</div>
							<div className="w-full">
								<input
									type="text"
									className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
									placeholder="Instructor"
									{...register("InstructorName")}
									value={sessionFormValue?.InstructorName}
									onChange={e =>
										setSessionFormValue({ ...sessionFormValue, InstructorName: e.target.value })
									}
								/>
								{sessionFormValue?.InstructorName === "" && validation && (
									<p className="mt-0.5 ml-1.5 text-xs text-red-600">
										{"* InstructorName is required"}
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center">
							<div className="p-2 pr-4" title="UserName">
								<Icon
									icon="fluent:people-20-regular"
									className="h-6 w-6 text-slate-500 dark:text-navy-100"
								/>
							</div>
							<div className="w-full">
								<input
									type="text"
									className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
									placeholder="Enter UserName"
									onChange={handleChange}
									onKeyDown={handleBlur}
								/>
							</div>
						</div>
						<div className="pl-12 mb-5">
							or you can <FileUpload />
							.csv file
						</div>
					</form>
					<div className="attendees pl-12">
						<div className="flex item-center space-x-1 w-full">
							<span className="w-3/4"> Attendess ({attendeesList.length})</span>
							{attendeesList.length > 0 && (
								<span className="cursor-pointer" onClick={() => removeAllAttendee()}>
									{" "}
									Remove all
								</span>
							)}
						</div>

						<div className="mt-1">
							{attendeesList.map((attendee: any, index: number) => (
								<div key={index} className="flex items-center space-x-1 w-full font-medium mt-1">
									<Icon
										icon="radix-icons:avatar"
										className="h-7 w-7 transition-colors duration-200"
									/>
									<span className="w-[90%]">{attendee}</span>
									<span className="cursor-pointer" onClick={() => removeAttendee(index)}>
										{" "}
										X{" "}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	);
});

export default Session;
