import { Icon } from "@iconify/react";
import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";
import { LinkedinIcon, LinkedinShareButton } from "react-share";
import { useEffect, useState } from "react";
import { setCertificateDataToEmpty, useGetCertificateInfoQuery } from "~/features/learning/store";
import { getLoggedUser } from "~/helpers/auth";
import { useAppSelector } from "~/config/store";
import CertificateDownload from "~/helpers/CertificateDownload";
import { useDispatch } from "react-redux";
import Tippy from "@tippyjs/react";

interface Iprops {
	clickHide: Function;
	courseDetails: any;
}
const CourseHistoryChild = ({ clickHide, courseDetails }: Iprops) => {
	const website = import.meta.env.VITE_PUBLIC_SHARE_URL;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const UserDetail = getLoggedUser();
	const [eventId, setEventId] = useState<number>(-1);
	const [itemId, setItemId] = useState<number>(0);
	const [mode, setMode] = useState<number>(0);
	const certificateData = useGetCertificateInfoQuery(
		{ UserID: UserDetail.UserId, EventID: eventId, ItemID: itemId, IDType: 1, Mode: mode },
		{ skip: itemId === 0 }
	);
	const { CertificateInfo } = useAppSelector((state: any) => state.learningReducer);
	const handleNavigate = (course: any) => {
		navigate(navigateLink.LearningCoursedetail + "&" + course.CourseID);
	};
	const handleCertficateDownload = (event: number, item: number, type: number) => {
		setEventId(event);
		setItemId(item);
		setMode(type);
		certificateData?.refetch();
	};
	useEffect(() => {
		setTimeout(() => {
			if (CertificateInfo?.ItemID !== 0 && CertificateInfo?.UserName?.length > 0) {
				CertificateDownload(CertificateInfo);
				dispatch(setCertificateDataToEmpty([]));
				setEventId(-1);
				setItemId(0);
				setMode(0);
			}
		}, 1000);
	}, [CertificateInfo]);

	return (
		<tr className="border-y border-transparent border-b-slate-200 text-[#020A12]/60">
			<td colSpan={6}>
				<div className="bg-white rounded-lg">
					<table className="is-hoverable w-full text-left">
						<thead>
							<tr className="text-sm font-dmsans m-4 font-medium">
								<th className=" px-4 py-3 lg:px-5">#</th>
								<th className=" px-4 py-3 lg:px-5">COURSE NAME</th>
								<th className=" px-4 py-3 lg:px-5">POINTS EARNED</th>
								<th className=" px-4 py-3 lg:px-5">COMPLETION DATE</th>
								<th className=" px-4 py-3 lg:px-5">ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{courseDetails.map((course: any, index: number) => (
								<tr className="border-y border-transparent border-b-slate-200" key={course?.CourseName}>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">{index + 1}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div
											className="flex text-left cursor-pointer"
											onClick={() => handleNavigate(course)}
											title="View Detail"
										>
											<p className="text-sm font-dmsans text-[#020A12]/60">{course.Title}</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-1  sm:px-5">
										<div className="flex text-left">
											<p className="ml-2 mt-2 text-sm font-dmsans text-[#020A12]/60">
												{course?.PointsEarned}
											</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left">
											<p className="text-sm font-dmsans text-[#020A12]/60">
												{course?.LastLaunchDate.split("T")[0]}
											</p>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4 last:py-4 sm:px-5">
										<div className="flex text-left justify-start">
											<button
												className="mr-3 text-sm font-dmsanstext-[#020A12]/60"
												title={"Certificate"}
												onClick={e =>
													handleCertficateDownload(+course.EventID, +course.CourseID, 1)
												}
												disabled={+course?.Progress !== 100}
											>
												<Icon
													className={` ${
														+course.Progress === 100
															? "invert-[0%]"
															: "cursor-default invert-[80%]"
													}`}
													icon="fluent:certificate-24-regular"
													width="16"
													height="16"
													style={{ color: "rgba(2, 10, 18, 0.74)" }}
												/>
											</button>

											<LinkedinShareButton url={website}>
												<Icon icon="logos:linkedin-icon" width="14" height="14" />
											</LinkedinShareButton>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</td>
		</tr>
	);
};

export default CourseHistoryChild;
