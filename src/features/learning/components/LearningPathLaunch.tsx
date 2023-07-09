import { Icon } from "@iconify/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "~/components";
import { getLoggedUser } from "~/helpers/auth";
import { RedirectLinkAssesment, RedirectLinkCourse } from "~/helpers/RedirectLink";
import { useAddEditAggregationEventMutation } from "../store";

const LearningPathLaunch = ({ course }: any) => {
	const { UserId } = getLoggedUser();
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const [AddEditAggregationEvent] = useAddEditAggregationEventMutation();

	const handleClick = (type: number) => {
		const payload = {
			UserID: parseInt(UserId),
			LPIID: course.CourseID,
			Status: type,
			EventID: course.EventID
		};
		AddEditAggregationEvent(payload)
			.then((res: any) => {
				if (res?.data?.Message) {
					window.open(course.URL, "_blank");
				}
			})
			.catch(err => {
				console.error("error", err);
			});
		setShowConfirmation(false);
	};
	return (
		<>
			{course.Type !== "Course" && course.Type !== "Assessment" ? (
				<button
					className="my-2 ml-2 text-sm font-dmsans text-[#020A12]/60"
					onClick={() => setShowConfirmation(true)}
					title="SocialLink"
				>
					<Icon icon="arcticons:url-checker" color="black" width="20" height="20" />
				</button>
			) : (
				<button
					className="my-2 ml-2 text-sm font-dmsans text-[#020A12]/60"
					onClick={() =>
						window.location.replace(
							course.Type === "Course"
								? RedirectLinkCourse(course.CourseID, locationEndPoint)
								: RedirectLinkAssesment(course.AssessmentID, locationEndPoint)
						)
					}
					title={`${course.Type === "Course" ? "Launch Course" : "Start Assessment"}`}
				>
					<img src="/assets/images/launch.svg" width="16" height="16" />
				</button>
			)}
			{showConfirmation ? (
				<Modal>
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div
							className="fixed inset-0 w-full h-full bg-black opacity-40"
							onClick={() => setShowConfirmation(false)}
						></div>
						<div className="flex items-center min-h-screen px-4 py-8">
							<div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
								<div className="mt-3 sm:flex">
									<div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-[#dae7f3] rounded-full">
										<Icon
											icon="mdi:information-variant-circle"
											className="w-6 h-6 text-[#1268B3]"
										/>
									</div>

									<div className="text-center sm:ml-4 sm:text-left text-clip whitespace-pre-line">
										<h4 className="text-lg font-medium text-gray-800">
											Kindly confirm whether you have completed the course before ?
										</h4>

										<div className="items-center gap-2 mt-3 sm:flex">
											<button
												className="w-[50%]  mt-2 p-2.5 flex-1 text-white bg-[#1268B3] rounded-md outline-none ring-offset-2 ring-red-600"
												onClick={() => handleClick(1)}
											>
												Yes
											</button>
											<button
												className="w-[50%]  mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600"
												onClick={() => handleClick(0)}
											>
												No
											</button>
										</div>
										<p className="mt-2 text-[15px] mr-10 sm:mr-8 leading-relaxed text-danger">
											Note: You will be redirected to third party web page.
										</p>
									</div>
									<div>
										<button onClick={() => setShowConfirmation(false)}>
											<Icon icon="ic:round-close" className="w-6 h-6" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			) : null}
		</>
	);
};

export default LearningPathLaunch;
