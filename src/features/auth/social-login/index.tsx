import { GoogleOAuthProvider } from "@react-oauth/google";
import classNames from "classnames";

import { Facebook, Google, LinkedIn } from "~/features/auth/social-login/components";

function SocialLogin({ signup }: { signup?: boolean }) {
	const renderDivider = () => (
		<div className="my-7 flex items-center space-x-3">
			<div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
			<p>{signup ? "OR SIGN UP WITH EMAIL" : "OR"}</p>
			<div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
		</div>
	);
	return (
		<section className="flex-col mt-6 space-y-5">
			{!signup && renderDivider()}
			<div className={classNames("flex flex-col sm:flex-row gap-3", { "mb-10": signup })}>
				<GoogleOAuthProvider clientId={import.meta.env.VITE_G_CLIENT_ID}>
					<Google />
				</GoogleOAuthProvider>
				<Facebook />
				<LinkedIn />
			</div>
			{signup && renderDivider()}
		</section>
	);
}

export default SocialLogin;
