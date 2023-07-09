import React from "react";
import { useLocation } from "react-router-dom";

interface IAssignLearningPathSectionProps {
	handleUpdateLPActionInput: () => undefined;
	isFieldEdited: boolean;
	setIsFieldEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
function AssignLearningPathSection(props: IAssignLearningPathSectionProps) {
	const { handleUpdateLPActionInput, isFieldEdited, setIsFieldEdited } = props;
	const location = useLocation();
	return location.pathname.includes("edit") && isFieldEdited ? (
		<div className="flex items-center gap-2">
			<button
				className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4"
				onClick={() => setIsFieldEdited(false)}
			>
				Cancel
			</button>
			<button
				className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
				onClick={handleUpdateLPActionInput}
			>
				Update
			</button>
		</div>
	) : null;
}

export default AssignLearningPathSection;
