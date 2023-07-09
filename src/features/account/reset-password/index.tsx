import { AuthLayout } from "~/layout";
import { resetPassword } from "./constants";
import { ResetForm } from "~/features/account/reset-password/components";

function ResetPassword() {
	return (
		<AuthLayout>
			<div className="flex w-full max-w-lg grow flex-col justify-center p-5 bg-white">
				<div className="text-center">
					<img className="mx-auto mb-5 lg:hidden" src="/logo.png" alt="logo" />
					<div className="mt-4">
						<h2 className="text-3xl font-semibold text-slate-600 dark:text-navy-100">
							{resetPassword.title}
						</h2>
						<p className="text-slate-400 dark:text-navy-300 mt-2 text-sm+">{resetPassword.description}</p>
					</div>
				</div>
				<ResetForm />
			</div>
		</AuthLayout>
	);
}

export default ResetPassword;
