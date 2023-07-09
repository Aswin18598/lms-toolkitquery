import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAppSelector } from "~/config/store";
import { useGetTranscriptUserQuery } from "../store";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Spinner } from "~/components/spinner";
import { FacebookShareButton, FacebookIcon, LinkedinIcon, LinkedinShareButton } from "react-share";
import { getLoggedUser } from "~/helpers/auth";

const TranscriptDetails = () => {
	const website = import.meta.env.VITE_PUBLIC_SHARE_URL;
	const { UserId } = getLoggedUser();
	const params = useParams();
	const { isLoading } = useGetTranscriptUserQuery(params.id || UserId);
	const { TranscriptUser } = useAppSelector((state: any) => state.TranscriptReducer);
	const [isTranscript, setIsTranscript] = useState<boolean>(true);
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(navigateLink.transcriptDetails);
	};
	const handleCopy = () => {
		navigator.clipboard.writeText(document.location.href + "/" + UserId);
		toast.success("Copied to clipboard!");
	};
	const emilPadstart = (user: any) => {
		const fullName = user?.transcriptUserDetails?.EmailID;
		const idx = fullName?.indexOf("@");
		if (idx <= 3) {
			return fullName?.replace(fullName?.slice(1, idx), "*".repeat(2));
		} else {
			return fullName?.replace(fullName?.slice(3, idx), "*".repeat(5));
		}
	};

	const downloadDocument = () => {
		const downloadbtn: any = document.getElementById("download-container");
		const transcritbtn: any = document.getElementById("transcript_back");
		const sharebtn: any = document.getElementById("share-container");
		const input: any = document.getElementById("pagetodownload");
		downloadbtn.classList.add("hidden");
		transcritbtn.classList.add("hidden");
		sharebtn.classList.add("hidden");
		html2canvas(input).then((canvas: any) => {
			const img: any = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF({
				format: [794, 1123],
				unit: "px",
				orientation: "l",
				putOnlyUsedFonts: true,
				compress: true
			});
			var width = pdf.internal.pageSize.getWidth();
			var height = pdf.internal.pageSize.getHeight();
			pdf.addImage(img, "JPEG", 0, 0, width, height);
			pdf.save(`${"transcript"}`);
		});
		downloadbtn.classList.remove("hidden");
		downloadbtn.classList.add("flex");
		transcritbtn.classList.remove("hidden");
		transcritbtn.classList.add("flex");
		sharebtn.classList.remove("hidden");
		sharebtn.classList.add("flex");
	};

	return (
		<>
			{isLoading && <Spinner />}
			{!isLoading && TranscriptUser && (
				<div className="p-10 pl-28" id="pagetodownload">
					<div className="flex justify-between py-4 md:py-5 lg:py-6">
						<div className="flex items-center space-x-4">
							<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
								{TranscriptUser?.transcriptUserDetails?.FirstName}'s transcript
							</h2>
						</div>
						{!!!params.id && (
							<button
								className="btn space-x-2 rounded-full text-[#1268B3] bg-white hover:bg-white focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
								onClick={() => navigate(navigateLink.transcript)}
								id="transcript_back"
							>
								<Icon icon="ph:arrow-left-bold" width="16" height="16" color="#1268B3" />

								<span>Back</span>
							</button>
						)}
					</div>
					<div className="flex md:flex-row flex-col items-center justify-between ">
						<div className="flex items-center space-x-4 p-4 ">
							<div className="avatar h-16 w-16">
								<img className="rounded-full" src="/profile.png" alt="avatar" />
							</div>
							<div>
								<h6 className="text-xl font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light">
									{`${TranscriptUser?.transcriptUserDetails?.FirstName} ${TranscriptUser?.transcriptUserDetails?.LastName}`}
								</h6>
								<p className="text-base text-slate-5  00 dark:text-navy-300">
									{isTranscript
										? emilPadstart(TranscriptUser)
										: TranscriptUser?.transcriptUserDetails?.EmailID}
								</p>
							</div>
						</div>
						{!!!params.id && (
							<div className="flex gap-4" id="download-container">
								{!!!params.id && isTranscript ? (
									<button
										className="btn space-x-2 rounded-full bg-white hover:bg-white focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
										onClick={handleCopy}
									>
										<Icon icon="mingcute-copy-line" width="16" height="16" />

										<span>Copy URL</span>
									</button>
								) : (
									<button
										className="btn space-x-2 rounded-full bg-white hover:bg-white focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
										onClick={handleClick}
									>
										<Icon icon="ph:eye-bold" width="16" height="16" />

										<span>View as Public </span>
									</button>
								)}
								{isTranscript && (
									<button
										className="btn space-x-2 rounded-full text-[#1268B3] bg-white hover:bg-white focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
										onClick={downloadDocument}
									>
										<Icon
											icon="material-symbols:download-rounded"
											width="16"
											height="16"
											color="#1268B3"
										/>

										<span> Download Transcript</span>
									</button>
								)}
							</div>
						)}
					</div>
					<div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
						<div className="flex items-center bg-white rounded-lg p-6">
							<div className="relative">
								<img src="/assets/images/learningcard.svg" />
								<Icon
									icon="mingcute:copper-coin-line"
									width="16"
									height="16"
									color="#FAA41A"
									className="absolute left-[15px] bottom-[14px]"
								/>
							</div>
							<div className="ml-6 flex flex-col">
								<span>{TranscriptUser?.transcriptUserDetails?.TotalPoints}</span>
								<span>Learning Points</span>
							</div>
						</div>
						<div className="flex items-center bg-white rounded-lg p-6">
							<div className="relative">
								<img src="/assets/images/learningcard1.svg" />
								<Icon
									icon="mingcute:copper-coin-line"
									width="16"
									height="16"
									color="#4FC666"
									className="absolute left-[15px] bottom-[14px]"
								/>
							</div>
							<div className="ml-6 flex flex-col">
								<span>{TranscriptUser?.transcriptUserDetails?.CoursePoints}</span>
								<span>Course Points</span>
							</div>
						</div>
						<div className="flex items-center bg-white rounded-lg p-6">
							<div className="relative">
								<img src="/assets/images/learningcard2.svg" />
								<Icon
									icon="mingcute:copper-coin-line"
									width="16"
									height="16"
									color="#288AD7"
									className="absolute left-[14px] bottom-[14px]"
								/>
							</div>
							<div className="ml-6 flex flex-col">
								<span>{TranscriptUser?.transcriptUserDetails?.AssessmentPoints}</span>
								<span>Assessment Points</span>
							</div>
						</div>
						<div className="flex items-center bg-white rounded-lg p-6">
							<div className="relative">
								<img src="/assets/images/learningcard3.svg" />
								<Icon
									icon="mdi:clock-time-five-outline"
									width="16"
									height="16"
									color="#D85C57"
									className="absolute left-[15px] bottom-[14px]"
								/>
							</div>
							<div className="ml-6 flex flex-col">
								<span>{TranscriptUser?.transcriptUserDetails?.LearningTime}</span>
								<span>Time Spent</span>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg mt-6 p-8">
						<div className="font-bold text-xl text-[#020A12] mb-5">Biography</div>
						<p className="text-base">
							{TranscriptUser?.transcriptUserProfile?.Biography != "" &&
							TranscriptUser?.transcriptUserProfile?.Biography !== "\n"
								? TranscriptUser.transcriptUserProfile?.Biography
								: "Course Description will be updated soon."}
						</p>
						<div className="flex mt-5 gap-2" id="share-container">
							{TranscriptUser.transcriptUserProfile?.SocialFacebook && (
								<div className="flex items-center gap-2">
									<FacebookShareButton url={website} quote={"Courses"} hashtag="#Course">
										<FacebookIcon size={35} borderRadius={12} />
									</FacebookShareButton>
									<span>{TranscriptUser?.transcriptUserProfile?.SocialFacebook}</span>
								</div>
							)}
							{TranscriptUser?.transcriptUserProfile?.SocialLinkedIn && (
								<div className="flex items-center gap-2">
									<LinkedinShareButton url={website}>
										<LinkedinIcon size={35} borderRadius={12} />
									</LinkedinShareButton>
									<span>{TranscriptUser?.transcriptUserProfile?.SocialLinkedIn}</span>
								</div>
							)}
						</div>
					</div>
					<div className="font-bold text-xl text-[#020A12] my-5">Certifications</div>
					{TranscriptUser?.transcriptUserCertificates?.length > 0 ? (
						<div className="grid grid-cols-2 xl:grid-cols-3 gap-6 ">
							{TranscriptUser.transcriptUserCertificates.map((certify: any) => (
								<div className="bg-white rounded-lg p-5">
									<div className="font-bold">{certify.Title}</div>
									<div className="mt-2 text-sm">
										Completion Date : {certify.CompledDate.split("T")[0]}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col text-center items-center py-8">
							<span>No Certificates</span>
						</div>
					)}

					<hr />
					<div className="bg-[#F9F9F9] py-10 ">
						<div className="px-10">
							<div className="flex items-center justify-between">
								<img src="/assets/images/tata.svg" alt="tata" />
								<div className="text-[#6A737D] font-medium text-xs+">
									© 2022 Tata Technologies. All rights reserved.
								</div>
								<img src="/assets/images/tatalogo.svg" alt="logo" />
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TranscriptDetails;
