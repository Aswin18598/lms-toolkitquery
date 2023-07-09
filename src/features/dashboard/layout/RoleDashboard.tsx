import LearningPath from "../components/LearningPath";
import LeaderboardSection from "../components/LeaderboardSection";
import RoleSection from "../components/RoleSection";
import Stats from "../components/Stats";
import CurrentRoleSection from "../components/CurrentRoleSection";
import NewCourses from "../components/NewCourses";
import DashboardHelp from "../components/DashboardHelp";
import TimeSpent from "../components/TimeSpent";
import ContinueLearning from "../components/ContinueLearning";
import Transcript from "../components/Transcript";
import TrendingSubscriptions from "../components/TrendingSubscriptions";
import NewCoursesRecommended from "../components/NewCoursesRecommended";
import { Page } from "~/components";
import { TTLaccount, checkIsB2B, getLoggedUser } from "~/helpers/auth";
import Catalog from "../components/Catalog";
import UpcomingEvents from "../components/UpcomingEvents";
import LearningProgram from "../components/LearningProgram";

const RoleDashboard = () => {
	const { UserId, Currency, GroupId } = getLoggedUser();
	return (
		<Page>
			<CurrentRoleSection />
			<Stats userId={UserId} />
			{TTLaccount() && (
				<div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
					<LearningProgram />
				</div>
			)}
			<div className="grid grid-cols-12 lg:gap-6">
				<RoleSection userId={UserId} />
				<LeaderboardSection userId={UserId} />
			</div>
			<ContinueLearning userId={UserId} />
			{!checkIsB2B() && <TrendingSubscriptions userId={UserId} currency={Currency} />}
			<LearningPath userId={UserId} />
			<div className="grid grid-cols-12 lg:gap-6">
				<TimeSpent userId={UserId} />
				<Transcript userId={UserId} />
			</div>
			{checkIsB2B() && <UpcomingEvents userId={UserId} />}
			<NewCourses userId={UserId} />
			{/* <Catalog /> */}
			<NewCoursesRecommended userId={UserId} />
			{/* <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 mt-8">
				<DashboardHelp />
			</div> */}
		</Page>
	);
};

export default RoleDashboard;
