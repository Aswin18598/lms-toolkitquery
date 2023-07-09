import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { loginAction, useUserLogoutMutation } from "~/features/auth/login/store";
import { getLoggedUser } from "~/helpers/auth";

const SessionLogoutPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [logout] = useUserLogoutMutation();

	useEffect(() => {
		(async () => {
			const { SessionId } = getLoggedUser();
			if (SessionId) {
				await logout({ SessionId })
					.unwrap()
					.then((response: any) => {
						console.log(response, "response");

						dispatch(loginAction.logout());
						localStorage.clear();
						navigate(navigateLink.Sessionexpired, { replace: true });
					});
			}
		})();
	}, []);
	return (
		<div className="flex justify-center w-full items-center flex-col gap-6">
			<img src="assets\images\Tiger_images\tiger-logoutX400.png" alt="session_expired" className="h-1/4 w-fit" />
			<img src="/logo.png" alt="logo" className="w-1/12" />
			<h1 className="text-3xl text-center font-semibold text-slate-700 dark:text-navy-100">
				Your Login Session Expired
			</h1>
			<h1 className="text-2xl text-center font-normal text-slate-700">
				Your login session has expired or you have logged in somewhere else, <br />
				<button className="text-primary font-medium" onClick={() => navigate(navigateLink.auth.login)}>
					Click  here
				</button>{" "}
				to login I GET IT 2.0
			</h1>
		</div>
	);
};

export default SessionLogoutPage;
