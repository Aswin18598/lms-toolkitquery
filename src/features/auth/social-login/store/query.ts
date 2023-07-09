import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const SocialLoginApi = api.injectEndpoints({
	endpoints: builder => ({
		linkedIn: builder.mutation({
			query: ({ code }) => ({
				url: endPoints.auth.linkedInLogin,
				method: "POST",
				body: { code }
			})
		}),
		socialLogin: builder.mutation({
			query: body => ({
				url: endPoints.auth.socialLogin,
				method: "POST",
				body
			})
		})
	})
});

export const { useLinkedInMutation, useSocialLoginMutation } = SocialLoginApi;
