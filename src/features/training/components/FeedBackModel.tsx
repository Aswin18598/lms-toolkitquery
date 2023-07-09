import { Icon } from "@iconify/react";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "~/components";
import { useAppSelector } from "~/config/store";
import {
	setShowFeedbackModel,
	useFeedbackForASessionQuery,
	usePendingFeedBackSessionsListQuery,
	useSaveTrainingFeedbackMutation
} from "../store";
import TrainingRating from "./TrainingRating";
import { toast } from "react-hot-toast";
import { getLoggedUser } from "~/helpers/auth";
import { useDispatch } from "react-redux";
import { Spinner } from "~/components/spinner";

const FeedBackModel = ({ refetch, isFetching }: any) => {
	const { FeedBackQuestion, FeedBackSessionsList, FeedbackForASession } = useAppSelector(
		(state: any) => state.instructor
	);
	const { UserId, FirstName, LastName } = getLoggedUser();
	const [selectedStar, setSelectedStar] = useState<any>({});
	const [currentIndex, setCurrentIndex] = useState<any>();
	const sessionDetail = usePendingFeedBackSessionsListQuery(UserId);
	const [Discription, setDiscription] = useState<string>("");
	const [requiredRate, setRequiredRate] = useState<string>("");
	const [selectedListID, setSelectedListID] = useState<any>(FeedBackSessionsList[0].SessionID);
	const [isrequiredRate, setIsRequiredRate] = useState<boolean>(false);
	const [SubmitFeedBackQuery] = useSaveTrainingFeedbackMutation();
	const dispatch = useDispatch();

	useFeedbackForASessionQuery({ UserID: UserId, Sessionid: selectedListID }, { skip: selectedListID === -1 });

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const curIndex = FeedBackSessionsList.findIndex((value: any) => value.SessionID === selectedListID);
		setCurrentIndex(curIndex + 1);
		setSelectedListID(e.target.value);
	};

	const handleClear = () => {
		dispatch(setShowFeedbackModel(false));
		setDiscription("");
	};

	const SubmitFeedback = async () => {
		const payload = {
			SessionID: selectedListID,
			UserID: UserId,
			RatingForQuestionNo1: selectedStar[1],
			RatingForQuestionNo2: selectedStar[2],
			RatingForQuestionNo3: selectedStar[3],
			RatingForQuestionNo4: selectedStar[4],
			RatingForQuestionNo5: selectedStar[5],
			Comments: Discription ? Discription : ""
		};
		if (
			(selectedStar[1] && selectedStar[2] && selectedStar[3] && selectedStar[4] && selectedStar[5]) === undefined
		) {
			setRequiredRate("Please select a rating.*");
			setIsRequiredRate(true);
		} else {
			const res: any = await SubmitFeedBackQuery(payload);
			if (res?.data?.Message) toast.success(res?.data?.Message);
			refetch();
			dispatch(setShowFeedbackModel(false));
		}
	};

	const nextRecord = () => {
		if (
			(selectedStar[1] && selectedStar[2] && selectedStar[3] && selectedStar[4] && selectedStar[5]) === undefined
		) {
			setRequiredRate("Please select a rating.*");
			setIsRequiredRate(true);
		} else {
			const curIndex = FeedBackSessionsList.findIndex((value: any) => value.SessionID === selectedListID);
			setSelectedListID(FeedBackSessionsList[curIndex + 1].SessionID);
			setCurrentIndex(curIndex + 1);
			SubmitFeedback();
			sessionDetail.refetch();
			refetch();
		}
	};

	useEffect(() => {
		sessionDetail.refetch();
	}, [selectedListID]);

	useEffect(() => {
		if (FeedBackSessionsList.length == 0) {
			dispatch(setShowFeedbackModel(false));
		} else {
			// setSelectedListID(FeedBackSessionsList[0]?.SessionID);
			setCurrentIndex(0);
		}
	}, [FeedBackSessionsList]);

	return (
		<>
			<Modal>
				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={handleClear}></div>
					<div className="flex items-center min-h-screen px-4 w-full py-8">
						<div className="bg-white border p-5 rounded-lg w-5/12 m-auto gap-4 z-10">
							<div className="flex flex-nowrap w-full h-12 justify-between items-center">
								<h1 className="text-[#020A12] font-bold text-sm+">Training Session List</h1>
								<button onClick={handleClear}>
									<Icon icon="ic:round-close" className="w-6 h-6" />
								</button>
							</div>

							<select
								value={selectedListID}
								placeholder="Training List"
								className="form-select text-sm w-[50%] rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
								onChange={handleChange}
							>
								{FeedBackSessionsList.length > 0 &&
									FeedBackSessionsList.map((item: any, index: number) => {
										return (
											<option key={item?.SessionID} value={item?.SessionID}>
												{item?.Name}
											</option>
										);
									})}
							</select>

							<h1 className="text-[#020A12] mt-2 text-sm+">
								Thank You{" "}
								<span className="font-bold">
									{FirstName} {LastName}
								</span>{" "}
								for your participation in the Training session on {FeedbackForASession[0]?.StartDate}
							</h1>
							<img
								className="flex justify-start h-40"
								src="/assets/images/Tiger_images/tiger-super.png"
								alt={"empty"}
							/>
							<div>
								<h1 className="text-[#020A12] font-bold text-sm+">
									Please take a moment to complete the below feedback,
								</h1>

								<div className="flex flex-wrap w-[95%] px-4 rounded-xl gap-2 mt-2">
									{isFetching && <Spinner />}
									{!isFetching &&
										FeedBackQuestion?.map((QuesItem: any, index: string) => {
											return (
												<div className="flex flex-wrap w-full gap-2 items-center justify-between">
													<span className="w-full text-left text-sm" key={index}>
														{QuesItem.ID}. {QuesItem.Question}
													</span>
													<TrainingRating
														id={QuesItem.ID}
														setSelectedStar={setSelectedStar}
														selectedStar={selectedStar}
														setIsRequiredRate={setIsRequiredRate}
													/>
												</div>
											);
										})}
									{isrequiredRate && <span className="text-sm text-danger">{requiredRate}</span>}
									<div className="flex flex-wrap gap-6 w-full border border-slate-300 text-sm border-1 rounded-lg p-2">
										<input
											className="form-input w-full text-[#020A12] py-2 bg-transparent"
											type="text"
											placeholder="Suggesstions or Comments..."
											onChange={e => setDiscription(e.target.value)}
											value={Discription}
										/>
										<div className="flex w-full flex-nowrap justify-end items-center">
											<span>{Discription.trim().length}/120</span>
										</div>
									</div>

									<div className="flex flex-nowrap justify-end w-full gap-4 mt-2">
										<button className="text-primary text-sm" onClick={handleClear}>
											Skip
										</button>
										{FeedBackSessionsList.length - 1 === currentIndex && (
											<button
												className="px-4 py-1 border rounded-xl text-sm bg-[#1268B3] text-[#ffffff]"
												onClick={SubmitFeedback}
											>
												Submit Feedback
											</button>
										)}
										{FeedBackSessionsList.length > 1 &&
											FeedBackSessionsList.length - 1 !== currentIndex && (
												<button
													className="px-4 py-1 border rounded-xl text-sm bg-[#1268B3] text-[#ffffff]"
													onClick={nextRecord}
												>
													Next
												</button>
											)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default FeedBackModel;
