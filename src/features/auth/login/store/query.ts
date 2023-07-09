import { api } from "~/config/api";
import { encryptPassword } from "~/helpers";
import { endPoints, LoginType } from "~/config/api/endPoints";
import { LoginRequest, UserResponse } from "~/features/auth/login/@types";

export const LoginApi = api.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<UserResponse, LoginRequest>({
			query: ({ Email, EncPassword }) => ({
				url: endPoints.auth.login,
				method: "POST",
				body: {
					UserName: Email,
					EncPassword: encryptPassword(EncPassword),
					LoginType: LoginType.basic
				}
			})
		}),
		userLogout: builder.mutation({
			query: body => ({
				url: endPoints.auth.logout,
				method: "POST",
				body
			})
		})
	})
});

export const { useLoginMutation, useUserLogoutMutation } = LoginApi;
