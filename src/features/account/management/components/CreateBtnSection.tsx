import { Link } from "react-router-dom";
interface ICreateBtnSectionProps {
	newAssignedLearningDetails: {
		title: string;
		type: number;
	};
	handleCreateLPActionInput: () => void;
}
function CreateBtnSection(props: ICreateBtnSectionProps) {
	const { newAssignedLearningDetails, handleCreateLPActionInput } = props;
	return (
		<div className="flex items-center self-start sm:self-center gap-4">
			<Link to={"/account/management/learning-path"}>
				<button className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4">Cancel</button>
			</Link>
			<button
				className="bg-primary text-white rounded-[30px] text-sm py-2 px-4"
				disabled={!newAssignedLearningDetails?.title}
				onClick={handleCreateLPActionInput}
			>
				Create
			</button>
		</div>
	);
}

export default CreateBtnSection;
