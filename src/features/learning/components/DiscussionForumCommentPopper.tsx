import { Icon } from "@iconify/react";

interface IProps {
	setShowModal?: any;
	formData?: any;
	handleDelete?: any;
	setReplyData?: any;
	handleHide?: any;
	Priviledge: any;
	Type: string;
}

const DiscussionForumCommentPopper = ({
	setShowModal,
	formData,
	handleDelete,
	setReplyData,
	handleHide,
	Priviledge,
	Type
}: IProps) => {
	return (
		<div className="flex flex-col gap-1 border font-bold rounded-lg bg-white">
			{Priviledge?.split(`/`).map((val: any) => {
				return (
					<>
						{val === "E" && (
							<button
								className="flex items-center justify-center p-2 gap-1 w-fit"
								onClick={() => {
									if (formData?.PostID) {
										setShowModal(true);
									} else {
										setShowModal(true);
										setReplyData(formData);
									}
								}}
							>
								<Icon icon="fluent:edit-16-regular" color="#020A12" className="w-5 h-5 mx-2" />
								<span className="text-[#020A12]">Edit</span>
							</button>
						)}
						{val === "D" && (
							<button
								className="flex items-center justify-center p-2 w-fit text-[#d85c57]"
								onClick={() => handleDelete(formData?.PostID ? formData?.PostID : formData?.ReplyID)}
							>
								<Icon icon="mingcute:delete-2-line" color="#d85c57" className="w-5 h-5 mx-2" />
								<span className="text-[#d85c57]">Delete</span>
							</button>
						)}
						{Type === "Reply" && val === "H" && (
							<button
								className="flex items-center justify-center p-2 w-fit text-[#d85c57]"
								onClick={() => handleHide(formData?.ReplyID)}
							>
								<Icon icon="ph:warning-octagon-bold" color="#020A12" className="w-5 h-5 mx-2" />
								<span className="text-[#020A12]">Report</span>
							</button>
						)}
					</>
				);
			})}
		</div>
	);
};

export default DiscussionForumCommentPopper;
