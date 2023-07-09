import classNames from "classnames";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { getLoggedUser } from "~/helpers/auth";
import { profileMenus } from "~/config/asideMenu";
import { useGetProfileDataQuery } from "~/features/dashboard/store";
import { useSelector } from "react-redux";
import { Spinner } from "~/components/spinner";

export function Navigations() {
	const user = getLoggedUser();
	const { isLoading } = useGetProfileDataQuery(user.UserId);
	const { ProfileData } = useSelector((state: any) => state.dashboard);

	var widthRange: { [key: string]: string } = {
		"1-8": "w-1/12",
		"9-16": "w-2/12",
		"17-24": "w-3/12",
		"25-32": "w-4/12",
		"33-40": "w-5/12",
		"41-49": "w-6/12",
		"50-58": "w-7/12",
		"59-67": "w-8/12",
		"68-75": "w-9/12",
		"76-82": "w-10/12",
		"83-91": "w-11/12",
		"92-100": "w-12/12"
	};
	function calculateWidth(progress: any): string {
		for (var key in widthRange) {
			const range = key.split("-");
			if (range[0] <= progress && progress <= range[1]) {
				return widthRange[key];
			}
		}
		return "w-0";
	}
	return (
		<div className="col-span-12 lg:col-span-4 xl:col-span-3 block sm:hidden lg:block">
			<div className="card p-4 sm:p-5">
				<div className="flex items-center space-x-4">
					<div className="avatar h-14 w-14">
						<img className="rounded-full" src="/profile.png" alt="avatar" />
					</div>
					<div>
						<h3 className="text-base font-medium text-slate-700 dark:text-navy-100">{`${user.FirstName} ${user.LastName}`}</h3>
						<p className="text-xs+">{user.Email}</p>
					</div>
				</div>
				<ul className="mt-6 space-y-1.5 text-sm">
					{profileMenus.map((menu: any) => (
						<li key={menu.link}>
							<NavLink
								className={({ isActive }) =>
									classNames(
										"group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100",
										{ "bg-primary text-white": isActive }
									)
								}
								to={menu.path}
							>
								<Icon className="h-5 w-5" icon={menu.icon || ""} />
								<span>{menu.name}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			{isLoading && <Spinner />}
			{!isLoading &&
				ProfileData.map((data: any) => {
					return (
						+data.ProfileCompletionPercentage !== 100 && (
							<div className="card text-white mt-4 bg-gradient-to-l from-pink-300 to-indigo-400 p-5 sm:flex-row via-purple-300">
								<div className="grow space-y-3">
									<div className="flex justify-between text-sm">
										<p>Profile Completion Progress</p>
										<p>{data.ProfileCompletionPercentage}%</p>
									</div>
									<div className="progress h-1.5 bg-[#E2C7E6] dark:bg-navy-500 rounded-full">
										<div
											className={`h-1.5 ${calculateWidth(
												+data.ProfileCompletionPercentage
											)} rounded-full bg-white`}
										></div>
									</div>
								</div>
							</div>
						)
					);
				})}
		</div>
	);
}
