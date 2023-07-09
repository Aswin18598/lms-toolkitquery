import { sso } from "~/features/auth/sso-login/constants";
import { BackToLogin, DomainForm } from "~/features/auth/sso-login/components";

function SsoLoginPage() {
	return (
		<div className="flex w-full max-w-md grow flex-col justify-center p-5 bg-white">
			<div className="text-center">
				<img className="mx-auto mb-5 lg:hidden w-32" src="/logo.png" alt="logo" />
				<div className="mt-4">
					<h2 className="text-3xl font-semibold text-slate-600 dark:text-navy-100">{sso.title}</h2>
					<p className="text-slate-400 dark:text-navy-300 mt-2 text-sm+">{sso.description}</p>
				</div>
			</div>
			<DomainForm />
			<BackToLogin />
		</div>
	);
}

export default SsoLoginPage;
