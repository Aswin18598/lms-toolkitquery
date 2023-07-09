import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import CreateTrainingSession from "../../components/CreateTrainingSession";
import FeedBackModel from "../../components/FeedBackModel";
import Scheduler from "../../components/Scheduler";
import SearchBar from "../../components/SearchBar";
import TrainingHistory from "../../components/TrainingHistory";
import { usePendingFeedBackSessionsListQuery, useTrainingFeedbackQuestionsQuery } from "../../store";

function InstructionTraining() {
	const user = getLoggedUser();
	usePendingFeedBackSessionsListQuery(user.UserId);
	const [isCreateSessionScreen, showCreateSessionScreen] = useState(false);
	const trainingHistoryRef = useRef<any>();
	const [calendarView, setCalendarView] = useState(user.UserTypeID === "2" || user.UserTypeID === "4" ? false : true);
	const { refetch, isFetching } = useTrainingFeedbackQuestionsQuery("");
	const { showFeedbackModel, FeedBackSessionsList } = useAppSelector((state: any) => state.instructor);

	useEffect(() => {
		trainingHistoryRef.current?.refetch();
	}, [isCreateSessionScreen]);

	return (
		<div>
			{showFeedbackModel && FeedBackSessionsList.length > 0 && (
				<FeedBackModel refetch={refetch} isFetching={isFetching} />
			)}
			<div className="flex items-center flex-col sm:flex-row gap-4 justify-between mb-5 mt-5">
				<div className="flex items-center self-start">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl mr-2">
						Instructor Led Trainings
					</h2>
					<span title={`${calendarView ? "List" : "Calendar"}`}>
						<Icon
							className="cursor-pointer w-6 h-6 min-w-[24px]"
							icon={`${calendarView ? "mingcute:list-check-line" : "ic:outline-date-range"}`}
							onClick={() => setCalendarView(!calendarView)}
						/>
					</span>
				</div>
				{!calendarView && (
					<div className="flex items-center self-start">
						<div className="w-30 mr-8">
							<SearchBar />
						</div>
						{(user.UserTypeID === "2" || user.UserTypeID === "4") && (
							<div className="w-30">
								<button
									onClick={() => showCreateSessionScreen(true)}
									className="px-[10px] py-[7px] rounded-2xl text-[14px] font-mediun bg-[#1268B3] text-[#ffffff]"
								>
									+ Create
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			{isCreateSessionScreen && <CreateTrainingSession showCreateSessionScreen={showCreateSessionScreen} />}
			{calendarView ? <Scheduler /> : <TrainingHistory ref={trainingHistoryRef} />}
		</div>
	);
}

export default InstructionTraining;
