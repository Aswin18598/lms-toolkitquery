import { useState, useEffect, forwardRef, useImperativeHandle, ChangeEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import { Icon } from "@iconify/react";
import { TrainingRequest } from "~/features/training/@types";
import { regex } from "~/helpers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { trainingValidationSchema } from "~/features/training/validation";
import {
	getInstructorAttendeeList,
	handleInstructorAttendeeList,
	removeInstructorAttendeeList,
	removeAllInstructorAttendeeList,
	useGetCategoriesQuery,
	useGetSubCategoriesListQuery,
	setSelectedCatagoryID,
	useGetCourseTitlesQuery,
	setSelectedSubCatagoryID,
	handleCourseID,
	useValidateUserMutation
} from "~/features/training/store";
import FileDownload from "./FileDownload";
import FilterCourse from "./FilterCourse";
import { Spinner } from "~/components/spinner";
import toast from "react-hot-toast";
import { useAppSelector } from "~/config/store";

const Training = forwardRef(({ data, updateCourse, Edit, validation, setFormValue, formValue }: any, ref) => {
	const dispatch = useDispatch();
	const isUpdateMode = data?.TrainingID;
	const attendeesList = useSelector(getInstructorAttendeeList);
	const [userName, setUserName] = useState(null);
	const { register, setValue, getValues, reset, formState } = useForm<TrainingRequest>({
		resolver: yupResolver(trainingValidationSchema),
		mode: "onChange"
	});
	const { InstructorAttendeeList } = useAppSelector((state: any) => state.instructor);
	const [validateUser, { isLoading }] = useValidateUserMutation();
	const { errors, isDirty, isValid } = formState;

	useImperativeHandle(ref, () => ({
		getValues: getValues,
		formState: formState
	}));

	useEffect(() => {
		if (isUpdateMode) {
			reset(data);
			if (data?.Attendees?.length) {
				dispatch(removeAllInstructorAttendeeList());
				dispatch(handleInstructorAttendeeList(data.Attendees));
			}
		}
	}, [data]);

	// 	function checkAlphaNumeric(e): void {
	// 		const value = e.target.value;
	// 		if (!value.match(regex.alphaNumeric) || value === '') {
	// 			setIsTitleValid(false);
	// 		} else {
	// 			setIsTitleValid(true);
	// 		}
	//
	// 		setTrainingName(e.target.value);
	// 	}

	function removeAttendee(index: number): void {
		dispatch(removeInstructorAttendeeList(index));
	}

	function removeAllAttendee(): void {
		dispatch(removeAllInstructorAttendeeList());
	}

	const handleBlur = async (event: any) => {
		let emails: any = [];
		if (event.key === "Enter" && userName !== null) {
			emails.push(userName);
		}
		if (emails.length) {
			event.target.value = "";
			const users: any = {
				UserName: emails
			};
			await validateUser(users)
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

	return (
		<section className="training-form transition duration-300 ease-in-out p-4 w-full">
			<form id="TrainingForm" className="TrainingForm">
				<div className="flex items-center mb-7">
					<div className="p-2 pr-4" title="Training Name">
						<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
					</div>
					<div className="w-full">
						<input
							type="text"
							className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
							placeholder="Name"
							{...register("Name")}
							onChange={e => setFormValue({ ...formValue, Name: e.target.value })}
						/>
						{formValue?.Name === "" && validation && (
							<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"* Name is required"}</p>
						)}
					</div>
				</div>
				<div className="flex mb-7">
					<div className="p-2 pr-4" title="Training Description">
						<Icon icon="mingcute:grid-line" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
					</div>
					<div className="w-full">
						<textarea
							className="form-textarea dark:focus:border-accent mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400"
							placeholder="Description"
							{...register("Description")}
							onChange={e => setFormValue({ ...formValue, Description: e.target.value })}
						></textarea>
						{formValue?.Description === "" && validation && (
							<p className="mt-0.5 ml-1.5 text-xs text-red-600">{"*Description is required"}</p>
						)}
					</div>
				</div>
				<FilterCourse
					updateCourse={updateCourse}
					Edit={Edit}
					data={data}
					validation={validation}
					setFormValue={setFormValue}
					formValue={formValue}
				/>

				<div className="flex items-center">
					<div className="p-2 pr-4" title="UserName">
						<Icon icon="fluent:people-20-regular" className="h-6 w-6 text-slate-500 dark:text-navy-100" />
					</div>
					<div className="w-full">
						<input
							type="text"
							className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
							placeholder="Enter UserName *"
							onChangeCapture={handleChange}
							onKeyDown={handleBlur}
						/>
					</div>
				</div>
				<div className="flex justify-between pl-12 mb-5">
					<div>
						or you can <FileUpload />
						.csv file
					</div>
					<FileDownload />
				</div>
			</form>
			{isLoading && <Spinner />}
			{!isLoading && (
				<div className="attendees pl-12">
					<div className="flex item-center space-x-1 w-full">
						<span className="w-3/4"> Attendess ({attendeesList.length})</span>
						{attendeesList.length > 0 && (
							<span className="cursor-pointer" onClick={() => removeAllAttendee()}>
								Remove all
							</span>
						)}
					</div>

					<div className="mt-1">
						{attendeesList.map((attendee: any, index: number) => (
							<div key={index} className="flex items-center space-x-1 w-full font-medium mt-1">
								<Icon icon="radix-icons:avatar" className="h-7 w-7 transition-colors duration-200" />
								<span className="w-[90%]">{attendee}</span>
								<span className="cursor-pointer" onClick={() => removeAttendee(index)}>
									{" "}
									X{" "}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
});

export default Training;
