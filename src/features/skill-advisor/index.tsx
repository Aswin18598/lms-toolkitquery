import { Fragment } from "react";
import { Page, State } from "./@types";

import { useAppSelector } from "~/config/store";

import Filter from "./components/Filter";
import PlanList from "./components/PlanList";
import PlanDetails from "./components/PlanDetails";
import PlanLearningDetails from "./components/LearningDetails";
import classNames from "classnames";
import CommonLayout from "~/layout/common";

function SkillAdvisorPage() {
	const { currentPage }: State = useAppSelector((store: any) => store.skillAdvisor);
	const currenctType = localStorage.getItem("location") === "IN" ? "INR" : "USD";
	return (
		<CommonLayout title="SkillAdvisor">
			<Filter />
			<main
				className={classNames("flex-1 flex flex-col w-full h-full overflow-auto", {
					"py-5 px-6": currentPage !== Page.banner
				})}
			>
				{currentPage === Page.banner && (
					<iframe
						className="w-full h-full"
						src={`${import.meta.env.VITE_CMS_WEBSITE_URL}/roles-copy/`}
						title="cataglog"
					/>
				)}
				{currentPage === Page.plan && <PlanList currenctType={currenctType} />}
				{currentPage === Page.planDetails && (
					<Fragment>
						<PlanDetails currenctType={currenctType} />
						<PlanLearningDetails />
					</Fragment>
				)}
			</main>
		</CommonLayout>
	);
}

export default SkillAdvisorPage;
