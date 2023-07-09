import { LinkedInCallback } from "react-linkedin-login-oauth2";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import * as Auth from "~/features/auth";
import CartPage from "~/features/cart";
import { PageNotFound } from "~/components";
import { AppLayout, AuthLayout } from "~/layout";
import DashboardPage from "~/features/dashboard";
import LearningPage from "~/features/learning";
import { ResetPassword } from "~/features/account";
import ProtectedRoute from "~/router/ProtectedRoute";
import * as UpdateProfile from "~/features/account/update-profile";
import QuickstartsPage from "~/features/quickstarts";
import TechTipsPage from "~/features/techtips";
import * as Training from "~/features/training";
import Subscriptions from "~/features/Subscriptions";
import Transcript from "~/features/Transcript";
import * as AccountManagement from "~/features/account/management";
import SkillAdvisorPage from "~/features/skill-advisor";
import TranscriptDetails from "~/features/Transcript/components/TranscriptDetails";
import TranscriptLayout from "~/features/Transcript/components/TranscripLayout";
import * as Catalog from "~/features/catalog";
import { useUserLocationQuery } from "~/config/api";
import SearchPage from "~/features/search";
import * as AuthorManagment from "~/features/author";
import RedirectingPage from "~/components/RedirectingPage";
import { AuthorizedPage } from "../helpers/AuthorizedPage";
import SessionLogoutPage from "~/components/SessionLogoutPage";

function AppRouter() {
	useUserLocationQuery();
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ProtectedRoute />}>
						<Route path="/" element={<AppLayout />}>
							<Route path="/" element={<AuthorizedPage />}>
								<Route path="cart" element={<CartPage />} />
								<Route path="subscriptions" element={<Subscriptions />} />
							</Route>
							<Route index element={<DashboardPage />} />
							{/* <Route path="role" element={<RoleDashboard />} /> */}
							<Route path="search" element={<SearchPage />} />
							<Route path="learning" element={<LearningPage />} />
							<Route path="objectives" element={<PageNotFound isConstruction />} />
							<Route path="tech-tips" element={<TechTipsPage />} />
							<Route path="training" element={<Training.Layout />}>
								<Route index element={<Training.InstructionTraining />} />
								<Route path="report" element={<Training.TrainingReports />} />
							</Route>
							<Route path="quick-start" element={<QuickstartsPage />} />
							<Route path="reports" element={<PageNotFound isConstruction />} />
							<Route path="transcript" element={<Transcript />} />
							<Route path="account">
								<Route path="update" element={<UpdateProfile.Layout />}>
									<Route path="personal" element={<UpdateProfile.PersonalProfile />} />
									<Route path="business" element={<UpdateProfile.BusinessProfile />} />
									<Route path="role-and-skill" element={<UpdateProfile.RoleAndSkillMapping />} />
									<Route path="privacy-and-security" element={<UpdateProfile.PrivacyAndSecurity />} />
									<Route path="account-sttings" element={<UpdateProfile.AccountSettings />} />
									<Route
										path="notification-settings"
										element={<UpdateProfile.NotificationSettings />}
									/>
								</Route>
								<Route path="assigned-learning" element={<AccountManagement.NewAssignedLearning />} />
								<Route
									path="assigned-learning/edit/:PathID"
									element={<AccountManagement.EditAssignedLearning />}
								/>
								<Route path="management" element={<AccountManagement.Layout />}>
									<Route index element={<AccountManagement.Dashboard />} />
									<Route path="learning-path" element={<AccountManagement.LearningPath />} />
									<Route path="roles" element={<AccountManagement.Roles />} />
									<Route path="competency" element={<AccountManagement.Competency />} />
									<Route path="role-structure" element={<AccountManagement.RoleStructure />} />
									<Route
										path="role-structure-create"
										element={<AccountManagement.RoleStructureCreate />}
									/>
								</Route>
							</Route>
							<Route path="author">
								<Route path="management" element={<AuthorManagment.Layout />}>
									<Route index element={<AuthorManagment.Dashboard />} />
									<Route path="course-detail-report" element={<AuthorManagment.CourseDetail />} />
								</Route>
							</Route>
							<Route path="*" element={<PageNotFound />} />
						</Route>
						<Route path="auth">
							<Route path="logout" element={<Auth.AppLogout />} />
						</Route>
					</Route>
					<Route path="/" element={<TranscriptLayout />}>
						<Route path="transcriptDetails/:id" element={<TranscriptDetails />} />
						<Route path="transcriptDetails" element={<TranscriptDetails />} />
					</Route>
					<Route path="auth" element={<AuthLayout />}>
						<Route index element={<Navigate to="/auth/login" />} />
						<Route path="login" element={<Auth.LoginPage />} />
						<Route path="signup" element={<Auth.SignUpPage />} />
						<Route path="forgot-password" element={<Auth.ForgotPasswordPage />} />
						<Route path="sso-login" element={<Auth.SsoLoginPage />} />
						<Route path="authorize" element={<Auth.SsoLoginAuthorize />} />
						<Route path="logout" element={<Auth.AppLogout />} />
					</Route>
					<Route path="auth/sso-login/:AccountID" element={<RedirectingPage />} />
					<Route path="linkedin" element={<LinkedInCallback />} />
					<Route path="account">
						<Route path="reset-password" element={<ResetPassword />} />
					</Route>
					<Route path="skill-advisor" element={<SkillAdvisorPage />} />
					<Route
						path="catalog"
						element={
							<Catalog.Layout title="Course Catalog">
								<Outlet />
							</Catalog.Layout>
						}
					>
						<Route index element={<Catalog.LibraryPage />} />
						<Route path="course" element={<Catalog.CatalogPage />} />
						<Route path="course/:catalogId" element={<Catalog.DetailsPage />} />
					</Route>
					<Route path="/sessionexpired" element={<SessionLogoutPage />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default AppRouter;
