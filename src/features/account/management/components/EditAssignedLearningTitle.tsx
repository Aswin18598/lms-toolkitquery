import React from "react";
interface InewAssignedLearningDetails {
	title: string;
	description: string;
	type: number;
}
interface IEditAssignedLearningTitleProps {
	setNewAssignedLearningDetails: React.Dispatch<React.SetStateAction<InewAssignedLearningDetails>>;
	newAssignedLearningDetails: InewAssignedLearningDetails;
	setIsFieldEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
function EditAssignedLearningTitle(props: IEditAssignedLearningTitleProps) {
	const { setNewAssignedLearningDetails, newAssignedLearningDetails, setIsFieldEdited } = props;
	return (
		<div>
			<p className="text-sm font-medium">
				Title <span className="text-red-400">*</span>
			</p>
			<input
				type="text"
				className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-2
                            text-sm
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded-md
                            transition
                            ease-in-out
                            my-1.5
                            focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
                        "
				placeholder="Learning path"
				onChange={event =>
					setNewAssignedLearningDetails((prev: InewAssignedLearningDetails) => ({
						...prev,
						title: event.target.value
					}))
				}
				onFocus={() => setIsFieldEdited(true)}
				value={newAssignedLearningDetails.title}
			/>
		</div>
	);
}

export default EditAssignedLearningTitle;
