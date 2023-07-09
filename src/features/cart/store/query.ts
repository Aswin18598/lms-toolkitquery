import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export interface Cart {
	id: number;
	name: string;
	fetched_at: string;
}

type CartResponse = Cart[];

export const CartApi = api.injectEndpoints({
	endpoints: builder => ({
		cartList: builder.query<CartResponse, void>({
			query: () => {
				const user = getLoggedUser();
				return { url: `${endPoints.cart.list}/${user.UserId}` };
			}
		}),
		shippingAddress: builder.query<any, void>({
			query: () => {
				const user = getLoggedUser();
				return { url: `${endPoints.cart.shippingAddress.replace("{UserID}", user.UserId)}` };
			}
		}),
		addToCart: builder.mutation({
			query: form => {
				const user = getLoggedUser();
				return {
					url: endPoints.cart.addToCart,
					method: "POST",
					body: {
						UserID: user.UserId,
						AccountID: user.AccountId,
						SubscriptionID: form.subscriptionId,
						PurchaseType: form.PurchaseType || "Yearly",
						...form
					}
				};
			}
		}),
		removeCartItem: builder.mutation({
			query: (CartID): any => {
				const user = getLoggedUser();
				return {
					url: endPoints.cart.removeCartItem,
					method: "DELETE",
					body: {
						UserID: user.UserId,
						CartID
					}
				};
			}
		}),
		cartCheckout: builder.mutation({
			query: body => {
				const user = getLoggedUser();
				return {
					url: endPoints.cart.payment.checkout,
					method: "POST",
					body: {
						UserID: Number(user.UserId),
						AccountID: Number(user.AccountId),
						FirstName: user.FirstName,
						MiddleName: "",
						LastName: user.LastName,
						Email: user.Email,
						// ContactNumber: user?.ContactNumber || "asda",
						// Address: user?.Address || "asd",
						Quantity: body.Quantity,
						NoOfUsers: 1,
						PromoCode: "",
						TotalCount: 12,
						...body
					}
				};
			}
		}),
		cartResponse: builder.mutation({
			query: body => ({ url: endPoints.cart.payment.response, method: "POST", body })
		}),
		recurlyCheckout: builder.mutation({
			query: body => {
				return { url: endPoints.cart.payment.recurly, method: "POST", body };
			}
		}),
		applyCouponCode: builder.mutation({
			query: params => ({ url: endPoints.cart.payment.applyCoupon, params })
		}),
		countryList: builder.query<any, void>({
			query: () => ({ url: endPoints.cart.countryDropdown })
		}),
		selectPlan: builder.query<any, any>({
			query: params => ({
				url: generatePath(endPoints.cart.plan, params)
			})
		}),
		trialValidation: builder.mutation({
			query: (body): any => {
				const user = getLoggedUser();
				return {
					url: endPoints.cart.trialValidation,
					method: "POST",
					body: {
						UserID: user.UserId,
						...body
					}
				};
			}
		}),
		updateAddress: builder.mutation({
			query: (body): any => {
				const user = getLoggedUser();
				return {
					url: endPoints.common.UpdateAddress,
					method: "PUT",
					body: {
						UserID: user.UserId,
						ShipAddress1: body.Address1,
						ShipAddress2: body.Address2,
						ShipCity: body.City,
						ShipState: body.State?.Name || body?.State,
						ShipPostalCode: body.PostalCode,
						ShipCountry: body.Country.CountryCode
					}
				};
			}
		})
	})
});

export const {
	useCartListQuery,
	useShippingAddressQuery,
	useCartCheckoutMutation,
	useCartResponseMutation,
	useAddToCartMutation,
	useRemoveCartItemMutation,
	useRecurlyCheckoutMutation,
	useApplyCouponCodeMutation,
	useCountryListQuery,
	useSelectPlanQuery,
	useTrialValidationMutation,
	useUpdateAddressMutation
} = CartApi;
