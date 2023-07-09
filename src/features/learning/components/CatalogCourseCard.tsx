import { Icon } from "@iconify/react";
import _ from "lodash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import Pagination from "./Pagination";
interface IProps {
	loader: boolean;
	setLoader: any;
}

function CatalogCourseCard({ loader, setLoader }: IProps) {
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const navigate = useNavigate();
	const { MasterCourses, MasterCourseMessage } = useAppSelector((state: any) => state?.learningReducer);
	const specificCourse = (CourseDetails: any) => {
		navigate(navigateLink.CatalogCoursedetail + "&" + CourseDetails.CourseID);
	};

	const CourseCardData = () => {
		return MasterCourses?.catalogCourses?.map((course: any, index: number) => {
			return (
				<div
					key={course.CourseID}
					className={`card bg-white min-w-[260px] border border-gray-200 py-4 px-4 rounded-2xl keen-slider__slide number-slide${index}`}
				>
					<img
						className="w-full h-40 object-contain rounded-lg"
						src={
							course.InitialGraphic ? imageUrl + course.InitialGraphic : "/assets/images/sample_learn.png"
						}
						alt="sample_learn"
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = "assets/images/sample_learn.png";
						}}
					/>
					<div className="flex flex-col items-start">
						<div className="flex items-center space-x-1">
							<p className="text-lg rounded-lg mb-2 text-left px-1.5 font-medium text-slate-700 line-clamp-1 bg-[#E2F5FF80] text-[#1268B3]">
								{course.CategoryName}
							</p>
						</div>
						<div className="flex items-center space-x-1">
							<p className="text-xs+ space-x-2 text-left h-10 line-clamp-2 font-bold text-[#020A12]/54">
								{course.Title}
							</p>
						</div>
					</div>
					<div className="flex justify-between">
						<div className="flex items-center text-xs+ text-[#020A12]/54 font-normal font-dmsans my-2">
							<span className=" line-clamp-1">{course.TotalLessons} lessons</span>{" "}
							<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
							<span className="ml-0 line-clamp-1">{course.OnlineHours} hrs</span>{" "}
							<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
							<span className="ml-0 line-clamp-1">{course.SkillLevel}</span>
						</div>
					</div>
					<div className="flex items-center text-xs+ text-[#020A12]/54 font-normal font-dmsans  mb-4">
						{_.times(Math.ceil(course.AverageRating), icon => {
							return (
								<Icon
									className="ml-0.5 w-4 h-4"
									icon="mingcute:star-fill"
									key={icon + "icon#f7c043"}
									color="#f7c043"
								/>
							);
						})}
						{_.times(5 - Math.ceil(course.AverageRating), icon => {
							return (
								<Icon
									className="ml-0.5 w-4 h-4"
									icon="mingcute:star-fill"
									key={icon + "icon#eee"}
									color="#eee"
								/>
							);
						})}
					</div>
					<span className="line-clamp-4 h-20 my-2">{course.Overview}</span>
					<button
						onClick={() => specificCourse(course)}
						className="btn border border-primary font-medium text-primary  hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 hover:bg-primary hover:text-white w-full mt-3 py-3"
					>
						View more
					</button>
				</div>
			);
		});
	};

	useEffect(() => {
		setLoader(!!!CourseCardData);
	}, [MasterCourses]);

	return (
		<>
			{loader && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!loader && (
				<>
					{!!CourseCardData && MasterCourses?.catalogCourses?.length > 0 ? (
						<>
							<div
								id="CourseCardData"
								className="grid grid-cols-1 sm:grid-cols-2 justify-items-stretch  lg:grid-cols-4 2xl:grid-cols-4 gap-6 mt-8"
							>
								<CourseCardData />
							</div>
							<Pagination PaginationData={MasterCourses} count={12} />
						</>
					) : (
						<div className="flex flex-col text-center items-center mx-auto py-12">
							{MasterCourseMessage?.toLowerCase()?.includes("success") || MasterCourseMessage === "" ? (
								<></>
							) : !MasterCourseMessage?.toLowerCase()?.includes("fail") ? (
								<>
									<img
										className="h-40 my-auto"
										src="assets/images/Tiger_images/tiger-logoutX400.png"
										alt={MasterCourseMessage}
									/>
									<p className="text-xs+ text-[#020A12]/60">{MasterCourseMessage}</p>
								</>
							) : (
								<>
									<img
										className="h-40 my-auto"
										src="assets/images/Tiger_images/tiger-logoutX400.png"
										alt={"No records Found"}
									/>
									<p className="text-xs+ text-[#020A12]/60">{"No records Found"}</p>
								</>
							)}
						</div>
					)}
				</>
			)}
		</>
	);
}

export default CatalogCourseCard;
