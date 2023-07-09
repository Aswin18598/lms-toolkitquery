import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";

const RelatedCourses = () => {
	const navigate = useNavigate();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const [relatedCourses, setRelatedCourses] = useState<string[]>([]);
	const { CourseProperties, MasterCoursesInitial } = useAppSelector((state: any) => state.learningReducer);

	useEffect(() => {
		const relatedData = MasterCoursesInitial?.catalogCourses
			?.filter((data: any) => {
				return (
					data.CategoryID === CourseProperties[0].CategoryID && data.CourseID !== CourseProperties[0].CourseID
				);
			})
			?.slice(0, 4);
		setRelatedCourses(relatedData);
	}, [MasterCoursesInitial]);

	const handleNavigate = (CourseID: number) => {
		navigate(navigateLink.CatalogCoursedetail + "&" + CourseID);
		window.location.reload();
	};

	return (
		<>
			{relatedCourses?.length > 0 && (
				<div className="bg-white border rounded-lg mt-6 p-8">
					<div className="font-bold text-xl  text-[#020A12] mb-1">Related Courses</div>
					{relatedCourses.map((courses: any) => {
						return (
							<div className="flex items-center border-b text-[#6A7681] py-4">
								<div className="w-1/4 mr-4">
									<img
										src={
											courses.InitialGraphic
												? imageUrl + courses.InitialGraphic
												: "/assets/images/course.png"
										}
										width={"100%"}
										height={"100%"}
										alt="course logo"
										onError={({ currentTarget }) => {
											currentTarget.onerror = null;
											currentTarget.src = "assets/images/course.png";
										}}
									/>
								</div>
								<div className="flex flex-col justify-center w-3/4">
									<span
										title="View Course"
										onClick={() => handleNavigate(courses.CourseID)}
										className="mt-[6px] lg:line-clamp-2 text-sm font-bold text-slate-600 cursor-pointer"
									>
										{courses.Title}
									</span>
									<span className="mt-[6px] text-sm font-normal sm:text-slate-600  text-[#020A12] ">
										{courses.TotalLessons} Lessons
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};

export default RelatedCourses;
