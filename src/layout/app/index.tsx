import { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";

import { useLazyUserMenuQuery, useLazyUserPointsQuery } from "~/config/api";
import { Header, Sidebar, AppFooter } from "~/layout/app/components";
import { useToggle } from "react-use";
import CustomChatBot from "~/features/chatbot/CustomChatbot";
import { navigateLink } from "~/config/api/links";
import ChatbotOverLay from "~/features/chatbot/ChatbotOverLay";
import { useTokenValidationMutation } from "~/features/auth/sso-login/store";

function AppLayout() {
	const navigate = useNavigate();
	const [triggerMenuQuery, { isLoading: userMenuIsLoading, data: menuData }] = useLazyUserMenuQuery();
	const [triggerPointsQuery, { isLoading: userPointsIsLoading, data: pointsData }] = useLazyUserPointsQuery();
	const [on, toggle] = useToggle(false);
	const [show, setShow] = useState(false);
	const [isHideText, setIsHideText] = useState(false);
	const [isValidToken, setIsValidToken] = useState(false);
	const [validateToken] = useTokenValidationMutation();
	useEffect(() => {
		if (
			window.location.href.includes("%3F") ||
			window.location.href.includes("%2F") ||
			window.location.href.includes("%26") ||
			window.location.href.includes("amp;")
		) {
			const actualRedirect = decodeURIComponent(window.location.href).replaceAll("amp;", "");
			window.location.replace(actualRedirect);
		}
		if (window.location.href.includes("dashboard")) {
			window.location.replace(window.location.origin + navigateLink.dashboard);
		}
	}, []);
	useEffect(() => {
		checkTokenIsValid();
	}, []);
	const checkTokenIsValid = () => {
		const token = localStorage.getItem("sessionId");
		validateToken({ TokenId: token })
			.then((response: any) => {
				const validTokenCondition = response?.data?.Message === "Token is valid!";
				setIsValidToken(validTokenCondition);
				if (!validTokenCondition) {
					localStorage.clear();
					navigate(navigateLink.auth.login);
				} else {
					triggerMenuQuery();
					triggerPointsQuery();
				}
			})
			.catch((error: any) => {
				console.error("tokenValidationError", error);
			});
	};

	if (userMenuIsLoading || userPointsIsLoading)
		return (
			<div className="mx-auto my-auto">
				<Spinner />
			</div>
		);

	if (isValidToken)
		return (
			<Fragment>
				<Sidebar handleMenuClick={toggle} isMenuOpen={on} menus={menuData?.Data || []} />
				<section className="flex-1 flex flex-col" style={{ width: "calc(100% - var(--main-sidebar-width))" }}>
					<Header handleMenuClick={toggle} {...pointsData?.Data} />
					<main className="flex-1 overflow-auto">
						<Outlet />
						{show ? (
							<CustomChatBot setShow={setShow} />
						) : (
							<ChatbotOverLay setIsHideText={setIsHideText} isHideText={isHideText} setShow={setShow} />
						)}
					</main>
					<AppFooter />
				</section>
			</Fragment>
		);
	return (
		<div className="mx-auto my-auto">
			<Spinner />
			<h1 className="my-1">Please Wait...</h1>
		</div>
	);
}

export default AppLayout;
