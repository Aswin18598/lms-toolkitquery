import React from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import FacebookLogin from "@greatsumini/react-facebook-login";

import { navigateLink } from "~/config/api/links";
import { useSocialLoginMutation } from "~/features/auth/social-login/store";

export const Facebook = React.memo(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const [socialLogin, option] = useSocialLoginMutation();
	const onLoginSuccess = async (profile: any) => {
		const SocialType = "FacebookID";
		const user = {
			FirstName: profile.first_name,
			LastName: profile.last_name,
			Email: profile.email,
			SocialID: profile.id,
			SocialType
		};
		await socialLogin(user).unwrap();
		const dashboardLink = {
			pathname: navigateLink.dashboard,
			search: location.search
		};
		navigate(dashboardLink, { replace: true });
		//window.location.replace(window.location.origin + navigateLink.dashboard + location.search);
	};
	return (
		<FacebookLogin
			fields="email,first_name,last_name"
			appId={import.meta.env.VITE_FB_APP_ID}
			// onSuccess={response => {
			// 	console.log("Login Success!", response);
			// }}
			onFail={error => {
				console.error("Login Failed!", error);
			}}
			onProfileSuccess={onLoginSuccess}
			render={({ onClick }) => (
				<button
					disabled={option.isLoading}
					onClick={onClick}
					className="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
				>
					{option.isLoading && <Icon width={22} className="animate-spin" icon="bx:loader-alt" />}
					{!option.isLoading && (
						<>
							<Icon width={22} icon="akar-icons:facebook-fill" color="#3b5998" />
							<span>Facebook</span>
						</>
					)}
				</button>
			)}
		/>
	);
});
