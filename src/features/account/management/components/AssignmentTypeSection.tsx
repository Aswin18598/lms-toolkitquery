import React from "react";
interface IAssignedDetails {
	title: string;
	type: number;
}
interface IAssignmentTypeSectionProps {
	newAssignedLearningDetails: IAssignedDetails;
	setNewAssignedLearningDetails: React.Dispatch<React.SetStateAction<IAssignedDetails>>;
}
function AssignmentTypeSection(props: IAssignmentTypeSectionProps) {
	const { newAssignedLearningDetails, setNewAssignedLearningDetails } = props;
	return (
		<div className="flex gap-8 my-1.5">
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"assignmentType"}
					id={`assignedLearning`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={1}
					checked={newAssignedLearningDetails.type === 1}
					onChange={event =>
						setNewAssignedLearningDetails((prev: IAssignedDetails) => ({
							...prev,
							type: parseInt(event.target.value)
						}))
					}
				/>
				<label htmlFor={`assignedLearning`} className="ml-5">
					Assign a Learning Path
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`assignedLearning`}
				></label>
			</div>
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"assignmentType"}
					id={`recommended`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={2}
					checked={newAssignedLearningDetails.type === 2}
					onChange={event =>
						setNewAssignedLearningDetails((prev: IAssignedDetails) => ({
							...prev,
							type: parseInt(event.target.value)
						}))
					}
				/>
				<label htmlFor={`recommended`} className="ml-5">
					Recommended Learning
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`recommended`}
				></label>
			</div>
		</div>
	);
}

export default AssignmentTypeSection;
