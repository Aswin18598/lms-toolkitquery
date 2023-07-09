import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import { setSelectedPageNumber, setSelectedPageSize, setShowFeedbackModel, useGetAllTrainingsQuery } from "../store";
import EditTraining from "./EditTraining";
import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";
import TrainingToggle from "./TrainingToggle";
import TrainingGridHistory from "./TrainingGridHistory";

const TrainingHistory = forwardRef(({}, ref) => {
	const navigate = useNavigate();
	const [expanded, setCollapseExpanded] = useState<Map<string, boolean>>(new Map<string, boolean>());
	const [isTrainingEditScreen, showTrainingEditScreen] = useState(false);
	const [trainingData, setTrainingData] = useState(false);
	const [PageNumber, setPageNumber] = useState<number>(1);
	const [PageSize, setPageSize] = useState<number>(10);
	const [status, setStatus] = useState("OnGoing");

	const { TrainingListHistory, SearchTextInTitle, ErrorMsg, FeedBackSessionsList } = useAppSelector((state: any) => {
		return state.instructor;
	});

	const { isLoading, refetch } = useGetAllTrainingsQuery({
		PageNumber: PageNumber,
		PageSize: PageSize,
		SearchTextInTitle: SearchTextInTitle,
		Status: status
	});

	// useEffect(() => {
	// 	if (ErrorMsg?.status === 401) {
	// 		navigate(navigateLink.auth.logout);
	// 		console.log("authFalse");
	// 	} else {
	// 		console.log("authTrue");
	// 	}
	// }, [ErrorMsg]);

	useImperativeHandle(ref, () => ({
		refetch
	}));

	useEffect(() => {
		if (SearchTextInTitle.length) {
			dispatch(setSelectedPageNumber(1));
			dispatch(setSelectedPageSize(10));
		}
	}, [SearchTextInTitle]);

	const toggleCollapse = (index: string) => {
		const localMap = new Map<string, boolean>();
		if (!expanded.has(index)) {
			localMap.set(index, true);
		}
		setCollapseExpanded(localMap);
	};
	const clickHide = () => {
		const localMap = new Map<string, boolean>();
		setCollapseExpanded(localMap);
	};

	function editTraining(training: any): void {
		showTrainingEditScreen(true);
		setTrainingData(training);
	}

	useEffect(() => {
		if (status === "Completed" && FeedBackSessionsList.length > 0) dispatch(setShowFeedbackModel(true));
	}, [TrainingListHistory]);

	return (
		<>
			{isTrainingEditScreen && (
				<EditTraining
					trainingData={trainingData}
					showTrainingEditScreen={showTrainingEditScreen}
					refetch={refetch}
				/>
			)}
			<div className="max-w-[200px] min-w-[150px]">
				<TrainingToggle Status={status} setStatus={setStatus} />
			</div>
			{isLoading && <Spinner />}
			{!isLoading && (
				<>
					<TrainingGridHistory
						expanded={expanded}
						editTraining={editTraining}
						refetch={refetch}
						clickHide={clickHide}
						toggleCollapse={toggleCollapse}
					/>
				</>
			)}
		</>
	);
});

export default TrainingHistory;
