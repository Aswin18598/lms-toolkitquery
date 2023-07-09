import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { encryptPassword } from "~/helpers";
import { SingUpRequest, SingUpResponse } from "~/features/auth/sign-up/@types";

export const signUpApi = api.injectEndpoints({
	endpoints: builder => ({
		signUp: builder.mutation<SingUpResponse, SingUpRequest>({
			query: form => ({
				url: endPoints.account.create,
				method: "POST",
				body: {
					FirstName: form.FirstName,
					LastName: form.LastName,
					Email: form.Email,
					Password: encryptPassword(form.CPassword),
					MarketingEmail: form.MarketingEmail ? "Yes" : "No",
					PreferredSoftwareID: 0,
					FavouriteSoftware: 0,
					EmailPref: form.MarketingEmail ? 1 : 0
				}
			})
		}),
		sendOtp: builder.mutation({
			query: body => ({
				url: endPoints.auth.sendOtp,
				method: "POST",
				body
			})
		}),
		verifyOtp: builder.mutation({
			query: body => ({
				url: endPoints.auth.verifyOtp,
				method: "POST",
				body
			})
		})
	})
});

export const { useSignUpMutation, useSendOtpMutation, useVerifyOtpMutation } = signUpApi;
