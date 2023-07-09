import React from "react";
import { IDynamicFiedOptionsResponse } from "../@types";
import { useForm } from "react-hook-form";
import { useLearningPathIntegrationActionMutation } from "../store";

interface INewIntegrationDetails {
	SourceID: number;
	Title: string;
	Description: string;
	AuthorName: string;
	Link: string;
}
interface IAddNewIntegrationProps {
	isAddNewIntegrationClicked: boolean;
	setIsAddNewIntegrationClicked: React.Dispatch<React.SetStateAction<boolean>>;
	refetchIntegrations: () => void;
	dynamicFieldOptions: IDynamicFiedOptionsResponse[];
}

function AddNewIntegration(props: IAddNewIntegrationProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm({});
	const [addLearningPathIntegration] = useLearningPathIntegrationActionMutation();
	const { isAddNewIntegrationClicked, setIsAddNewIntegrationClicked, refetchIntegrations, dynamicFieldOptions } =
		props;
	const handleAddNewIntegrations = async (data: any) => {
		try {
			const response: any = await addLearningPathIntegration({ ...data, Action: "A", ID: 0 });
			console.log("response", response);
			setIsAddNewIntegrationClicked(false);
			reset();
			refetchIntegrations();
		} catch (error) {
			console.error("error", error);
		}
	};

	return isAddNewIntegrationClicked ? (
		<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
			<form
				onSubmit={handleSubmit(handleAddNewIntegrations)}
				className="h-[90vh] bg-white w-[80vw] sm:w-[60vw] md:w-[40vw] xl:w-[35vw] 2xl:w-[30vw] rounded-md animate-[scale-up_0.3s_ease-in-out_alternate]"
			>
				<header className="w-full h-[60px] p-6 flex items-center bg-[#F1F5F9] rounded-tl-md rounded-tr-md">
					<p className="text-md font-medium text-slate-800 dark:text-navy-50 lg:text-md+">Add Course</p>
				</header>
				<div className="p-6 h-[calc(100%-120px)] overflow-auto space-y-3">
					<div className="w-full">
						<p className="text-sm font-medium">Source</p>
						<select
							{...register("SourceID", { required: true })}
							className="form-select text-sm w-full truncate rounded-lg border border-slate-300 bg-white px-3.5 pr-20 py-2.5 my-1.5 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
						>
							<option value={0} disabled>
								select Source
							</option>
							{dynamicFieldOptions.map((opt, i) => (
								<option value={opt.Txt} key={i}>
									{opt.Val}
								</option>
							))}
						</select>
						{errors.SourceID && <p className="text-red-500 text-xs">This field is Required</p>}
					</div>
					<div className="w-full">
						<p className="text-sm font-medium">Title</p>
						<input
							type="text"
							className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-2.5
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
							{...register("Title", { required: true })}
							placeholder="Title"
						/>
						{errors.Title && <p className="text-red-500 text-xs">This field is Required</p>}
					</div>
					<div className="w-full">
						<p className="text-sm font-medium">Description</p>
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
							{...register("Description", { required: true })}
							placeholder="Description"
						></textarea>
						{errors.Description && <p className="text-red-500 text-xs">This field is Required</p>}
					</div>
					<div className="w-full">
						<p className="text-sm font-medium">Author name</p>
						<input
							type="text"
							className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-2.5
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
							{...register("AuthorName", { required: true })}
							placeholder="Author"
						/>
						{errors.AuthorName && <p className="text-red-500 text-xs">This field is Required</p>}
					</div>
					<div className="w-full">
						<p className="text-sm font-medium">Link</p>
						<input
							type="text"
							className="
                            form-control
                            block
                            w-full
                            px-3.5
                            py-2.5
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
							placeholder="Paste Udemy or Linkedin Learning course link"
							{...register("Link", { required: true })}
						/>
						{errors.Link && <p className="text-red-500 text-xs">This field is Required</p>}
					</div>
				</div>
				<footer className="flex h-[60px] p-6 items-center justify-end gap-4">
					<button
						onClick={() => setIsAddNewIntegrationClicked(false)}
						className="bg-white text-xs rounded-[30px] border border-gray-200 py-2 px-3"
					>
						Cancel
					</button>
					<button className="px-3 py-2 bg-primary text-white text-xs rounded-[30px]" type="submit">
						Add
					</button>
				</footer>
			</form>
		</section>
	) : null;
}

export default AddNewIntegration;
