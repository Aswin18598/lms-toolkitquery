import { Outlet } from "react-router-dom";
import { Page } from "~/components";
import { Navigations } from "../components";

function UserUpdateProfileLayout() {
	return (
		<Page harizontal={false} pt>
			<section className="w-full grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
				<Navigations />
				<div className="col-span-12 lg:col-span-8 xl:col-span-9">
					<Outlet />
				</div>
			</section>
		</Page>
	);
}

export default UserUpdateProfileLayout;
