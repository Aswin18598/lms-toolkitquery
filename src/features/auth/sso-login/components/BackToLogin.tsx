import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { sso } from "~/features/auth/sso-login/constants";

export const BackToLogin = React.memo(() => {
	const location = useLocation();
	return (
		<Link
			to={`${navigateLink.auth.login}${location.search}`}
			className="no-underline inline-flex items-center justify-center space-x-1 tracking-wide text-sm+ font-normal text-[#00000099] mt-7"
		>
			<span>Not an enterprise user?</span>
			<span className="text-[#1869B3] underline cursor-pointer">{sso.loginLinkText}</span>
		</Link>
	);
});
