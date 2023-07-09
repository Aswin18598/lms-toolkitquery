import { Icon } from "@iconify/react";
import { useState } from "react";
import { dispatch, useAppSelector } from "~/config/store";
import { setDiscussionSearchText } from "../store";
import DiscussionForumModel from "./DiscussionForumModel";

const DiscussionForumHeader = () => {
	const { DiscussionSearchText } = useAppSelector((state: any) => state.learningReducer);
	const [showModel, setShowModel] = useState<boolean>(false);
	const [showWarning, setShowWarning] = useState<boolean>(true);
	return (
		<>
			<div className="flex flex-nowrap w-full gap-2">
				<div className="relative flex w-[70%] lg:w-[80%] 2xl:w-[85%]">
					<input
						value={DiscussionSearchText}
						placeholder="Search"
						className="form-input w-full border rounded-lg px-4 pl-9 text-xs+ text-slate-800 ring-primary/50 hover:bg-slate-200 focus:none dark:bg-navy-900/90 dark:text-navy-100 dark:placeholder-navy-300 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
						type="search"
						onChange={e => dispatch(setDiscussionSearchText(e.target.value))}
						onFocus={() => setShowWarning(false)}
						onBlur={() => setShowWarning(true)}
					/>
					<div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
						<Icon icon="mingcute:search-line" className="h-5 w-5 transition-colors duration-200" />
					</div>
				</div>
				<button
					className="flex items-center justify-center px-3 py-2 text-white bg-primary rounded-lg w-[30%] lg:w-[20%] 2xl:w-[15%]"
					onClick={() => setShowModel(true)}
				>
					<Icon icon="material-symbols:add-rounded" color="white" className="w-5 h-5 mr-2" />
					<span>New Post</span>
				</button>
				{showModel && <DiscussionForumModel setShowModal={setShowModel} />}
			</div>
			{showWarning && !showModel && (
				<div className="flex flex-wrap mt-8 p-4 bg-primary/10 rounded-lg">
					<div className="flex w-full justify-between">
						<h1 className="flex items-center text-[#020A12] font-bold text-xl mb-5 w-full">
							<Icon icon="mingcute:information-line" color="#020A12" className="w-5 h-5 mr-3" />
							Forum rules and posting guidelines
						</h1>
						<button onClick={() => setShowWarning(false)}>
							<Icon icon="ic:round-close" color="#020A12" className="w-5 h-5" />
						</button>
					</div>
					<ul className="mx-12 list-disc">
						<li>Keep it friendly.</li>
						<li>
							Be courteous and respectful. Appreciate that others may have an opinion different from
							yours.
						</li>
						<li>Stay on topic. ...</li>
						<li>Share your knowledge. ...</li>
						<li>Refrain from demeaning, discriminatory, or harassing behaviour and speech.</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default DiscussionForumHeader;
