import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { getLoggedUser } from "~/helpers/auth";

const UserDetail = getLoggedUser();
export const LearningCourseILT = ({ SpecificDetails }: any) => {
	const navigate = useNavigate();
	return (
		<>
			{UserDetail.AccountType !== 2 && SpecificDetails.ILT === 1 && (
				<button
					className={`flex items-center justify-center border border-gray-200 rounded-lg h-12 w-12`}
					title={"ILT"}
					disabled={SpecificDetails.ILT === 0}
					onClick={() => navigate(navigateLink.training)}
				>
					<Icon
						width="16"
						height="16"
						icon="ic:outline-date-range"
						style={{ color: "rgba(2, 10, 18, 0.74)" }}
					/>
				</button>
			)}
		</>
	);
};

export const LearningILT = ({ course }: any) => {
	const navigate = useNavigate();

	return (
		<>
			{UserDetail.AccountType !== 2 && course.ILT === 1 && (
				<button
					className="w-8 h-8 rounded-full"
					title={"ILT"}
					disabled={course.ILT === 0}
					onClick={() => navigate(navigateLink.training)}
				>
					<Icon
						className="w-4 h-4 my-2 ml-2"
						icon="ic:outline-date-range"
						style={{ color: "rgba(2, 10, 18, 0.74)" }}
					/>
				</button>
			)}
		</>
	);
};
