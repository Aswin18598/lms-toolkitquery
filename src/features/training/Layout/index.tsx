import classNames from "classnames";
import { NavLink, Outlet } from "react-router-dom";
import Page from "~/components/page";
import { getLoggedUser } from "~/helpers/auth";

const Layout = () => {
	const user = getLoggedUser();
	const menus = [
		{ name: "Training", path: "." },
		{ name: "Report", path: "report" }
	];
	return (
		<Page title="Training" harizontal>
			<div className="flex gap-6 border-b-2 border-slate-150">
				{menus.map(menu => (
					<>
						{menu.path === "report" ? (
							(user.UserTypeID === "2" || user.UserTypeID === "4") && (
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
							)
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
			<Outlet />
		</Page>
	);
};

export default Layout;
