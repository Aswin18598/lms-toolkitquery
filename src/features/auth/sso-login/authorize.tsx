import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { login } from "~/helpers/auth";
import { navigateLink } from "~/config/api/links";
import { useTokenValidationMutation } from "~/features/auth/sso-login/store";

function SsoLoginAuthorize() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [validateToken, { isLoading, isError }] = useTokenValidationMutation();
	const isSuccess = searchParams.get("status") === "success";

	useEffect(() => {
		const TokenId = searchParams.get("token");
		if (TokenId) {
			validateToken({ TokenId })
				.unwrap()
				.then(() => {
					login(TokenId);
					window.location.replace(window.location.origin + navigateLink.dashboard);
					// navigate(navigateLink.dashboard, { replace: true });
				});
		}
		// else navigate(navigateLink.auth.login, { replace: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div className="animate-opacity flex flex-col items-center justify-center w-full h-full gap-3">
			{(isSuccess || isLoading) && !isError && (
				<div className="flex flex-col items-center text-sm transition ease-in-out duration-150 space-y-2">
					<Icon icon="gg:spinner" className="animate-spin -ml-1 mr-3 h-10 w-10" />
				</div>
			)}
			{(!isSuccess || isError) && !isLoading && (
				<>
					<span className="text-lg text-red-500">
						{searchParams.get("message") || "Something went wrong"}
					</span>
					<Link
						replace
						to={navigateLink.auth.login}
						className="btn w-64 w-full h-12 bg-primary font-medium text-white text-lg"
					>
						Click here to login
					</Link>
				</>
			)}
		</div>
	);
}

export default SsoLoginAuthorize;
