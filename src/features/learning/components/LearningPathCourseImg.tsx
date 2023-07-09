export const LearningPathCourseImg = ({ course }: any) => {
	const imageUrl = import.meta.env.VITE_MENU_ICONS_IMG_URL + "images/Platform/";
	return (
		<>
			{course.Type === "Assessment" ? (
				<div className="w-8 h-8 bg-[#FFFDE6] rounded-md flex" title="Assessment">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 text-[#FAA41A] m-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
						<line x1="9" y1="7" x2="13" y2="7" /> <line x1="9" y1="11" x2="13" y2="11" />
					</svg>
				</div>
			) : course.Type === "Course" ? (
				<div className="w-8 h-8 bg-[#F5F7F9] rounded-md flex" title={"Course"}>
					<svg
						width="12"
						height="13"
						viewBox="0 0 12 13"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="m-2.5"
					>
						<path
							d="M9.33463 0.333984C10.3998 0.333984 11.3346 1.20065 11.3346 2.33398V11.0007C11.3346 12.134 10.4013 13.0007 9.33463 13.0007H2.0013C1.29839 13.0007 0.667969 12.3673 0.667969 11.6673V1.66732C0.667969 0.96441 1.3013 0.333984 2.0013 0.333984H9.33463ZM9.33463 1.66732H4.66797V11.6673H9.33463C9.67653 11.6673 10.0013 11.4073 10.0013 11.0007V2.33398C10.0013 1.9921 9.67463 1.66732 9.33463 1.66732ZM3.33464 1.66732H2.0013V11.6673H3.33464V1.66732Z"
							fill="#1268B3"
						/>
					</svg>
				</div>
			) : course.Type === "LinkedIn" ? (
				<img src={imageUrl + "1-External.png"} alt="LinkedIn" className="h-6 w-6 m-2" />
			) : course.Type === "Udemy" ? (
				<img src={imageUrl + "2-External.png"} alt="Udemy" className="h-6 w-6 m-2" />
			) : (
				<img src={imageUrl + "3-External.png"} alt="YouTube" className="h-4 w-4 m-2" />
			)}
		</>
	);
};
