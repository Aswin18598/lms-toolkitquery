import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useAppSelector } from "~/config/store";
import { useGetCourseListInProgressQuery } from "~/features/dashboard/store";
import { Spinner } from "~/components/spinner";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";

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
var widthRange: { [key: string]: string } = {
	"1-8": "w-1/12",
	"9-16": "w-2/12",
	"17-24": "w-3/12",
	"25-32": "w-4/12",
	"33-40": "w-5/12",
	"41-49": "w-6/12",
	"50-58": "w-7/12",
	"59-67": "w-8/12",
	"68-75": "w-9/12",
	"76-82": "w-10/12",
	"83-91": "w-11/12",
	"92-100": "w-12/12"
};
function calculateWidth(progress: any): string {
	for (var key in widthRange) {
		const range = key.split("-");
		if (range[0] <= progress && progress <= range[1]) {
			return widthRange[key];
		}
	}
	return "w-0";
}

const ContinueLearning = ({ userId }: IProps) => {
	const locationEndPoint = "dashboard";
	const { isLoading } = useGetCourseListInProgressQuery(userId);
	const { courseListInProgress, courseListInProgressMessage } = useAppSelector((state: any) => state.dashboard);
	const [currentSlide, setCurrentSlide] = useState(0);
	const navigate = useNavigate();
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

	const specificCourse = (CourseDetails: any) => {
		navigate(navigateLink.LearningCoursedetail + "&" + CourseDetails);
	};

	return (
		<div>
			<div className="w-full">
				<div className="flex items-center justify-between py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
						Continue Learning
					</h2>
					<h2 className="text-[#1268B3] cursor-pointer" onClick={() => navigate("/learning?MyLearning-1")}>
						View All
					</h2>
				</div>
				<div className="relative">
					<div className="flex keen-slider overflow-hidden w-full" ref={sliderRef}>
						{isLoading && <Spinner />}
						{!isLoading && courseListInProgress.length > 0 ? (
							courseListInProgress.map((course: any, index: number) => (
								<div
									key={course.CourseID}
									className={`bg-white border border-gray-200  pt-4 px-4 rounded-lg keen-slider__slide number-slide${index}`}
								>
									<button
										className="flex flex-col justify-start"
										onClick={() => specificCourse(course.CourseID)}
										title="View Detail"
									>
										<div className="flex flex-col text-left justify-start space-x-1">
											<p className="text-lg font-medium text-slate-700 line-clamp-1">
												{course.CourseName}
											</p>
										</div>
										<p className="text-xs+ space-x-2  text-[#020A12]/54 font-normal">
											{course.CategoryName}
										</p>
									</button>
									<div className="progress mt-10 h-1.5 bg-[#E9EEF5]">
										<div
											className={`relative h-1.5 ${calculateWidth(
												+course.Progress
											)} overflow-hidden rounded-full bg-[#1268B3]`}
										></div>
									</div>
									<div className="flex justify-between">
										<div className=" text-xs+ text-[#020A12]/54 font-normal font-dmsans mt-4">
											<span>
												{course.LessonsCompleted} / {course.LessonsTotal} lessons
											</span>
											<span className="ml-4">{course.tTime}</span>
										</div>
										<button
											title="Launch Course"
											className="my-4"
											onClick={() => {
												window.location.replace(
													RedirectLinkCourse(course.CourseID, locationEndPoint)
												);
											}}
										>
											<img src="/assets/images/launch.svg" width="20" height="20" />
										</button>
									</div>
								</div>
							))
						) : (
							<div className="flex text-center">
								<p className="my-4 text-sm font-dmsans text-[#020A12]/60">
									{courseListInProgressMessage}
								</p>
							</div>
						)}
					</div>

					{courseListInProgress.length && currentSlide !== 0 ? (
						<button
							className={`${
								courseListInProgress.length > 5 && currentSlide !== 0
									? "sm:flex w-[52px] h-[52px]"
									: "sm:hidden"
							} flex items-center justify-center cursor-pointer shadow-[0px_0px_7px] shadow-[#00000017] bg-white w-[40px] h-[40px] rounded-[50%] top-[50%] absolute translate-y-[-50%] left-[-1.75%]`}
							onClick={() => instanceRef?.current?.prev()}
						>
							<Icon icon="majesticons:chevron-left-line" width="24px" height="24px" />
						</button>
					) : null}

					{courseListInProgress.length ? (
						<button
							className={`${
								courseListInProgress.length > 5 ? "sm:flex w-[52px] h-[52px]" : "sm:hidden"
							} flex items-center justify-center cursor-pointer  w-[40px] h-[40px] shadow-[0px_0px_7px] shadow-[#00000017] bg-white  rounded-[50%] top-[50%] absolute   translate-y-[-50%] right-[-1.75%]`}
							onClick={() => instanceRef?.current?.next()}
						>
							<Icon icon="majesticons:chevron-right-line" className="w-6 h-6 sm:w-4 sm:h-4" />
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ContinueLearning;
