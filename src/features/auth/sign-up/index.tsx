import { Fragment } from "react";

import SocialLogin from "~/features/auth/social-login";
import { signUp } from "~/features/auth/sign-up/constants";
import { BackToLogin, SignUpForm } from "~/features/auth/sign-up/components";
import { useAppSelector } from "~/config/store";
import { VerifyOtp } from "~/features/auth/sign-up/components/VerifyOtp";
import { SsoPageLink } from "../login/components";

function SignUpPage() {
	const isVerified = useAppSelector((state: any) => state.authSignUp.isVerified);
	return (
		<Fragment>
			<section className="flex w-full max-w-lg grow flex-col justify-center p-5 bg-white">
				<div title="beta" className="flex justify-end space-x-1 w-full font-bold mr-4">
					<span className="text-red-500">BETA</span>
				</div>
				<div className="text-center">
					<img className="mx-auto mb-5 lg:hidden w-32" src="/logo.png" alt="logo" />
					<div className="mt-4">
						<h2 className="text-3xl font-semibold text-slate-600 dark:text-navy-100">{signUp.title}</h2>
						<BackToLogin />
					</div>
				</div>
				<SocialLogin signup />
				<SignUpForm />
				<p className="text-sm p-2">
					<span>By clicking on "Sign Up" you agree to the </span>
					<a className="text-primary" href={`${import.meta.env.VITE_CMS_WEBSITE_URL}/terms-of-use`}>
						Terms of Use
					</a>
					<span> and </span>
					<a className="text-primary" href={`${import.meta.env.VITE_CMS_WEBSITE_URL}/privacy-policy-2`}>
						Privacy Policy.
					</a>
				</p>
				<SsoPageLink />
			</section>
			{isVerified && <VerifyOtp />}
		</Fragment>
	);
}

export default SignUpPage;
