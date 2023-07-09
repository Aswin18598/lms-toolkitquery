import React from "react";
import { Link, useLocation } from "react-router-dom";

import { navigateLink } from "~/config/api/links";
import { signUp } from "~/features/auth/sign-up/constants";

export const BackToLogin = React.memo(() => {
	const location = useLocation();
	return (
		<p className="mt-4 text-center text-sm+">
			<span>{signUp.loginText}</span>
			<Link
				to={`${navigateLink.auth.login}${location.search}`}
				className="inline-block text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent underline"
			>
				{signUp.loginLinkText}
			</Link>
		</p>
	);
});
