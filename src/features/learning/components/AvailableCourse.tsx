import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";

interface Iprops {
	SpecificDetails: any;
}
const AvailableCourse = ({ SpecificDetails }: Iprops) => {
	const [Exist, setExist] = useState<boolean>(false);
	const location = useLocation();
	const user = getLoggedUser();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	const navigate = useNavigate();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const downloadZip = (file: string) => {
		const a = document.createElement("a");
		a.setAttribute("download", "Resources.zip");
		a.href = file;
		a.setAttribute("target", "_blank");
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const FileExistCheck = () => {
		fetch(imageUrl + SpecificDetails.Filename)
			.then((res: any) => {
				setExist(true);
			})
			.catch((error: any) => {
				setExist(false);
			});
	};

	useEffect(() => {
		FileExistCheck();
	}, []);

	return (
		<div className="flex flex-col">
			<div className="bg-white border rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-1">{SpecificDetails.CategoryName}</div>
				<div className="flex items-center border-b text-[#6A7681] py-4 gap-2">
					<Icon icon="ic:sharp-access-time" width="16" height="16" />
					<div className="flex justify-between w-full">
						<span className="text-base font-bold">Duration</span>
						<span className="text-base">{SpecificDetails.OnlineHours} hrs</span>
					</div>
				</div>
				<div className="flex items-center border-b text-[#6A7681] py-4 gap-2">
					<Icon icon="mingcute:book-5-line" width="16" height="16" />

					<div className="flex justify-between w-full">
						<span className="text-base font-bold">Lessons</span>
						<span className="text-base">{SpecificDetails.LessonsTotal}</span>
					</div>
				</div>
				<div className="flex items-center border-b text-[#6A7681] py-4 gap-2">
					<Icon icon="quill:star" width="16" height="16" />

					<div className="flex justify-between w-full">
						<span className="text-base font-bold">Rating</span>
						<span className="text-base">{SpecificDetails.AverageRating}/5</span>
					</div>
				</div>
				{SpecificDetails.Filename && Exist && (
					<div className="flex items-center py-4 gap-2 ">
						<Icon icon="material-symbols:folder-outline" width="16" height="16" />
						<div className="flex justify-between w-full">
							<span className="text-base font-bold">Resource</span>
							<span className="text-base cursor-pointer">
								<button
									className={classNames(
										{ "underline hover:text-[#4F46E5]": Exist },
										{ "cursor-not-allowed": !Exist }
									)}
									onClick={() => downloadZip(imageUrl + SpecificDetails.Filename)}
									disabled={!Exist}
								>
									Download
								</button>
							</span>
						</div>
					</div>
				)}
				{(SpecificDetails.SubscriptionAction === "Launch Course" || !checkIsB2B()) && (
					<div className="mt-5 flex items-center justify-center">
						<button
							onClick={() => {
								SpecificDetails.SubscriptionAction !== "Launch Course"
									? navigate(navigateLink.subscriptions + "?" + 2, {
											state: { CategoryID: SpecificDetails.CategoryID }
									  })
									: window.location.replace(
											RedirectLinkCourse(SpecificDetails.CourseID, locationEndPoint)
									  );
							}}
							className="btn flex items-center bg-[#1268B3] text-[#FFFFFF] w-64 h-14"
						>
							{SpecificDetails.SubscriptionAction}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AvailableCourse;
