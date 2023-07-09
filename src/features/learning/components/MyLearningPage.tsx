import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "~/config/store";
import {
	useGetMyLearningGridDataQuery,
	setSelectedPageNumber,
	setSelectedSearchText,
	setSelectedPageSize
} from "~/features/learning/store";
import { getLoggedUser } from "~/helpers/auth";
import LearningAssessmentCard from "./LearningAssessmentCard";
import LearningAssessmentTable from "./LearningAssessmentTable";
import LearningControlBar from "./LearningControlBar";
import LearningCourseCard from "./LearningCourseCard";
import LearningCoursesTable from "./LearningCoursesTable";

var widthRange: { [key: string]: string } = {
	"1-8": "w-1/12",
	"9-16": "w-2/12",
	"17-24": "w-3/12",
	"25-32": "w-4/12",
	"33-40": "w-5/12",
	"41-49": "w-6/12",
	"50-58": "w-7/12",
	"59-67": "w-8/12",
	"68-75": "w-9/12",
	"76-82": "w-10/12",
	"83-91": "w-11/12",
	"92-100": "w-full"
};
function calculateWidth(progress: any): string {
	for (var key in widthRange) {
		const range = key.split("-");
		if (range[0] <= progress && progress <= range[1]) {
			return widthRange[key];
		}
	}
	return "w-0";
}

function MyLearningPage() {
	const dispatch = useDispatch();
	const { UserId } = getLoggedUser();
	const { PageNumber, PageSize, MyLearningCourseGridData, MyLearningAssesmentGridData, SearchText } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const [favToggle, setFavToggle] = useState<boolean>(false);
	const [selectedLearningCatogery, setSelectedLearningCatogery] = useState<number>(0);
	const [selectedLearningSubCatogery, setSelectedLearningSubCatogery] = useState<number>(0);
	const [statusID, setStatusID] = useState<number>(0);
	const [itemType, setItemType] = useState<number>(1);
	const [gridView, setGridView] = useState(true);
	const [loader, setLoader] = useState(false);
	const location = useLocation();
	const TypeIDfromLink = location.search?.split("-")[1];
	const { Favorites } = useAppSelector((state: any) => state.headersandmenuReducer);
	const [skip, setSkip] = useState<boolean>(true);

	useEffect(() => {
		setItemType(+TypeIDfromLink);
	}, [TypeIDfromLink]);

	const { refetch, isLoading } = useGetMyLearningGridDataQuery(
		{
			UserID: UserId,
			PageNumber: PageNumber,
			PageSize: PageSize,
			ItemType: itemType,
			Favorites: favToggle ? 1 : 0,
			CategoryID: selectedLearningCatogery,
			SubCategoryID: selectedLearningSubCatogery,
			Status: statusID,
			SearchText: SearchText
		},
		{
			skip: (skip && location?.state?.statusID && location?.state?.statusID !== statusID) || PageSize === 10
		}
	);

	useEffect(() => {
		setLoader(isLoading);
	}, [isLoading]);
	useEffect(() => {
		setLoader(true);
	}, [SearchText]);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [
		PageNumber,
		PageSize,
		itemType,
		favToggle,
		selectedLearningCatogery,
		selectedLearningSubCatogery,
		statusID,
		SearchText
	]);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [Favorites]);
	useEffect(() => {
		dispatch(setSelectedPageSize(12));
	}, [itemType, favToggle, selectedLearningCatogery, statusID, SearchText]);

	useEffect(() => {
		setGridView(true);
		setFavToggle(false);
		setSelectedLearningCatogery(0);
		setSelectedLearningSubCatogery(0);
		setLoader(true);
		if (location?.state?.statusID) {
			setStatusID(location?.state?.statusID);
			setSkip(!!location?.state?.statusID);
		} else {
			setStatusID(0);
		}
		dispatch(setSelectedPageNumber(1));
		dispatch(setSelectedPageSize(12));
		dispatch(setSelectedSearchText(""));
	}, [itemType, location]);

	useEffect(() => {
		setLoader(false);
	}, [MyLearningCourseGridData, MyLearningAssesmentGridData]);

	useEffect(() => {
		setSelectedLearningSubCatogery(0);
	}, [selectedLearningCatogery]);

	useEffect(() => {
		if (+statusID !== +location?.state?.statusID) {
			setSkip(false);
		}
	}, [statusID]);

	return (
		<>
			<LearningControlBar
				gridView={gridView}
				setGridView={setGridView}
				favToggle={favToggle}
				setFavToggle={setFavToggle}
				selectedLearningCatogery={selectedLearningCatogery}
				setSelectedLearningCatogery={setSelectedLearningCatogery}
				setSelectedLearningSubCatogery={setSelectedLearningSubCatogery}
				selectedLearningSubCatogery={selectedLearningSubCatogery}
				setLoader={setLoader}
				statusID={statusID}
				setStatusID={setStatusID}
				setItemType={setItemType}
				itemType={itemType}
			/>
			{gridView ? (
				<>
					{itemType === 1 && (
						<LearningCourseCard calculateWidth={calculateWidth} loader={loader} refetchData={refetch} />
					)}
					{itemType === 2 && <LearningAssessmentCard loader={loader} refetch={refetch} />}
				</>
			) : (
				<>
					{itemType === 1 && (
						<LearningCoursesTable calculateWidth={calculateWidth} loader={loader} refetch={refetch} />
					)}
					{itemType === 2 && <LearningAssessmentTable loader={loader} refetch={refetch} />}
				</>
			)}
		</>
	);
}

export default MyLearningPage;
