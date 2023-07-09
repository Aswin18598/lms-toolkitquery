import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetPlatformsQuery } from "../store";
import { sessionValidationSchema } from "../validation";

interface Iprop {
	StartTime: any;
	setStartTime: any;
	setEndTime: any;
	EndTime: any;
	StartDate: any;
	setStartDate: any;
	EndDate: any;
	setEndDate: any;
}
const SessionCalendar = ({
	StartTime,
	setStartTime,
	setEndTime,
	EndTime,
	StartDate,
	setStartDate,
	EndDate,
	setEndDate
}: Iprop) => {
	const [timeDiff, setTimeDiff] = useState("");

	const { register, setValue, getValues, reset, formState } = useForm({
		resolver: yupResolver(sessionValidationSchema),
		mode: "onChange"
	});

	const maxDate = setMinDate();
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

	function setMinDate() {
		const dtToday = new Date(),
			month = dtToday.getMonth() + 1,
			day = dtToday.getDate(),
			year = dtToday.getFullYear();
		return (
			year + "-" + (month < 10 ? "0" + month.toString() : month) + "-" + (day < 10 ? "0" + day.toString() : day)
		);
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
			if (hourDiff < 1) {
				setTimeDiff("30 mins");
			} else {
				setTimeDiff(hourDiff + " hrs");
			}
		} else {
			setTimeDiff("Invalid Time");
		}
	}
	return (
		<div className="flex flex-wrap mb-7">
			<div className="p-2 pr-4">
				<Icon icon="ic:outline-date-range" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
			</div>

			<div className="flex flex-col space-y-1 w-10/12">
				<div className="flex space-x-4 mb-5">
					<input
						className="form-date mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						id="first-name"
						type="date"
						placeholder="Jane"
						onChangeCapture={startDateChange}
						min={maxDate}
						value={StartDate}
						{...register("StartDate")}
					/>
					<input
						className="form-date mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-2 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
						id="grid-last-name"
						type="date"
						placeholder="Doe"
						onChangeCapture={endDateChange}
						min={maxDate}
						value={EndDate}
						{...register("EndDate")}
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
				{timeDiff && <span>Duration: {timeDiff}</span>}
			</div>
		</div>
	);
};

export default SessionCalendar;
