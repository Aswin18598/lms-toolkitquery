import { Spinner } from "~/components/spinner";
interface IEditAssignedLearningSpinnerProps {
	isLearningPathActionInputLoading: boolean;
	isLPItemActionLoading: boolean;
}
function EditAssignedLearningSpinner(props: IEditAssignedLearningSpinnerProps) {
	const { isLPItemActionLoading, isLearningPathActionInputLoading } = props;
	return (
		<>
			{isLearningPathActionInputLoading || isLPItemActionLoading ? (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<Spinner />
				</section>
			) : null}
		</>
	);
}

export default EditAssignedLearningSpinner;
