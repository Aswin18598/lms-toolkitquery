import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";

const learningRoutingMenu = ["MyLearning-1", "LearningPaths", "History", "Catalog"];
const learningMenu = ["My Learning", "Learning Paths", "History", "Catalog"];

function NavigationLearningmenu() {
	const navigate = useNavigate();
	const location = useLocation();
	const [navigateIndex, setNavigateIndex] = useState<number>(-1);
	const learningMenuTab = location.search.replace("?", "");
	const { TrialUser } = useAppSelector((state: any) => state.headersandmenuReducer);

	const handleNavigate = (index: number) => {
		setNavigateIndex(index);
		if (learningRoutingMenu[index] !== learningRoutingMenu[navigateIndex]) {
			navigate(navigateLink.learning + "?" + learningRoutingMenu[index]);
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="flex w-fit rounded-lg bg-slate-200 text-slate-600 p-1">
			<div id="NavigationLearningmenu" className="flex-wrap gap-4  tabs-list p-1">
				{learningMenu.map((menu: any, index: number) => (
					<>
						{menu === "Catalog" ? (
							TrialUser?.Result !== 1 && (
								<button
									key={menu}
									onClick={() => handleNavigate(index)}
									className={`btn shrink-0 px-3 py-1 text-sm font-medium ${
										learningMenuTab?.includes(learningRoutingMenu[index].split("-")[0]) &&
										"bg-white shadow"
									}`}
								>
									{menu}
								</button>
							)
						) : (
							<button
								key={menu}
								onClick={() => handleNavigate(index)}
								className={`btn shrink-0 px-3 py-1 text-sm font-medium ${
									learningMenuTab?.includes(learningRoutingMenu[index].split("-")[0]) &&
									"bg-white shadow"
								}`}
							>
								{menu}
							</button>
						)}
					</>
				))}
			</div>
		</div>
	);
}

export default NavigationLearningmenu;
