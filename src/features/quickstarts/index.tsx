import { Page } from "~/components";
import SearchBar from "./components/SearchBar";
import Catagory from "./components/Catagory";
import SubCatagory from "./components/SubCatagory";
import QuickStartsNotification from "./components/QuickStartsNotification";
import QuickstartGrid from "./components/QuickStartGrid";
import { getLoggedUser } from "~/helpers/auth";

function QuickstartsPage() {
	const { UserId } = getLoggedUser();
	return (
		<Page title="Quick Start">
			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-wrap flex-row gap-4">
					<div className="w-full sm:w-[225px]">
						<SearchBar />
					</div>

					<div className="w-full sm:w-[225px]">
						<Catagory UserID={UserId} />
					</div>

					<div className="w-full sm:w-[225px]">
						<SubCatagory UserID={UserId} />
					</div>
				</div>
				<div className="min-w-[330px]">
					<QuickStartsNotification UserID={UserId} />
				</div>
			</div>
			<QuickstartGrid UserID={UserId} />
		</Page>
	);
}

export default QuickstartsPage;
