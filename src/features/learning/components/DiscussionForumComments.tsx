import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ElementPopper from "react-element-popper";
import { toast } from "react-hot-toast";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import FileDownloadByFileName from "../../../helpers/FileDownloadByFileName";
import {
	setPostSize,
	setRenderedAPIData,
	setSelectedPageSize,
	useGetDeletePostingMutation,
	useGetDownloadMutation,
	useRemoveDiscussionFilesMutation
} from "../store";
import DiscussionForumCommentPopper from "./DiscussionForumCommentPopper";
import DiscussionForumModel from "./DiscussionForumModel";
import DiscussionForumReply from "./DiscussionForumReply";

interface IProps {
	Comments: any;
	isLoading: boolean;
	TotalCount: number;
}

const DiscussionForumComments = ({ Comments, isLoading, TotalCount }: IProps) => {
	const { PostSize } = useAppSelector((state: any) => state.learningReducer);
	const [getDeletePostingQuery, DeletePostingOption] = useGetDeletePostingMutation();
	const [GetDownloadQuery] = useGetDownloadMutation();
	const [triggerRemoveFiles] = useRemoveDiscussionFilesMutation();
	const [GetDownloadData, setGetDownloadData] = useState<any>({});
	const [commentData, setcommentData] = useState<any>({});
	const ref: any = useRef();
	const [ShowModal, setShowModal] = useState<boolean>(false);
	const [ShowPopper, setShowPopper] = useState<boolean>(false);
	const [ShowPopperIndex, setShowPopperIndex] = useState<number>(-1);
	const [ShowReply, setShowReply] = useState<boolean>(false);
	const [ShowReplyIndex, setShowReplyIndex] = useState<number>(-1);

	useEffect(() => {
		function handleClickOutside(e: any) {
			if (!e.target.classList.contains("handleShowMenu")) {
				setShowPopper(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const DownloadFileData = async (FileName: string) => {
		const getDownloadData: any = await GetDownloadQuery(FileName);
		setGetDownloadData(getDownloadData);
	};

	useEffect(() => {
		if (GetDownloadData.data?.Data.FileName.length > 0) {
			FileDownloadByFileName(GetDownloadData.data?.Data);
		}
	}, [GetDownloadData]);

	const handleShowMenu = (index: number, comment: any) => {
		setShowPopper(true);
		setShowPopperIndex(ShowPopperIndex === index ? -1 : index);
		setcommentData(comment);
	};

	const handleShowReply = (index: number) => {
		setShowReply(true);
		setShowReplyIndex(ShowReplyIndex === index ? -1 : index);
	};

	const handleDeletePosting = async (PostID: number) => {
		await getDeletePostingQuery(PostID);
		if (!DeletePostingOption?.isLoading) dispatch(setRenderedAPIData(DeletePostingOption));
	};

	const postTimingDetails = (postTiming: string) => {
		const CurrentDate = new Date().getDate();
		const CurrentMonth = new Date().getMonth();
		const CurrentYear = new Date().getFullYear();
		const PostingDate = new Date(postTiming).getDate();
		const PostingMonth = new Date(postTiming).getMonth();
		const PostingYear = new Date(postTiming).getFullYear();
		if (PostingYear < CurrentYear) {
			return `${CurrentYear - PostingYear} Year ago`;
		} else if (PostingMonth < CurrentMonth) {
			return CurrentMonth - PostingMonth + " Month ago";
		} else if (PostingMonth <= CurrentMonth) {
			return CurrentDate - PostingDate > 0
				? CurrentDate - PostingDate === 1
					? "Yesterday"
					: CurrentDate - PostingDate + " Days ago"
				: "Today";
		}
	};
	const handleRemoveFile = (commentData: { PostID: number; PostFilePath: string }) => {
		if (commentData?.PostID) {
			//do Api call for delete file
			triggerRemoveFiles({ Type: "Posting", FileName: commentData?.PostFilePath, ID: commentData?.PostID })
				.then((res: any) => {
					toast.success(res?.data?.Message || "File Deleted Successfully", { id: "post_file_deleted" });
				})
				.catch(err => {
					console.error("postFileDeleteError", err);
				});
		}
	};

	return (
		<>
			{isLoading && (
				<div className="mx-auto my-12">
					<Spinner />
				</div>
			)}
			{!isLoading &&
				(Comments?.length > 0 ? (
					<div className="flex flex-between flex-wrap gap-8 mt-8 w-full">
						{ShowModal && <DiscussionForumModel setShowModal={setShowModal} formData={commentData} />}
						{Comments?.map((comment: any, index: number) => (
							<div
								className="flex flex-between flex-wrap bg-white rounded-lg w-full gap-2 p-4"
								key={comment.PostID}
							>
								<div className="flex flex-wrap justify-end w-full gap-6">
									<div className="flex w-full justify-between items-start">
										<div className="flex flex-row justify-center gap-2">
											<div className="flex px-2 py-2 bg-primary/40 rounded-full h-12 w-12">
												<span className="font-bold  m-auto">{comment.PostedByInitial}</span>
											</div>
											<div className="flex flex-col">
												<h1 className="text-[#020A12] font-bold text-xl">{comment.Title}</h1>
												<div className="flex items-center">
													<span className="font-bold mr-1">{comment.PostedBy}</span>
													{comment.IsAuthor === "Yes" && (
														<span
															className={
																"py-1 px-2 bg-gradient-to-l from-[#3B82F6] to-[#4F46E5] text-white rounded-full"
															}
														>
															{"Author"}
														</span>
													)}
													<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
													<span>{postTimingDetails(comment.PostedTime)}</span>
												</div>
											</div>
										</div>
										<ElementPopper
											ref={ref}
											active={ShowPopper && ShowPopperIndex === index}
											offsetY={0}
											offsetX={0}
											popper={
												<DiscussionForumCommentPopper
													setShowModal={setShowModal}
													formData={comment}
													handleDelete={handleDeletePosting}
													Priviledge={comment.PostPriviledge}
													Type={"Post"}
												/>
											}
											position={"bottom-end"}
											containerClassName="Header-search rounded-lg handleShowMenu"
											element={
												<>
													{comment.PostPriviledge !== "" && (
														<button
															onClick={() => handleShowMenu(index, comment)}
															className="handleShowMenu"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																aria-hidden="true"
																role="img"
																className="h-8 w-8 iconify iconify--majesticons handleShowMenu"
																width="1em"
																height="1em"
																preserveAspectRatio="xMidYMid meet"
																viewBox="0 0 24 24"
															>
																<path
																	className="handleShowMenu"
																	fill="none"
																	stroke="currentColor"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M12 12h.01M8 12h.01M16 12h.01"
																></path>
															</svg>
														</button>
													)}
												</>
											}
										/>
									</div>
									<div className="flex flex-nowrap gap-2 w-full">
										<div className="px-2 py-3 bg-transparent rounded-full h-full">
											<span className="font-bold text-white">MM</span>
										</div>
										<div className="flex flex-wrap gap-6 w-full">
											<span className="w-full">{comment.Description}</span>
											<div
												className={
													"flex items-center w-full " +
													(comment?.PostFilePath && comment.PostFilePath !== ""
														? "justify-between"
														: "justify-end")
												}
											>
												{comment?.PostFilePath && comment.PostFilePath !== "" && (
													<h1 className={"flex gap-2 items-center"}>
														File attachment:{" "}
														<button
															className="underline text-primary"
															onClick={() => DownloadFileData(comment.PostFilePath)}
														>
															Download attachment
														</button>
														<button
															onClick={() => handleRemoveFile(comment)}
															title={"Remove Attachment"}
															className="bg-primary/10  rounded-full w-4 h-4 text-xs flex justify-center items-center font-bold"
														>
															x
														</button>
													</h1>
												)}

												<button
													className={classNames(
														"flex flex-nowrap gap-2 p-2 rounded-lg font-bold",
														{
															" bg-slate-200 text-[#020A12]": ShowReplyIndex !== index,
															"bg-primary/10 shadow text-primary":
																ShowReplyIndex === index
														}
													)}
													onClick={() => handleShowReply(index)}
												>
													<Icon icon="mingcute:message-2-line" className="w-5 h-5" />
													<span>{comment.TotalReply !== 0 && comment.TotalReply} Reply</span>
												</button>
											</div>
											{ShowReply && ShowReplyIndex === index && (
												<DiscussionForumReply
													ReplayData={comment.Reply}
													TotalReply={comment.TotalReply}
													PostID={comment.PostID}
													setShowReplyPopper={setShowReply}
													setShowReplyPopperIndex={setShowReplyIndex}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
						{TotalCount > PostSize && (
							<div className="flex justify-center w-full">
								<button
									className="text-primary hover:bg-primary px-3 py-2 rounded-lg bg-slate-200 hover:text-white"
									onClick={() => dispatch(setPostSize(PostSize + 10))}
								>
									View more ...
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-wrap gap-4 text-center items-center mx-auto py-20">
						<img
							className="h-40 m-auto"
							src="assets/images/Tiger_images/tiger-logoutX400.png"
							alt={"No comments found"}
						/>
						<p className="text-xs+ text-[#020A12]/60 w-full">
							{"No comments available for the selected course"}
						</p>
					</div>
				))}
		</>
	);
};

export default DiscussionForumComments;
