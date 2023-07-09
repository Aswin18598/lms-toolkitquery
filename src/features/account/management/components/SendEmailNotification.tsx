import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { notify } from "~/helpers";
import { useLPEmailNotificationMutation } from "../store";

interface ISendEmailNotificationProps {
	isSendEmailNotificationClicked: boolean;
	setIsSendEmailNotificationClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
function SendEmailNotification(props: ISendEmailNotificationProps) {
	const { isSendEmailNotificationClicked, setIsSendEmailNotificationClicked } = props;
	const location = useLocation();
	const [triggerLPEmailNotification, { isLoading: isEmailSending }] = useLPEmailNotificationMutation();
	const [emailDetails, setEmailDetails] = useState({
		subject: "",
		message: ""
	});
	const [isIncludeAllCourseAndAssessments, setIsIncludeAllCourseAndAssessments] = useState(false);
	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		try {
			const response: any = await triggerLPEmailNotification({
				EmailMessage: emailDetails.message,
				EmailSubject: emailDetails.subject,
				PathID: location.state?.PathID,
				MessageWithItems: isIncludeAllCourseAndAssessments
			});
			if (response?.error?.status === 500) {
				notify("email sent Error", response?.error?.data);
				return undefined;
			}
			toast.success(response?.data?.Message, { id: "email sent success message" });
			setEmailDetails({
				subject: "",
				message: ""
			});
			setIsIncludeAllCourseAndAssessments(false);
			setIsSendEmailNotificationClicked(false);
		} catch (error) {
			console.error("error", error);
		}
	};
	return isSendEmailNotificationClicked ? (
		<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
			{isEmailSending && (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<Spinner />
				</section>
			)}
			<form
				className="h-[80vh] bg-white w-[80vw] sm:w-[60vw] md:w-[50vw] xl:w-[35vw] 2xl:w-[30vw] rounded-md animate-[scale-up_0.3s_ease-in-out_alternate]"
				onSubmit={handleSubmit}
			>
				<header className="w-full h-[60px] p-6 flex items-center bg-[#F1F5F9] rounded-tl-md rounded-tr-md justify-between">
					<p className="text-md font-medium text-slate-800 dark:text-navy-50 lg:text-md+">
						Send Email Notification
					</p>
					<button>
						<Icon
							icon={"material-symbols:close-rounded"}
							onClick={() => setIsSendEmailNotificationClicked(false)}
							width={20}
							height={20}
						/>
					</button>
				</header>
				<section className="flex flex-col justify-between items-center p-6 h-[calc(100%-60px)] w-full overflow-y-auto">
					<div className="space-y-4 w-full">
						<div className="w-full">
							<p className="text-sm font-medium">Email Subject Line</p>
							<input
								type="text"
								className="
						form-control
						block
						w-full
						px-3.5
						py-2.5
						text-sm
						font-normal
						text-gray-700
						bg-white bg-clip-padding
						border border-solid border-gray-300
						rounded-md
						transition
						ease-in-out
						my-1.5
						focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
					"
								placeholder="Subject"
								required
								value={emailDetails.subject}
								onChange={event => setEmailDetails(prev => ({ ...prev, subject: event.target.value }))}
							/>
						</div>
						<div className="w-full">
							<p className="text-sm font-medium">Message to the Learners</p>
							<textarea
								className="
						form-control
						block
						w-full
						px-3.5
						py-1.5
						text-sm
						font-normal
						text-gray-700
						bg-white bg-clip-padding
						border border-solid border-gray-300
						rounded-md
						transition
						ease-in-out
						my-1.5
						resize-none
						focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
					"
								rows={4}
								required
								placeholder="Message..."
								value={emailDetails.message}
								onChange={event => setEmailDetails(prev => ({ ...prev, message: event.target.value }))}
							></textarea>
						</div>
						<div className="w-full flex gap-1 items-center">
							<input
								type="checkbox"
								id={`allCourseAndAssessment`}
								className="z-2 focus:outline-[#e2e2e2]"
								onChange={event => setIsIncludeAllCourseAndAssessments(event.target.checked)}
								tabIndex={0}
							/>
							{/* <label
									className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
									htmlFor={`allCourseAndAssessment`}
									tabIndex={0}
								></label> */}
							<label htmlFor="allCourseAndAssessment" className="lg:whitespace-nowrap ml-1">
								Include List of Courses and Assessments in the Email
							</label>
						</div>
					</div>
					<div className="flex items-center gap-4 w-full">
						<button
							className="bg-white rounded-[30px] border border-gray-200 text-sm py-2 px-4"
							onClick={() => setIsSendEmailNotificationClicked(false)}
						>
							Cancel
						</button>
						<button className="bg-primary text-white rounded-[30px] text-sm py-2 px-4" type="submit">
							Send to All Users
						</button>
					</div>
				</section>
			</form>
		</section>
	) : null;
}

export default SendEmailNotification;
