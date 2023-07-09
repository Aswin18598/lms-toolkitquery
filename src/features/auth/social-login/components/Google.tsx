import React from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { navigateLink } from "~/config/api/links";
import { useSocialLoginMutation } from "~/features/auth/social-login/store";

export const Google = React.memo(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const [socialLogin, option] = useSocialLoginMutation();

	const login = useGoogleLogin({
		onSuccess: async tokenResponse => {
			const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
				headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
			});
			const profile = await resp.json();
			const user = {
				FirstName: profile.given_name,
				LastName: profile.family_name,
				Email: profile.email,
				SocialID: profile.sub,
				SocialType: "GoogleId"
			};
			await socialLogin(user).unwrap();
			const dashboardLink = {
				pathname: navigateLink.dashboard,
				search: location.search
			};
			navigate(dashboardLink, { replace: true });
			// navigation(navigateLink.dashboard, { replace: true });
			//window.location.replace(window.location.origin + navigateLink.dashboard);
		}
	});
	return (
		<button
			disabled={option.isLoading}
			onClick={() => login()}
			className="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
		>
			{option.isLoading && <Icon width={22} className="animate-spin" icon="bx:loader-alt" />}
			{!option.isLoading && (
				<>
					<Icon width={22} icon="flat-color-icons:google" />
					<span>Google</span>
				</>
			)}
		</button>
	);
});
