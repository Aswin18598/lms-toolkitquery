import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import ElementPopper from "react-element-popper";
import classNames from "classnames";

import "react-element-popper/build/element_popper.css";
import { Icon } from "@iconify/react";

type ProfileMenusProps = {
	position?: string;
	size?: string;
	toggleSidebar?: any;
};

const menus = [
	{
		icon: "mingcute:award-fill",
		name: "Profile",
		description: "Your Profile Setting",
		link: "/account/update/personal"
	},
	{
		icon: "mingcute:book-3-fill",
		name: "Transcript",
		description: "Your Achievements",
		link: "/transcript"
	},
	{
		icon: "mingcute:settings-3-fill",
		name: "Subscriptions",
		description: "Your Subscriptions",
		link: "/subscriptions"
	}
];

export function ProfileMenus(props: ProfileMenusProps) {
	const { position, size, toggleSidebar } = props;
	const user = getLoggedUser();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const ref: any = useRef();

	useEffect(() => {
		function handleClickOutside(e: any) {
			if (ref?.current && !ref?.current?.contains(e.target)) {
				setIsMenuOpen(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const Options = () => {
		return (
			<div className="block w-60 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
				<div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 px-4 py-2 dark:bg-navy-800">
					<div className="avatar h-10 w-10">
						<img className="rounded-full" src="/profile.png" alt="avatar" />
					</div>
					<div className="flex flex-col flex-1 w-40">
						<h6
							className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light truncate"
							title={`${user.FirstName} ${user.LastName}`}
						>
							{`${user.FirstName} ${user.LastName}`}
						</h6>
						<p className="text-xs text-slate-400 truncate relative -top-1" title={user.Email}>
							{user.Email}
						</p>
					</div>
				</div>
				<div className="flex flex-col pt-2 pb-5">
					{menus.map(menu => (
						<>
							{menu.name === "Subscriptions" ? (
								// (user.AccountTypeID !== "2" && (user.UserTypeID === "1" || user.UserTypeID === "2")) ||
								!checkIsB2B() && (
									<button
										onClick={() => {
											setIsMenuOpen(false);
											navigate(menu.link);
											toggleSidebar(false);
										}}
										className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100"
									>
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-white">
											<Icon icon={menu.icon} className="h-4 w-4 text-primary" />
										</div>
										<div className="flex-1 flex flex-col items-start">
											<h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
												{menu.name}
											</h2>
											<div className="text-xs text-slate-400 line-clamp-1 relative -top-1">
												{menu.description}
											</div>
										</div>
									</button>
								)
							) : (
								<button
									onClick={() => {
										setIsMenuOpen(false);
										navigate(menu.link);
										toggleSidebar(false);
									}}
									className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100"
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-white">
										<Icon icon={menu.icon} className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1 flex flex-col items-start">
										<h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
											{menu.name}
										</h2>
										<div className="text-xs text-slate-400 line-clamp-1 relative -top-1">
											{menu.description}
										</div>
									</div>
								</button>
							)}
						</>
					))}

					<div className="mt-3 px-4">
						<Link
							to={navigateLink.auth.logout}
							className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90"
						>
							<Icon icon="mingcute:exit-fill" className="h-5 w-5 rotate-180" />
							<span>Logout</span>
						</Link>
					</div>
				</div>
			</div>
		);
	};

	return (
		<ElementPopper
			ref={ref}
			offsetX={15}
			offsetY={10}
			active={isMenuOpen}
			popper={<Options />}
			position={position}
			containerClassName="user-profile"
			containerStyle={{ display: "flex" }}
			element={
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className={classNames("avatar cursor-pointer", {
						"h-8 w-8": size === "sm",
						"h-10 w-10": size === "base"
					})}
				>
					<img className="rounded-full" src="/profile.png" alt="avatar" />
				</button>
			}
		/>
	);
}

ProfileMenus.defaultProps = {
	position: "right-end",
	size: "base"
};
