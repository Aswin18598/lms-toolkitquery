import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "~/components";
import { dispatch } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { setRenderedAPIData, useGetCreatePostingMutation, useGetUpdatePostingMutation } from "../store";
import { Spinner } from "~/components/spinner";

interface IProps {
	setShowModal: any;
	formData?: any;
}

const DiscussionForumModel = ({ setShowModal, formData }: IProps) => {
	const [Loader, setLoader] = useState<boolean>(false);
	const { LastName, FirstName, UserName } = getLoggedUser();
	const location = useLocation();
	const [getCreatePostingQuery, getCreatePostingOption] = useGetCreatePostingMutation();
	const [getUpdatePostingQuery, getUpdatePostingOption] = useGetUpdatePostingMutation();
	const CourseID = +location.search?.split("&")[2];
	const [PostID, setPostID] = useState<number>(-1);
	const [Title, setTitle] = useState<string>("");
	const [TitleAlert, setTitleAlert] = useState<boolean>(false);
	const [Discription, setDiscription] = useState<string>("");
	const [DiscriptionAlert, setDiscriptionAlert] = useState<boolean>(false);
	const [File, setFile] = useState<any>(undefined);
	const [FilePath, setFilePath] = useState<string>("");
	const [isFileDragging, setIsFileDragging] = useState<boolean>(false);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const handleClear = () => {
		setShowModal(false);
		setPostID(-1);
		setTitle("");
		setDiscription("");
		setFile(undefined);
		setFilePath("");
	};

	const handlePost = async () => {
		let CreatedFormData: any = new FormData();
		if (formData?.PostID) CreatedFormData.set("PostID", PostID);
		CreatedFormData.set("CourseID", `${CourseID}`);
		CreatedFormData.set("Title", Title);
		CreatedFormData.set("Description", Discription);
		CreatedFormData.set("File", (File && File[0]) || undefined);
		CreatedFormData.set("FilePath", FilePath);
		CreatedFormData.set("AppURL", window.location.href);
		setLoader(true);
		if (formData?.PostID) {
			await getUpdatePostingQuery(CreatedFormData)
				.then(() => {})
				.catch(() => {})
				.finally(() => setLoader(false));
			if (!getUpdatePostingOption?.isLoading) dispatch(setRenderedAPIData(getUpdatePostingOption));
			setLoader(false);
		} else {
			await getCreatePostingQuery(CreatedFormData)
				.then(() => {})
				.catch(() => {})
				.finally(() => setLoader(false));
			if (!getCreatePostingOption?.isLoading) dispatch(setRenderedAPIData(getCreatePostingOption));
			setLoader(false);
		}
		handleClear();
	};

	useEffect(() => {
		if (formData?.PostID) {
			setTitle(formData?.Title);
			setDiscription(formData?.Description);
			setFilePath(formData?.PostFilePath);
			setPostID(formData?.PostID);
		}
	}, [formData]);
	const handleDrop = function (e: any) {
		e?.preventDefault();
		if (e?.dataTransfer?.files?.length) {
			setFile((e.dataTransfer.files?.length && e.dataTransfer.files) || undefined);
			setFilePath("");
		}
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
	const handleRemoveFile = (event: any) => {
		event?.stopPropagation();
		setFilePath("");
		setFile(undefined);
	};
	return (
		<Modal>
			<div className="fixed inset-0 z-10 overflow-y-auto">
				{Loader && (
					<div className="fixed inset-0 flex items-center w-full h-full z-20 bg-black opacity-40">
						<Spinner />
					</div>
				)}
				<div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={handleClear}></div>
				<div className="flex items-center min-h-screen px-4 w-full py-8">
					<div className="flex flex-wrap flex-between bg-white border gap-2 p-5 rounded-lg w-5/12 m-auto z-10">
						<div className="flex flex-nowrap w-full h-12 justify-between items-center pb-4">
							<h1 className="text-[#020A12] font-bold text-xl">Post Your Query</h1>
							<button onClick={handleClear}>
								<Icon icon="ic:round-close" className="w-6 h-6" />
							</button>
						</div>
						<div className="px-2 py-2 bg-primary/40 rounded-full h-12 w-12 flex">
							<span className="font-bold m-auto">
								{FirstName.charAt(0) + LastName.charAt(0) || UserName.charAt(0)}
							</span>
						</div>
						<div className="flex flex-wrap w-[90%] gap-12 rounded-xl">
							<div className="flex flex-wrap w-full gap-6 items-center justify-between">
								<div className="flex flex-wrap w-full gap-0">
									<input
										className="form-input w-full border border-slate-300 text-sm border-1 rounded-lg text-[#020A12] px-3 py-3 bg-primary/10 "
										type="text"
										placeholder="Title"
										onChange={e => setTitle(e.target.value)}
										value={Title}
										autoFocus
										onFocus={() => setTitleAlert(true)}
									/>
									{Title === "" && TitleAlert && (
										<span className="w-full text-left text-sm text-[#d85c57]">
											* Please Add Title
										</span>
									)}
								</div>
								<div className="flex flex-wrap w-full gap-0">
									<div className="flex flex-wrap gap-6 w-full border border-slate-300 text-sm border-1 rounded-lg p-2 bg-primary/10 ">
										<input
											className="form-input w-full text-[#020A12] py-2 bg-transparent"
											type="text"
											placeholder="Try something related to your Question"
											onChange={e => setDiscription(e.target.value)}
											value={Discription}
											onFocus={() => setDiscriptionAlert(true)}
										/>
										<div className="flex w-full flex-nowrap justify-end items-center">
											<span>{Discription.trim().length}/120</span>
										</div>
									</div>
									{Discription === "" && DiscriptionAlert && (
										<span className="w-full text-left text-sm text-[#d85c57]">
											* Please add any description about the query
										</span>
									)}
								</div>
								<div className="flex flex-wrap w-full gap-0">
									<label
										htmlFor="formId"
										className={`flex flex-wrap relative items-center justify-center gap-2 w-full border-2 py-6 border-dashed ${
											File || isFileDragging ? "border-slate-500" : ""
										}`}
										onDragEnter={handleDrag}
										onDragLeave={handleDrag}
										onDragOver={handleDrag}
										onDrop={handleDrop}
										onClick={() => {
											fileRef.current?.click();
										}}
									>
										{File ? (
											<button
												onClick={handleRemoveFile}
												title={"Remove File"}
												className="absolute top-2 right-2 bg-primary/10  rounded-full w-4 h-4 text-xs flex justify-center items-center font-bold"
											>
												x
											</button>
										) : null}
										<input
											name="file"
											type="file"
											ref={fileRef}
											hidden
											accept="image/*, .zip, .pdf"
											onChange={e => {
												setFile((e.target.files?.length && e.target.files) || undefined);
												setFilePath("");
											}}
										/>
										<Icon icon="mi:attachment" hFlip={true} className="w-6 h-6" />
										<span>
											{(File && File[0]?.name) || "Drag and drop your file here or Upload"}
										</span>
									</label>
									{!File && (
										<div className="flex w-full">
											<span className="w-3/6 text-left text-sm">
												* Accepts only Image, Zipped & PDF files
											</span>
											<span className="w-3/6 text-right text-sm">* Accepts below 5MB files</span>
										</div>
									)}
								</div>
								<div className="flex flex-nowrap justify-start w-full gap-4">
									<button
										className="px-4 py-2 rounded-xl text-lg text-white bg-primary disabled:cursor-not-allowed"
										onClick={handlePost}
										disabled={Title === "" || Discription === ""}
									>
										Post
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DiscussionForumModel;
