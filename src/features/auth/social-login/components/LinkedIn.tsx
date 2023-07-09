import React from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLinkedIn } from "react-linkedin-login-oauth2";

import { navigateLink } from "~/config/api/links";
import { useLinkedInMutation } from "~/features/auth/social-login/store";

const redirectUri = `${window.location.origin}/linkedin`;

export const LinkedIn = React.memo(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const [linkedLogin, option] = useLinkedInMutation();
	const onSuccess = async (code: string) => {
		await linkedLogin({ code }).unwrap();
		const dashboardLink = {
			pathname: navigateLink.dashboard,
			search: location.search
		};
		navigate(dashboardLink, { replace: true });
		//window.location.replace(window.location.origin + navigateLink.dashboard);
	};
	const { linkedInLogin } = useLinkedIn({
		clientId: import.meta.env.VITE_L_CLIENT_ID,
		redirectUri,
		state: import.meta.env.VITE_L_STATE_KEY,
		onSuccess,
		scope: "r_emailaddress r_liteprofile",
		onError: error => {
			console.error("onError", error.errorMessage);
		}
	});

	return (
		<button
			disabled={option.isLoading}
			onClick={linkedInLogin}
			className="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
		>
			{option.isLoading && <Icon width={22} className="animate-spin" icon="bx:loader-alt" />}
			{!option.isLoading && (
				<>
					<Icon width={22} icon="akar-icons:linkedin-box-fill" color="#0e76a8" />
					<span>LinkedIn</span>
				</>
			)}
		</button>
	);
});
