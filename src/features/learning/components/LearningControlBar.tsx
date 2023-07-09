import { Icon } from "@iconify/react";
import SearchBar from "./SearchBar";
import FavCourseToggle from "./FavCourseToggle";
import LearningCatagory from "./LearningCatagory";
import Progress from "./Progress";
import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";
import { setSelectedPageNumber } from "../store";
import { useDispatch } from "react-redux";
import LearningSubCategory from "./LearningSubCategory";

interface IProps {
	setFavToggle: any;
	favToggle: boolean;
	selectedLearningCatogery: number;
	setSelectedLearningCatogery: any;
	setSelectedLearningSubCatogery: any;
	selectedLearningSubCatogery: any;
	gridView: boolean;
	setGridView: any;
	setLoader: any;
	setStatusID: any;
	statusID: number;
	itemType: number;
	setItemType: any;
}

const myLearningCatogeries = ["Courses", "Assessments"];

function LearningControlBar({
	gridView,
	setGridView,
	setFavToggle,
	favToggle,
	selectedLearningCatogery,
	setSelectedLearningCatogery,
	setSelectedLearningSubCatogery,
	selectedLearningSubCatogery,
	setLoader,
	setStatusID,
	statusID,
	setItemType,
	itemType
}: IProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div className="h-fit">
			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex justify-center space-x-4">
					{myLearningCatogeries.map((category: any, index: number) => (
						<button
							key={category}
							onClick={() => {
								setItemType(index + 1);
								navigate(navigateLink.learning + "?MyLearning-" + (index + 1));
								dispatch(setSelectedPageNumber(1));
							}}
							className={`px-3 py-2 rounded-full text-sm font-bold my-1 ${
								itemType === index + 1 ? "bg-[#1268B3] text-[#ffffff]" : "bg-slate-200"
							}`}
						>
							{category}
						</button>
					))}
				</div>
				<div className="my-2 sm:my-0 w-full grid sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
					<SearchBar setLoader={setLoader} />
				</div>
			</div>
			<div className="grid grid-cols-12 gap-6 sm:gap-16 my-4">
				<div className="col-span-6 md:col-span-3 lg:col-span-2 grid grid-cols-12  sm:col-span-2 items-center sm:my-0 sm:gap-4">
					<span title={`${gridView ? "Table View" : "Grid View"}`} className={"col-span-2"}>
						<Icon
							className="cursor-pointer w-6 h-6 min-w-[24px]"
							icon={`${gridView ? "mingcute:list-check-line" : "eva:grid-outline"}`}
							onClick={() => setGridView(!gridView)}
						/>
					</span>
					<div className="col-span-10">
						<FavCourseToggle setLoader={setLoader} favToggle={favToggle} setFavToggle={setFavToggle} />
					</div>
				</div>
				<div className="col-span-12 md:col-span-9 lg:col-span-10  grid gap-4 grid-cols-1 md:grid-cols-3">
					<div className="my-2 sm:my-0 ">
						<LearningCatagory
							setLoader={setLoader}
							setSelectedLearningCatogery={setSelectedLearningCatogery}
							selectedLearningCatogery={selectedLearningCatogery}
						/>
					</div>
					<div className="my-2 sm:my-0 ">
						<LearningSubCategory
							setLoader={setLoader}
							selectedLearningCatogery={selectedLearningCatogery}
							setSelectedLearningSubCatogery={setSelectedLearningSubCatogery}
							selectedLearningSubCatogery={selectedLearningSubCatogery}
						/>
					</div>
					<div className="my-2 sm:my-0">
						<Progress
							setLoader={setLoader}
							statusID={statusID}
							setStatusID={setStatusID}
							optionChoice
							TypeID={itemType}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LearningControlBar;
