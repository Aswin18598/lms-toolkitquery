import React from "react";
interface InewAssignedLearningDetails {
	title: string;
	description: string;
	type: number;
}
interface IEditAssignedLearningDescriptionProps {
	setNewAssignedLearningDetails: React.Dispatch<React.SetStateAction<InewAssignedLearningDetails>>;
	newAssignedLearningDetails: InewAssignedLearningDetails;
	setIsFieldEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
function EditAssignedLearningDescription(props: IEditAssignedLearningDescriptionProps) {
	const { setNewAssignedLearningDetails, newAssignedLearningDetails, setIsFieldEdited } = props;

	return (
		<div>
			<p className="text-sm font-medium">
				Description <span className="text-red-400">*</span>
			</p>
			<textarea
				className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-1.5
                            text-sm
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded-md
                            transition
                            ease-in-out
                            my-1.5
                            resize-none
                            focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
                        "
				rows={4}
				placeholder="Description..."
				value={newAssignedLearningDetails.description}
				onChange={event =>
					setNewAssignedLearningDetails((prev: InewAssignedLearningDetails) => ({
						...prev,
						description: event.target.value
					}))
				}
				onFocus={() => setIsFieldEdited(true)}
			></textarea>
		</div>
	);
}

export default EditAssignedLearningDescription;
