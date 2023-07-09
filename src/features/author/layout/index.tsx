import classNames from "classnames";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import Page from "~/components/page";
import { RedirectLinkAuthor } from "~/helpers/RedirectLink";
import { getLoggedUser } from "~/helpers/auth";

const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
const UserDetail = getLoggedUser();
const menus = [
	{ name: "Dashboard", path: "." },
	{ name: "Rapid Authoring Tool", path: "rapid-authoring-tool" },
	{ name: "Course Detail Report", path: "course-detail-report" }
];

const Layout = () => {
	const [active, setActive] = useState(false);
	const style = {
		activeClass: classNames(
			"btn text-sm font-normal shrink-0 rounded-none border-b-2 px-0 py-2 font-normal focus:none",
			{
				"border-primary text-primary": active,
				"border-transparent hover:text-slate-800": !active
			}
		)
	};
	return (
		<Page title="Author Management" harizontal>
			<div className="flex gap-6 border-b-2 border-slate-150">
				{menus.map(menu => (
					<>
						{menu.path === "rapid-authoring-tool" ? (
							<a
								href={RedirectLinkAuthor()}
								className={style.activeClass}
								target="_self"
								onClick={() => setActive(!active)}
							>
								<span>{menu.name}</span>
							</a>
						) : (
							<NavLink
								end
								to={menu.path}
								key={menu.path}
								className={({ isActive }) =>
									classNames(
										"btn text-sm font-normal shrink-0 rounded-none border-b-2 px-0 py-2 font-normal focus:none",
										{
											"border-primary text-primary": isActive,
											"border-transparent hover:text-slate-800": !isActive
										}
									)
								}
							>
								<span>{menu.name}</span>
							</NavLink>
						)}
					</>
				))}
			</div>
			<ReactFlowProvider>
				<Outlet />
			</ReactFlowProvider>
		</Page>
	);
};

export default Layout;
