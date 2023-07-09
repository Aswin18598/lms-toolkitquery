import { Link } from "react-router-dom";
import { navigateLink } from "~/config/api/links";

export function PageNotFound({ isConstruction = false }: any) {
	return (
		<main className="grid w-full flex h-full items-center justify-center">
			<div className="max-w-[26rem] text-center flex flex-col items-center">
				{!isConstruction && (
					<>
						<img src="/tiger-thinking.png" alt="" width={250} />
						<p className="text-7xl font-bold text-primary dark:text-accent">404</p>
						<p className="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50">
							Oops. This Page Not Found.
						</p>
						<p className="pt-2 text-slate-500 dark:text-navy-200">
							This page you are looking not available
						</p>
					</>
				)}

				{isConstruction && (
					<p className="text-3xl font-bold text-primary dark:text-accent">Page Under Construction</p>
				)}

				<Link
					to={navigateLink.dashboard}
					className="btn mt-8 h-11 bg-primary text-base font-medium text-white hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/50 focus:bg-primary-focus focus:shadow-lg focus:shadow-primary/50 active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:hover:shadow-accent/50 dark:focus:bg-accent-focus dark:focus:shadow-accent/50 dark:active:bg-accent/90"
				>
					Back To Home
				</Link>
			</div>
		</main>
	);
}
