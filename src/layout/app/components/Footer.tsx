import classNames from "classnames";
import { RedirectLinkHelp } from "~/helpers/RedirectLink";
import { getLoggedUser } from "~/helpers/auth";

const style = {
	wrapper: "px-[var(--margin-x)] transition-[padding,width] duration-[.25s] relative bg-white border-t text-sm",
	linkWrapper: classNames(
		"order-1 flex gap-5 justify-center items-center w-full text-sm text-gray-500",
		"sm:order-2 sm:justify-end sm:gap-5"
	)
};

export function AppFooter() {
	const website = import.meta.env.VITE_CMS_WEBSITE_URL;
	const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
	const UserDetail = getLoggedUser();
	return (
		<footer className={style.wrapper}>
			<section className="flex flex-col items-center justify-between py-2 sm:flex-row">
				<span className="order-2 flex shrink-0 mt-1 sm:order-1 sm:mt-0">&copy; Tata Technologies</span>
				<div className={style.linkWrapper}>
					<a href={RedirectLinkHelp()} target="_self" className="no-underline hover:underline">
						Help
					</a>

					<a href={`${website}/privacy-policy-2/`} target="_blank" className="no-underline hover:underline">
						Privacy Policy
					</a>

					<a href={`${website}/terms-of-use/`} target="_blank" className="no-underline hover:underline">
						Terms of Use
					</a>
				</div>
			</section>
		</footer>
	);
}
