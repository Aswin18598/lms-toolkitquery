import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";

export const userSubscriptionsApi = api.injectEndpoints({
	endpoints: builder => ({
		getSubscriptionsDetails: builder.query({
			query: UserID => ({
				url: endPoints.Subscriptions.SubscriptionsDetails.replace(":UserID", UserID)
			})
		}),
		getPurchasedHistory: builder.query({
			query: ({ UserID, PageNumber, PageSize }) => ({
				url: endPoints.Subscriptions.PurchasedHistory.replace(":UserID", UserID)
					.replace(":PageNumber", PageNumber)
					.replace(":PageSize", PageSize)
			})
		}),
		getSubscriptionsRecurly: builder.mutation({
			query: body => ({
				url: endPoints.Subscriptions.SubscriptionsRecurly,
				method: "PUT",
				body
			})
		}),
		getAvailableSubscription: builder.query({
			query: ({ CountryCode, CategoryID }) => ({
				url: endPoints.Subscriptions.AvailableSubscription.replace(":CountryCode", CountryCode).replace(
					":CategoryID",
					CategoryID
				)
			})
		}),
		getProfessionalBundle: builder.query({
			query: CountryCode => ({
				url: endPoints.Subscriptions.ProfessionalBundle.replace(":CountryCode", CountryCode)
			})
		}),
		getDownloadInvoice: builder.mutation({
			query: SubscriptionID => ({
				url: endPoints.Subscriptions.DownloadInvoice.replace(":SubscriptionID", SubscriptionID),
				method: "POST"
			})
		}),
		getSubscriptionDetailView: builder.query({
			query: params => ({
				url: generatePath(endPoints.Subscriptions.SubscriptionDetailView, params)
			})
		}),
		getSubscriptionsCourses: builder.query({
			query: params => ({
				url: generatePath(endPoints.skillAdvisor.SubscriptionsCourses, params)
			})
		}),
		getCurrentSubscription: builder.query({
			query: params => ({
				url: generatePath(endPoints.account.AdminDashboard.CurrentSubscription, params)
			})
		}),
		getSubscriptionsAssessments: builder.query({
			query: params => ({
				url: generatePath(endPoints.skillAdvisor.SubscriptionsAssessments, params)
			})
		}),
		CancelSubscription: builder.mutation({
			query: param => ({
				url: endPoints.cart.payment.CancelSubscription,
				method: "POST",
				body: {
					SubscriptionID: param
				}
			})
		}),
		ReactivateSubscription: builder.mutation({
			query: param => ({
				url: endPoints.Subscriptions.ReactivateSubscription,
				method: "POST",
				body: {
					SubscriptionID: param
				}
			})
		})
	})
});

export const {
	useGetSubscriptionsDetailsQuery,
	useGetPurchasedHistoryQuery,
	useGetSubscriptionsRecurlyMutation,
	useGetAvailableSubscriptionQuery,
	useGetProfessionalBundleQuery,
	useGetSubscriptionsCoursesQuery,
	useGetSubscriptionDetailViewQuery,
	useGetSubscriptionsAssessmentsQuery,
	useGetDownloadInvoiceMutation,
	useCancelSubscriptionMutation,
	useReactivateSubscriptionMutation,
	useGetCurrentSubscriptionQuery
} = userSubscriptionsApi;
