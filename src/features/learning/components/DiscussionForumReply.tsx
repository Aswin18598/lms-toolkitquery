import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ElementPopper from "react-element-popper";
import { toast } from "react-hot-toast";
import { dispatch } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import FileDownloadByFileName from "../../../helpers/FileDownloadByFileName";
import {
	setRenderedAPIData,
	useGetCreateReplyMutation,
	useGetDeleteReplyMutation,
	useGetDownloadMutation,
	useGetHideReplyMutation,
	useGetUpdateReplyMutation,
	useRemoveDiscussionFilesMutation
} from "../store";
import DiscussionForumCommentPopper from "./DiscussionForumCommentPopper";
import { Spinner } from "~/components/spinner";

interface IProps {
	ReplayData: any;
	TotalReply: number;
	PostID: number;
	setShowReplyPopperIndex: any;
	setShowReplyPopper: any;
}

const DiscussionForumReply = ({
	ReplayData,
	TotalReply,
	PostID,
	setShowReplyPopperIndex,
	setShowReplyPopper
}: IProps) => {
	const [Loader, setLoader] = useState<boolean>(false);
	const { LastName, FirstName, UserName } = getLoggedUser();
	const [getCreateReplyQuery, CreateReplyOption] = useGetCreateReplyMutation();
	const [getUpdateReplyQuery, UpdateReplyOption] = useGetUpdateReplyMutation();
	const [getDeleteReplyQuery, DeleteReplyOption] = useGetDeleteReplyMutation();
	const [getHideReplyQuery, HideReplyOption] = useGetHideReplyMutation();
	const [GetDownloadQuery] = useGetDownloadMutation();
	const [triggerRemoveFiles] = useRemoveDiscussionFilesMutation();
	const [GetDownloadData, setGetDownloadData] = useState<any>({});
	const ref: any = useRef();
	const [ShowPopper, setShowPopper] = useState<boolean>(false);
	const [EditReply, setEditReply] = useState<boolean>(false);
	const [ShowPopperIndex, setShowPopperIndex] = useState<number>(-1);
	const [ReplyText, setReplyText] = useState<string>("");
	const [ReplyAttachment, setReplyAttachment] = useState<any>(undefined);
	const [ReplyData, setReplyData] = useState<any>({});
	const [ReplyAttachmentPath, setReplyAttachmentPath] = useState<string>("");
	const [APIrenderd, setAPIrenderd] = useState<any>({});
	const [isFileDragging, setIsFileDragging] = useState<boolean>(false);
	useEffect(() => {
		function handleClickOutside(e: any) {
			if (!e.target.classList.contains("handleShowMenu")) {
				setShowPopper(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleCreateReply = async () => {
		let CreatedFormData: any = new FormData();
		ReplyData?.ReplyID && CreatedFormData.set("ReplyID", ReplyData?.ReplyID);
		CreatedFormData.set("PostID", PostID);
		CreatedFormData.set("ReplyText", ReplyText);
		CreatedFormData.set("File", (ReplyAttachment && ReplyAttachment[0]) || undefined);
		CreatedFormData.set("FilePath", ReplyAttachmentPath);
		CreatedFormData.set("AppURL", window.location.href);
		setLoader(true);
		if (ReplyData?.ReplyID) {
			await getUpdateReplyQuery(CreatedFormData)
				.then(() => {})
				.catch(() => {})
				.finally(() => setLoader(false));
			setAPIrenderd(UpdateReplyOption);
		} else {
			await getCreateReplyQuery(CreatedFormData)
				.then(() => {})
				.catch(() => {})
				.finally(() => setLoader(false));
			setAPIrenderd(CreateReplyOption);
		}
		handleClear();
	};

	const handleClear = () => {
		setReplyData({});
		setReplyText("");
		setReplyAttachment(undefined);
		setReplyAttachmentPath("");
	};

	const handleCancel = () => {
		handleClear();
		setShowReplyPopper(false);
		setShowReplyPopperIndex(-1);
	};

	const handleHideReply = async (ReplyID: number) => {
		await getHideReplyQuery({ ReplyID: ReplyID, Status: 2 });
		setAPIrenderd(HideReplyOption);
	};

	useEffect(() => {
		if (EditReply && ReplyData?.ReplyID) {
			setShowPopper(false);
			setShowPopperIndex(-1);
			setReplyText(ReplyData.ReplyText);
			setReplyAttachmentPath(ReplyData.ReplyFilePath);
			document.getElementById("Comment-content")?.scrollIntoView();
		}
	}, [EditReply]);

	const handleDeleteReply = async (ReplyID: number) => {
		await getDeleteReplyQuery(ReplyID);
		setAPIrenderd(DeleteReplyOption);
	};

	useEffect(() => {
		if ((!!APIrenderd?.data || APIrenderd?.isUninitialized) && !APIrenderd?.isLoading) {
			dispatch(setRenderedAPIData(APIrenderd));
			setShowReplyPopper(false);
			setShowReplyPopperIndex(-1);
		}
	}, [APIrenderd]);

	const DownloadFileData = async (FileName: string) => {
		const getDownloadData: any = await GetDownloadQuery(FileName);
		setGetDownloadData(getDownloadData);
	};

	useEffect(() => {
		if (GetDownloadData.data?.Data.FileName.length > 0) {
			FileDownloadByFileName(GetDownloadData.data?.Data);
		}
	}, [GetDownloadData]);

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
	const handleRemoveFile = (replyData: { ReplyFilePath: string; ReplyID: number }) => {
		triggerRemoveFiles({ Type: "Reply", FileName: replyData?.ReplyFilePath, ID: replyData?.ReplyID })
			.then((res: any) => {
				toast.success(res?.data?.Message || "File Deleted Successfully", { id: "reply_file_deleted" });
			})
			.catch(err => {
				console.error("replyFileDeleteError", err);
			});
	};
	const handleDrag = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.type === "dragenter" || event.type === "dragover") {
			setIsFileDragging(true);
		} else if (event.type === "dragleave") {
			setIsFileDragging(false);
		}
	};
	const handleDrop = function (e: any) {
		e?.preventDefault();
		if (e?.dataTransfer?.files?.length) {
			setReplyAttachment((e.dataTransfer.files?.length && e.dataTransfer.files) || undefined);
			setReplyAttachmentPath("");
		}
	};

	const handleRemoveAttachment = (event: any) => {
		setReplyAttachmentPath("");
		setReplyAttachment(undefined);
	};

	return (
		<>
			{Loader && (
				<div className="fixed inset-0 flex items-center w-full h-full z-20 bg-black opacity-40">
					<Spinner />
				</div>
			)}
			<div className="flex flex-between border p-5 py-6 gap-2 rounded-lg w-full" id="Comment-content">
				<div className="px-2 py-2 bg-primary/40 rounded-full h-12 w-12 flex">
					<span className="font-bold m-auto">
						{FirstName.charAt(0) + LastName.charAt(0) || UserName.charAt(0)}
					</span>
				</div>
				<div className="flex flex-wrap w-[95%] gap-12 p-5 bg-primary/10 rounded-xl">
					<input
						className="form-input w-full border-transparent bg-transparent focus-visible:border-transparent border-1"
						type="text"
						placeholder="Your reply here...."
						onChange={e => setReplyText(e.target.value)}
						value={ReplyText}
					/>
					<div className="flex flex-nowrap w-full items-center justify-between">
						<div className="flex flex-nowrap w-3/6 gap-4">
							<div className="flex flex-wrap w-full gap-4">
								<label
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
									className={`border-2 border-dashed ${
										isFileDragging ? "border-gray-600" : "border-gray-400"
									} duration-300 rounded-md p-4 relative`}
								>
									<input
										name="file"
										type="file"
										className="hidden"
										accept="image/*, .zip, .pdf"
										onChange={e => {
											setReplyAttachment((e.target.files?.length && e.target.files) || undefined);
											setReplyAttachmentPath("");
										}}
									/>
									<span className="flex gap-2 items-center">
										<Icon icon="mi:attachment" hFlip={true} className="w-6 h-6" />
										<span>
											{ReplyAttachment
												? ReplyAttachment[0]?.name
												: "Upload or Drag and Drop your file here"}
										</span>
									</span>
								</label>
								{ReplyAttachment ? (
									<button
										onClick={handleRemoveAttachment}
										title={"Remove Attachment"}
										className="ml-1 bg-primary/10  rounded-full w-4 h-4 text-xs flex justify-center items-center font-bold"
									>
										x
									</button>
								) : (
									<div className="flex w-full">
										<span className="w-3/6 text-left text-sm">
											* Accepts only Image, Zipped & PDF files
										</span>
										<span className="w-3/6 text-right text-sm">* Accepts below 5MB files</span>
									</div>
								)}
							</div>
							{/* <span className="w-6 h-6">
								<Icon icon="ph:at-bold" className="w-6 h-6" />
							</span> */}
						</div>
						<div className="flex flex-nowrap gap-6">
							<button
								className="px-4 py-2 rounded-xl text-sm text-white bg-slate-400"
								onClick={handleCancel}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded-xl text-sm text-white bg-primary disabled:cursor-not-allowed"
								onClick={handleCreateReply}
								disabled={ReplyText === ""}
							>
								Comment
							</button>
						</div>
					</div>
				</div>
			</div>
			{TotalReply > 0 &&
				ReplayData.map((reply: any, index: number) => (
					<div className="flex flex-between border px-5 py-6 rounded-lg w-full" key={reply.ReplyID}>
						<div className="flex flex-wrap justify-end w-full gap-6">
							<div className="flex w-full justify-between items-start">
								<div className="flex flex-nowrap justify-center gap-2">
									<div className="px-2 py-2 bg-primary/40 rounded-full h-12 w-12 flex">
										<span className="font-bold m-auto">{reply.RepliedByInitial}</span>
									</div>
									<div className="flex flex-col">
										<div className="flex flex-wrap gap-2 items-center">
											<h1 className="text-[#020A12] font-bold text-xl">{reply.ReplyBy}</h1>
											{reply.IsAuthor === "Yes" && (
												<span
													className={classNames(
														"py-1 px-2 bg-gradient-to-l from-[#3B82F6] to-[#4F46E5] text-white rounded-full"
													)}
												>
													{"Author"}
												</span>
											)}
										</div>
										<span>{postTimingDetails(reply.ReplyTime)}</span>
									</div>
								</div>
								<ElementPopper
									ref={ref}
									active={ShowPopper && ShowPopperIndex === index}
									offsetY={0}
									offsetX={0}
									popper={
										<DiscussionForumCommentPopper
											setShowModal={setEditReply}
											formData={reply}
											setReplyData={setReplyData}
											handleDelete={handleDeleteReply}
											handleHide={handleHideReply}
											Priviledge={reply.ReplyPriviledge}
											Type={"Reply"}
										/>
									}
									position={"bottom-end"}
									containerClassName="Header-search rounded-lg handleShowMenu"
									element={
										<>
											{reply.ReplyPriviledge !== "" && (
												<button
													onClick={() => {
														setShowPopper(true);
														setShowPopperIndex(ShowPopperIndex === index ? -1 : index);
													}}
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
								<div className="px-2 py-3 bg-transparent h-12 w-12"></div>
								<div className="flex flex-wrap gap-4">
									<span className="w-full">{reply.ReplyText}</span>
									{reply?.ReplyFilePath && reply.ReplyFilePath !== "" && (
										<h1 className={"flex gap-2 items-center"}>
											File attachment:{" "}
											<button
												className="underline text-primary"
												onClick={() => DownloadFileData(reply.ReplyFilePath)}
											>
												Download attachment
											</button>{" "}
											<button
												onClick={() => handleRemoveFile(reply)}
												title={"Remove Attachment"}
												className="bg-primary/10  rounded-full w-4 h-4 text-xs flex justify-center items-center font-bold"
											>
												x
											</button>
										</h1>
									)}
								</div>
							</div>
							{/* <div className="flex justify-end items-center w-full">
								<button className="flex flex-nowrap gap-2 p-2 rounded-lg font-bold text-[#020A12] bg-slate-200">
									<Icon icon="mingcute:message-2-line" className="w-5 h-5" />
									<span>Reply</span>
								</button>
							</div> */}
						</div>
					</div>
				))}
		</>
	);
};

export default DiscussionForumReply;
