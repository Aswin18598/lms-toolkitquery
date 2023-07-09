import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { Page } from "~/features/skill-advisor/@types";
import { skillAdvisorAction } from "~/features/skill-advisor/store";

function Header({ title }: { title?: string }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { currentPage } = useAppSelector((state: any) => state.skillAdvisor);
	const { setCurrentPage } = skillAdvisorAction;
	return (
		<>
			<nav className="flex items-center justify-between px-4 py-2 bg-[#EBEEF6]">
				<img src="/tata-tech.png" alt="" className="h-6" />
				<img src="/tata-logo.png" alt="" className="h-4" />
			</nav>
			<header className="shrink-0 flex items-center px-3 justify-between bg-white h-14 border-b">
				<div className="divide-x flex gap-4 items-center">
					<a href={import.meta.env.VITE_CMS_WEBSITE_URL}>
						<img width={100} className="cursor-pointer relative -top-1" src="/logo.png" alt="logo" />
					</a>
					{title && <span className="pl-2 font-semibold tracking-wider text-lg">{title}</span>}
				</div>
				<div className="flex gap-5 items-center">
					{/* {user.UserId && <ProfileMenus size="sm" position="bottom-center" />} */}
					<button
						onClick={() => {
							if (title === "Course Catalog") {
								if (window.location.pathname === navigateLink.Catalog)
									window.location.replace(import.meta.env.VITE_CMS_WEBSITE_URL);
								else navigate(navigateLink.Catalog);
							} else {
								if (currentPage === "banner")
									window.location.replace(import.meta.env.VITE_CMS_WEBSITE_URL);
								else dispatch(setCurrentPage(Page.banner));
							}
						}}
						className="no-underline space-x-1 text-left flex text-[#00000099]"
					>
						<Icon icon="mingcute:arrow-left-line" className="w-5 h-5" />
						<span>Back</span>
					</button>
				</div>
			</header>
		</>
	);
}

export default Header;
