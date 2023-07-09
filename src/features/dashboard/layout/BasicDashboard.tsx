import HeroSection from "../components/HeroSection";
import RoleSection from "../components/RoleSection";
import TrendingSubscriptions from "../components/TrendingSubscriptions";
import NewCourses from "../components/NewCourses";
import Catalog from "../components/Catalog";
import DashboardHelp from "../components/DashboardHelp";
import { Page } from "~/components";
import { TTLaccount, checkIsB2B, getLoggedUser } from "~/helpers/auth";
import CurrentRoleSection from "../components/CurrentRoleSection";
import LearningProgram from "../components/LearningProgram";
import UpcomingEvents from "../components/UpcomingEvents";
import NewCoursesRecommended from "../components/NewCoursesRecommended";
import Stats from "../components/Stats";
import LeaderboardSection from "../components/LeaderboardSection";
import ContinueLearning from "../components/ContinueLearning";
import LearningPath from "../components/LearningPath";
import TimeSpent from "../components/TimeSpent";
import Transcript from "../components/Transcript";

const BasicDashboard = () => {
	const { UserId, Currency, AccountTypeID } = getLoggedUser();
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
			{checkIsB2B() && <UpcomingEvents userId={UserId} />}
			<NewCourses userId={UserId} />
			{!checkIsB2B() && <Catalog />}
			<NewCoursesRecommended userId={UserId} />
			{/* <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 mt-8">
				<DashboardHelp />
			</div> */}
		</Page>
	);
};

export default BasicDashboard;
