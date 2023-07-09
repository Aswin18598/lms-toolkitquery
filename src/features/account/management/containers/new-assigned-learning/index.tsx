import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { notify } from "~/helpers";
import AssignmentTypeSection from "../../components/AssignmentTypeSection";
import CreateBtnSection from "../../components/CreateBtnSection";
import { useLearningPathActionsInputMutation } from "../../store";

function NewAssignedLearning() {
	const navigate = useNavigate();
	const [newAssignedLearningDetails, setNewAssignedLearningDetails] = useState({
		title: "",
		type: 1
	});
	const [learningPathActionInput, { isLoading: isLearningPathActionInput }] = useLearningPathActionsInputMutation();
	const handleCreateLPActionInput = () => {
		learningPathActionInput({
			Action: "I",
			Name: newAssignedLearningDetails?.title,
			TypeID: newAssignedLearningDetails?.type
		})
			.unwrap()
			.then((response: any) => {
				if (response.Output) {
					navigate(`/account/assigned-learning/edit/${response.Output}`, {
						state: {
							Name: newAssignedLearningDetails.title,
							PathID: response.Output,
							TypeID: newAssignedLearningDetails?.type
						}
					});
				} else {
					notify("newLpCreate", { Message: response?.error?.data?.Message });
					return undefined;
				}
			})
			.catch(error => console.error(error));
	};

	return (
		<section className="w-full h-full px-[var(--margin-x)] sm:px-8]">
			{isLearningPathActionInput && (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<Spinner />
				</section>
			)}
			<div className="flex items-center flex-col sm:flex-row gap-3 justify-between  py-4 md:py-5 lg:py-6">
				<div className="flex items-center gap-3 self-start sm:self-center">
					<h2 className="text-xl font-medium  text-slate-800 dark:text-navy-50 lg:text-2xl">
						Assigned Learning
					</h2>
					<Icon icon={"material-symbols:arrow-forward-ios"} />
					<h2 className="opacity-90 text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">New</h2>
				</div>
				<CreateBtnSection
					newAssignedLearningDetails={newAssignedLearningDetails}
					handleCreateLPActionInput={handleCreateLPActionInput}
				/>
			</div>
			<section className="w-full p-5 rounded-md bg-white flex flex-col gap-4 mb-5">
				{/* title section */}
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
							setNewAssignedLearningDetails(prev => ({ ...prev, title: event.target.value }))
						}
						value={newAssignedLearningDetails.title}
					/>
				</div>
				<p className="text-sm font-medium mt-4">Select Assignment Type</p>
				<AssignmentTypeSection
					newAssignedLearningDetails={newAssignedLearningDetails}
					setNewAssignedLearningDetails={setNewAssignedLearningDetails}
				/>
			</section>
		</section>
	);
}

export default NewAssignedLearning;
