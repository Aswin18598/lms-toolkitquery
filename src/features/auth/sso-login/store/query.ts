import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const DomainApi = api.injectEndpoints({
	endpoints: builder => ({
		ssoRequest: builder.mutation({
			query: params => ({
				url: endPoints.auth.ssoRequest,
				params
			})
		}),
		SSORequestByAccountID: builder.mutation({
			query: body => ({
				url: endPoints.auth.SSORequestByAccountID,
				method: "POST",
				body
			})
		}),
		tokenValidation: builder.mutation({
			query: body => ({
				url: endPoints.auth.TokenValidation,
				method: "POST",
				body
			})
		})
	})
});

export const { useSsoRequestMutation, useSSORequestByAccountIDMutation, useTokenValidationMutation } = DomainApi;
