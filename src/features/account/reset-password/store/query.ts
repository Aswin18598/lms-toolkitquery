import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const ResetPasswordApi = api.injectEndpoints({
	endpoints: builder => ({
		resetPassword: builder.mutation({
			query: body => ({
				url: endPoints.account.resetPassword,
				method: "POST",
				body
			})
		}),
		verifyEmailLink: builder.mutation({
			query: ({ EmailSessionId }) => ({
				url: `${endPoints.auth.verifyEmailLink}/${EmailSessionId}`
			})
		})
	})
});

export const { useResetPasswordMutation, useVerifyEmailLinkMutation } = ResetPasswordApi;
