import { method } from "lodash";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const HeadersandMenuApi = api.injectEndpoints({
	endpoints: builder => ({
		getFavorites: builder.query({
			query: UserID => ({
				url: endPoints.headersandmenu.Favorites.replace(":UserID", UserID)
			})
		}),
		getSubscriptions: builder.query({
			query: UserID => ({
				url: endPoints.headersandmenu.Subscriptions.replace(":UserID", UserID)
			})
		}),
		getCheckTrialUser: builder.query({
			query: UserID => ({
				url: endPoints.headersandmenu.CheckTrialUser.replace(":UserID", UserID)
			})
		}),
		DisMissNotification: builder.mutation({
			query: body => ({
				url: endPoints.headersandmenu.DisMissNotification,
				method: "Post",
				body
			})
		})
	})
});

export const {
	useGetFavoritesQuery,
	useGetSubscriptionsQuery,
	useGetCheckTrialUserQuery,
	useDisMissNotificationMutation
} = HeadersandMenuApi;
