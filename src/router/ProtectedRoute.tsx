import { Navigate, Outlet } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { getLoggedUser } from "~/helpers/auth";

export const useAuth = () => {
	const user = getLoggedUser();
	const isLoggedIn = user?.SessionId;
	return {
		isLoggedIn: !!isLoggedIn
		// role: user ? JSON.parse(user.Role) : null
	};
};

const ProtectedRoute = () => {
	const { isLoggedIn } = useAuth();
	return isLoggedIn ? <Outlet /> : <Navigate to={navigateLink.auth.login} />;
};

export default ProtectedRoute;
