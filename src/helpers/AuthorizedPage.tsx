import { Navigate, Outlet } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

export const useAuthorized = () => {
	const B2C = !checkIsB2B();
	return !!B2C;
	// role: user ? JSON.parse(user.Role) : null;
};
export const AuthorizedPage = () => {
	const isAuthorized = useAuthorized();
	return isAuthorized ? <Outlet /> : <Navigate to={navigateLink.dashboard} />;
};
