import Tippy from "@tippyjs/react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfileMenus } from "./ProfileMenus";
import { Icon } from "@iconify/react";
import * as AsideMenu from "~/config/asideMenu";
import classNames from "classnames";

import "tippy.js/dist/tippy.css"; // optional
import { getLoggedUser } from "~/helpers/auth";
import { dispatch } from "~/config/store";
import { setShowFeedbackModel } from "~/features/training/store";
import {
	RedirectLinkAccount,
	RedirectLinkAuthor,
	RedirectLinkReport,
	RedirectLinkTraining,
	RedirectLinkknowledge
} from "~/helpers/RedirectLink";

export function Sidebar({ menus, isMenuOpen, handleMenuClick }: any) {
	const location = useLocation();
	const navigate = useNavigate();
	const imageUrl = import.meta.env.VITE_MENU_ICONS_IMG_URL + "menu/";
	const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
	const UserDetail = getLoggedUser();

	const [imageprefix, setImageprefix] = useState<string[]>([
		"1-",
		"1-",
		"1-",
		"1-",
		"1-",
		"1-",
		"1-",
		"1-",
		"1-",
		"1-"
	]);
	const handleLinkClick = (clickIndex: number) => {
		const newImagePrefix: string[] = [];
		imageprefix.forEach(function (value, index) {
			if (index === clickIndex) {
				newImagePrefix.push("");
			} else {
				newImagePrefix.push("1-");
			}
		});
		setImageprefix(newImagePrefix);
		dispatch(setShowFeedbackModel(true));
		handleMenuClick(false);
	};

	useEffect(() => {}, [imageprefix]);

	const activeClass = ({ isActive }: any) => {
		return classNames(
			"group flex text-sm items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all hover:bg-primary hover:text-white",
			{ "bg-primary text-white": isActive }
		);
	};

	const getSubMenu = () => {
		if (location.pathname.includes("/account/update")) return AsideMenu.profileMenus;
		if (
			location.pathname.startsWith("/account/management") ||
			location.pathname.startsWith("/account/assigned-learning")
		)
			return AsideMenu.accountMenus;
		if (location.pathname.includes("learning")) return AsideMenu.learningMenus;
		if (location.pathname.includes("/training")) return AsideMenu.ILTMenus;
		if (location.pathname.includes("/author/management")) return AsideMenu.authorMenus;
		else return [];
	};

	return (
		<aside
			className={classNames("z-40 h-full w-[var(--main-sidebar-width)] shrink-0 sm:block", {
				block: isMenuOpen,
				hidden: !isMenuOpen
			})}
		>
			<div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white">
				<div className="flex pt-4 px-1.5">
					<Link to="/">
						<img src="/logo.png" alt="logo" />
					</Link>
				</div>
				<div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
					{menus.map((menu: any, index: number) => (
						<>
							{menu.Link === "/reports" ? (
								<Tippy key={menu.Link} content={menu.Name} placement="right">
									<a
										onClick={() => handleLinkClick(index)}
										href={RedirectLinkReport()}
										className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20"
										target="_self"
									>
										<img src={imageUrl + imageprefix[index] + menu.Icon} alt="" />
									</a>
								</Tippy>
							) : menu.Link === "/knowledge-management" ? (
								<Tippy key={menu.Link} content={menu.Name} placement="right">
									<a
										onClick={() => handleLinkClick(index)}
										href={RedirectLinkknowledge()}
										className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20"
										target="_self"
									>
										<img src={imageUrl + imageprefix[index] + menu.Icon} alt="" />
									</a>
								</Tippy>
							) : menu.Link === "/target-training" ? (
								<Tippy key={menu.Link} content={menu.Name} placement="right">
									<a
										onClick={() => handleLinkClick(index)}
										href={RedirectLinkTraining()}
										className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20"
										target="_self"
									>
										<img src={imageUrl + imageprefix[index] + menu.Icon} alt="" />
									</a>
								</Tippy>
							) : (
								<Tippy key={menu.Link} content={menu.Name} placement="right">
									<Link
										onClick={() => handleLinkClick(index)}
										to={menu.Link}
										className="flex h-11 w-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20"
									>
										<img src={imageUrl + imageprefix[index] + menu.Icon} alt="" />
									</Link>
								</Tippy>
							)}
						</>
					))}
				</div>
				<div className="flex flex-col items-center space-y-3 py-3">
					<ProfileMenus toggleSidebar={handleMenuClick} />
				</div>
			</div>
			{isMenuOpen && (
				<div
					className="sidebar-panel fixed top-0 bottom-0 shadow-md"
					style={{
						width: "calc(var(--main-sidebar-width) + var(--sidebar-panel-width))",
						left: "var(--main-sidebar-width)"
					}}
				>
					<div className="flex h-full grow flex-col bg-white dark:bg-navy-750">
						<div className="flex h-[61px] w-full items-center justify-between pl-4 pr-1">
							<p className="text-base tracking-wider text-slate-800 dark:text-navy-100">Menus</p>
							<button
								onClick={handleMenuClick}
								className="btn h-7 w-7 rounded-md p-0 text-primary hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25"
							>
								<Icon icon="mingcute:left-line" className="h-6 w-6" />
							</button>
						</div>
						<div className="h-full overflow-x-hidden pb-6">
							<ul className="mt-4 space-y-1.5 px-2 font-inter text-xs+ font-medium">
								{getSubMenu().map((menu: any) => (
									<>
										{menu.path === "/rapid-authoring-tool" ? (
											<a
												href={RedirectLinkAuthor()}
												target="_self"
												className="group flex space-x-2 rounded-lg py-3 px-4 tracking-wide text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-slate-100"
											>
												{menu.icon && <Icon className="h-4.5 w-4.5" icon={menu.icon} />}
												<span>{menu.name}</span>
											</a>
										) : menu.path === "/user-administration" ? (
											<a
												href={RedirectLinkAccount()}
												target="_self"
												className="group flex space-x-2 rounded-lg py-3 px-4 tracking-wide text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-slate-100"
											>
												{menu.icon && <Icon className="h-4.5 w-4.5" icon={menu.icon} />}
												<span>{menu.name}</span>
											</a>
										) : (
											<li key={menu.link}>
												<button
													className="group flex space-x-2 rounded-lg py-3 px-4 tracking-wide text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-slate-100"
													onClick={() => {
														navigate(menu.path);
														handleMenuClick();
													}}
												>
													{menu.icon && <Icon className="h-4.5 w-4.5" icon={menu.icon} />}
													<span>{menu.name}</span>
												</button>
											</li>
										)}
									</>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}
