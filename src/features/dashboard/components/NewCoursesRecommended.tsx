import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useAppSelector } from "~/config/store";
import { useGetRecommendedCourseListQuery, useGetPeersCourseListQuery } from "~/features/dashboard/store";
import { Spinner } from "~/components/spinner";
import { Icon } from "@iconify/react";
import { navigateLink } from "~/config/api/links";
import { useNavigate } from "react-router-dom";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";
import { checkIsB2B } from "~/helpers/auth";
interface IProps {
	userId?: string;
}

const ResizePlugin = (slider: any) => {
	const observer = new ResizeObserver(function () {
		slider.update();
	});

	slider.on("created", () => {
		observer.observe(slider.container);
	});
	slider.on("destroyed", () => {
		observer.unobserve(slider.container);
	});
};
const NewCoursesRecommended = ({ userId }: IProps) => {
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const locationEndPoint = "dashboard";
	const navigate = useNavigate();
	const [currentSlide, setCurrentSlide] = useState(0);
	const { isLoading } = useGetRecommendedCourseListQuery(userId);
	useGetPeersCourseListQuery(userId);
	const { recommendedCourseList, recommendedCourseListMessage } = useAppSelector((state: any) => state.dashboard);
	const { peersCourseList, peersCourseListMessage } = useAppSelector((state: any) => state.dashboard);
	const [courseList, setCourseList] = useState<any>([]);
	const [message, setMessage] = useState<string>("");
	const [highlightRecommended, setHighlightRecommended] = useState<boolean>(false);
	const [highlightPeers, setHighlightPeers] = useState<boolean>(true);
	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
		{
			initial: 1,
			loop: false,
			breakpoints: {
				"(min-width: 400px)": {
					slides: { perView: 2, spacing: 24 }
				},
				"(min-width: 992px)": {
					slides: { perView: 3, spacing: 24 }
				},
				"(min-width: 1200px)": {
					slides: { perView: 4, spacing: 24 }
				},
				"(min-width: 1500px)": {
					slides: { perView: 5, spacing: 24 }
				}
			},
			slideChanged(s) {
				setCurrentSlide(s.track.details.rel);
			}
		},
		[ResizePlugin]
	);

	useEffect(() => {
		if (checkIsB2B()) {
			if (peersCourseList.length > 0) {
				setCourseList(peersCourseList);
			} else {
				setMessage(peersCourseListMessage);
			}
		} else {
			if (recommendedCourseList.length > 0) {
				setCourseList(recommendedCourseList);
			} else {
				setMessage(recommendedCourseListMessage);
			}
		}
	}, [peersCourseList, recommendedCourseList]);

	function onClickButton(eventPeriodStr: string): void {
		if (eventPeriodStr === "R") {
			setCourseList(recommendedCourseList);
			setMessage(recommendedCourseListMessage);
			setHighlightRecommended(true);
			setHighlightPeers(false);
		} else if (eventPeriodStr === "P") {
			setCourseList(peersCourseList);
			setMessage(peersCourseListMessage);
			setHighlightPeers(true);
			setHighlightRecommended(false);
		}
	}

	function showRecommendHighlighted(): string {
		if (highlightRecommended) {
			return " bg-white";
		} else {
			return "";
		}
	}

	function showPeersHighlighted(): string {
		if (highlightPeers) {
			return " bg-white";
		} else {
			return "";
		}
	}

	const specificCourse = (CourseDetails: any) => {
		navigate(navigateLink.CatalogCoursedetail + "&" + CourseDetails.CourseID);
	};

	return (
		<div className="py-5 lg:py-6 w-full">
			{checkIsB2B() && (
				<>
					<div className="flex flex-col justify-between sm:flex-row bg-[#E9EEF5] rounded-lg py-1 px-2 w-72 sm:w-96 my-4">
						<button
							className={` ${showPeersHighlighted()} flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors  font-semibold text-sm font-dmsans`}
							onClick={() => onClickButton("P")}
						>
							What peers learning
						</button>
						<button
							className={` ${showRecommendHighlighted()} flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors  font-semibold text-sm font-dmsans`}
							onClick={() => onClickButton("R")}
						>
							Recommended for you
						</button>
					</div>

					{/* // : (
			// 	<div className="flex flex-col justify-between sm:flex-row bg-[#E9EEF5] rounded-lg py-1 px-2 w-fit my-4">
			// 		<button
			// 			className={`bg-white flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors  font-semibold text-sm font-dmsans`}
			// 			onClick={() => onClickButton("R")}
			// 		>
			// 			Recommended for you
			// 		</button>
			// 	</div>
			// ) */}
					<div className="relative">
						<div className="flex keen-slider overflow-hidden w-full" ref={sliderRef}>
							{isLoading && <Spinner />}
							{!isLoading && courseList.length > 0 ? (
								courseList.map((course: any, index: number) => (
									<div
										key={index}
										className={`bg-white px-5 py-6 rounded-lg border border-gray-200  keen-slider__slide number-slide${index} `}
									>
										<img
											src={
												course.InitialGraphic
													? imageUrl + course.InitialGraphic
													: "assets/images/user-pic.svg"
											}
											alt="profile"
											className="w-12 h-12"
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src = "assets/images/user-pic.svg";
											}}
										/>
										<button
											className="flex flex-col items-start text-left my-4"
											onClick={() => specificCourse(course)}
										>
											<div className="mt-[14px] px-[6px] bg-info/10  dark:bg-info/15  inline-block rounded-sm">
												<span className="leading-4 text-xs text-primary font-bold">
													{course.CategoryName}
												</span>
											</div>
											<div className="mt-[6px] line-clamp-1 text-base font-medium text-slate-600 dark:text-navy-100">
												{course.CourseName}
											</div>
										</button>
										<div className=" font-medium text-xs flex items-center leading-[17px]  ">
											<span>{course.TotalLessons} lessons</span>{" "}
											<div className="w-[8px] h-[8px] bg-slate-200 rounded-[50%] ml-1 mr-1"></div>
											<span>
												{course.OnlineHours} {+course.OnlineHours > 1 ? "hrs" : "hr"}
											</span>
											<div className="w-[8px] h-[8px] bg-slate-200 rounded-[50%] ml-1 mr-1"></div>
											<span>{course.Enrolled}+ enrolled</span>
										</div>
										<div className="mt-9 flex justify-between">
											<div className="flex items-center">
												{[...Array(course.Rating)].map((item, index) => (
													<Icon
														key={index}
														icon="mingcute:star-fill"
														fill="rgba(247, 192, 67, 1)"
														width="16"
														height="16"
														color="rgba(247, 192, 67, 1)"
													/>
												))}
											</div>
											<button
												title="Launch Course"
												onClick={() => {
													window.location.replace(
														RedirectLinkCourse(course.CourseID, locationEndPoint)
													);
												}}
												className="w-[28px] h-[28px] flex items-center justify-center rounded-[50%] ml-1 mr-1"
											>
												<img src="/assets/images/launch.svg" width="20" height="20" />
											</button>
										</div>
									</div>
								))
							) : (
								<div className="flex text-center">
									<p className="my-4 text-xs+ text-[#020A12]/60">{message}</p>
								</div>
							)}
						</div>
						<button
							className={`${
								!isLoading && courseList.length > 5 && currentSlide !== 0 ? "sm:flex" : "sm:hidden"
							} flex items-center justify-center cursor-pointer shadow-[0px_0px_7px] shadow-[#00000017] bg-white w-[52px] h-[52px] rounded-[50%] top-[50%] absolute translate-y-[-50%] left-[-1.75%]`}
							onClick={() => instanceRef?.current?.prev()}
						>
							<Icon icon="majesticons:chevron-left-line" width="24px" height="24px" />
						</button>

						<button
							className={`${
								!isLoading && courseList.length > 5 && currentSlide !== courseList?.length - 5
									? "sm:flex"
									: "sm:hidden"
							} flex items-center justify-center cursor-pointer w-[52px] shadow-[0px_0px_7px] shadow-[#00000017] bg-white h-[52px] rounded-[50%] top-[50%] absolute   translate-y-[-50%] right-[-1.75%]`}
							onClick={() => instanceRef?.current?.next()}
						>
							<Icon icon="majesticons:chevron-right-line" width="24px" height="24px" />
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default NewCoursesRecommended;
