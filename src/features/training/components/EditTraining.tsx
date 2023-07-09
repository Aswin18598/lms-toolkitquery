import { notify } from "~/helpers";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	useUpdateTrainingMutation,
	getInstructorAttendeeList,
	removeAllInstructorAttendeeList,
	useGetTrainingByTrainingIdQuery,
	useGetCourseTitlesQuery,
	getSpecificCourseID
} from "~/features/training/store";
import { Spinner } from "~/components/spinner";
import FileUpload from "./FileUpload";
import Training from "./Training";
import { Icon } from "@iconify/react";
import { Modal } from "~/components";

interface IProps {
	trainingData: any;
	showTrainingEditScreen: any;
	refetch: Function;
}

function EditTraining({ trainingData, showTrainingEditScreen, refetch }: IProps) {
	const trainingFormRef = useRef<any>();
	const dispatch = useDispatch();
	const [updateTraining, { isLoading }] = useUpdateTrainingMutation();
	const attendeesList = useSelector(getInstructorAttendeeList);
	const SpecificCourseID = useSelector(getSpecificCourseID);
	const [validation, setValidation] = useState<boolean>(false);
	const { data, ...config } = useGetTrainingByTrainingIdQuery({ Id: trainingData.TrainingID });
	const [formValue, setFormValue] = useState({
		Name: trainingData?.Name,
		Description: trainingData?.Description,
		Category: trainingData?.Category,
		subCategory: trainingData?.subCategory
	});

	const CourseTitle = useGetCourseTitlesQuery(
		{ CategoryID: data?.Data.Category, SubCategoryID: data?.Data.SubCategory },
		{ skip: data?.Data.Category === undefined }
	);

	const updateTrainings = async (formData: any) => {
		await updateTraining(formData).unwrap();
	};

	function saveTraining(): void {
		const formValue = trainingFormRef.current.getValues();
		formValue.TrainingID = trainingData.TrainingID;
		formValue.CourseID = SpecificCourseID === "" ? trainingData.CourseID : SpecificCourseID;
		formValue.Attendees = attendeesList;
		if (formValue.Description === "" || formValue.Name === "") {
			setValidation(true);
		}
		if (!attendeesList.length) {
			notify("recurly_error", { message: "Attendees cannot be empty" });
		} else {
			updateTrainings(formValue)
				.then(() => {
					showTrainingEditScreen(false);
					dispatch(removeAllInstructorAttendeeList());
					refetch();
				})
				.catch(error => {
					// notify("recurly_error", { message: "Form is invalid" });
				});
		}
	}

	function closeEditScreen(): void {
		showTrainingEditScreen(false);
		dispatch(removeAllInstructorAttendeeList());
	}

	return (
		<>
			<Modal position="right" className="w-1/3 h-screen">
				<div className="offcanvas-header flex items-center justify-between mb-5 bg-slate-150 pl-7 p-2">
					<div className="w-full flex">
						<div className="w-[70%] flex">
							<span className="text-sm font-semibold">Edit Training</span>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<button
							onClick={() => closeEditScreen()}
							disabled={isLoading}
							className="px-[12px] py-[5px] rounded-2xl text-[14px] my-1 bg-white border"
						>
							Cancel
						</button>

						<button
							onClick={() => saveTraining()}
							disabled={isLoading}
							className="px-[12px] py-[5px] mr-3 rounded-2xl text-[14px] my-1 bg-[#1268B3] text-[#ffffff]"
						>
							Update
						</button>
						{isLoading && <Icon width={22} className="animate-spin mt-2" icon="bx:loader-alt" />}
					</div>
				</div>

				<div className="offcanvas-body flex-grow p-4 pr-6 overflow-y-auto">
					{(config.isLoading || config.status == "pending") && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
							<Spinner />
						</div>
					)}
					<Training
						data={data?.Data}
						updateCourse={CourseTitle}
						Edit
						ref={trainingFormRef}
						formValue={formValue}
						setFormValue={setFormValue}
						validation={validation}
					/>
				</div>
			</Modal>
		</>
	);
}

export default EditTraining;
