import React from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { forgotPassword } from "~/features/auth/forgot-password/constants";
import { navigateLink } from "~/config/api/links";

export const BackToLogin = React.memo(() => {
	const location = useLocation();
	return (
		<Link
			to={`${navigateLink.auth.login}${location.search}`}
			className="no-underline space-x-2 absolute top-20 text-left flex cursor-pointer text-[#00000099]"
		>
			<Icon width={20} icon="mingcute:arrow-left-line" className="fill-current" />
			<span>{forgotPassword.loginText}</span>
		</Link>
	);
});
