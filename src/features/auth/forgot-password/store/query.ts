import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { ForgotPasswordRequest } from "~/features/auth/forgot-password/@types";

export const ForgotPasswordApi = api.injectEndpoints({
	endpoints: builder => ({
		forgotPassword: builder.mutation<{}, ForgotPasswordRequest>({
			query: ({ Email }) => ({
				url: `${endPoints.auth.forgotPassword}/${Email}`
			})
		})
	})
});

export const { useForgotPasswordMutation } = ForgotPasswordApi;
