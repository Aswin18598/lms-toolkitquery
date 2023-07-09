import { endPoints } from "./endPoints";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { getLoggedUser } from "~/helpers/auth";

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
	baseUrl: endPoints.baseUrl,
	prepareHeaders: headers => {
		// By default, if we have a token in the store, let's use that for authenticated requests
		const token = localStorage.getItem("sessionId");
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	}
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */

export const api = createApi({
	reducerPath: "LmsApi",
	baseQuery: baseQueryWithRetry,
	refetchOnMountOrArgChange: true,
	/**
	 * Tag types must be defined in the original API definition
	 * for any tags that would be provided by injected endpoints
	 */
	tagTypes: [],
	/**
	 * This api has endpoints injected in adjacent files,
	 * which is why no endpoints are shown below.
	 * If you want all endpoints defined in the same file, they could be included here instead
	 */
	endpoints: builder => {
		return {
			userLocation: builder.query<any, void>({
				query: () => `${endPoints.common.location}`,
				transformResponse: (response: any) => {
					localStorage.setItem("location", response?.Data?.CountryCode);
					return response.Data;
				}
			}),
			userMenu: builder.query<any, void>({
				query: () => {
					const user = getLoggedUser();
					return { url: `${endPoints.common.menu}/${user.UserId}` };
				}
			}),
			userPoints: builder.query<any, void>({
				query: () => {
					const user = getLoggedUser();
					return { url: `${endPoints.common.points}/${user.UserId}` };
				}
			}),
			userNotification: builder.query<any, void>({
				query: () => {
					const user = getLoggedUser();
					return { url: `${endPoints.common.nofitication}/${user.UserId}` };
				},
				transformResponse: (response: any) => response.Data
			}),
			userIsSubscribed: builder.query<any, void>({
				query: () => {
					const user = getLoggedUser();
					return { url: `${endPoints.common.subscription}/${user.UserId}` };
				},
				transformResponse: (response: any) => {
					return response?.Data && response?.Data?.length !== 0 ? true : false;
				}
			})
		};
	}
});

export const {
	useUserLocationQuery,
	// useUserMenuQuery,
	useLazyUserMenuQuery,
	// useUserPointsQuery,
	useLazyUserPointsQuery,
	useUserNotificationQuery,
	useUserIsSubscribedQuery
} = api;
