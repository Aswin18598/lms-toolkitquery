import { toast } from "react-hot-toast";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

import { CartApi } from "./query";
import { notify } from "~/helpers";
import { addRootReducer } from "~/config/store/reducers";

const {
	cartList,
	cartCheckout,
	cartResponse,
	addToCart,
	removeCartItem,
	shippingAddress,
	recurlyCheckout,
	applyCouponCode,
	countryList,
	trialValidation
} = CartApi.endpoints;

const rejectedMatches = isAnyOf(
	cartList.matchRejected,
	shippingAddress.matchRejected,
	cartCheckout.matchRejected,
	cartResponse.matchRejected,
	addToCart.matchRejected,
	removeCartItem.matchRejected,
	recurlyCheckout.matchRejected,
	applyCouponCode.matchRejected,
	countryList.matchRejected,
	trialValidation.matchRejected
);
interface IintialState {
	cartItems: any[];
	selectPlanIsOpen: boolean;
	selectedCart: any;
	selectedPlan: undefined;
	isCartEmpty: boolean;
	isDollarCurrency: boolean;
	couponCode: undefined;
	discountPercentage: number;
	shippingDetails: {
		name: string;
		address: string;
		Address1: string;
		Address2: string;
		City: string;
		State: string;
		Country: string;
		PostalCode: string;
	};
}
const initialState: IintialState = {
	selectPlanIsOpen: false,
	selectedCart: {},
	selectedPlan: undefined,
	cartItems: [],
	isCartEmpty: true,
	isDollarCurrency: false,
	couponCode: undefined,
	discountPercentage: 0,
	shippingDetails: {
		name: "",
		address: "",
		Address1: "",
		Address2: "",
		City: "",
		State: "",
		Country: "",
		PostalCode: ""
	}
};

const formatAddress = (Data: any) =>
	`${Data.Address1},${Data.Address2},${Data.City},${Data.State},${Data.Country} ${Data.PostalCode}`;

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		removeCouponCode: (state, action: PayloadAction) => {
			state.couponCode = undefined;
			state.discountPercentage = 0;
		},
		changeCurrencyType: (state, action: PayloadAction<string>) => {
			state.isDollarCurrency = action.payload === "USD";
			if (action.payload !== "USD") {
				state.couponCode = undefined;
				state.discountPercentage = 0;
			}
		},
		updateMailingAddress: (state, action: PayloadAction<any>) => {
			state.shippingDetails = {
				...state.shippingDetails,
				address: formatAddress(action.payload),
				...action.payload
			};
		},
		toggleSelectPlan: (state, { payload }: PayloadAction<any>) => {
			state.selectedCart = payload;
			// state.selectPlanIsOpen = !state.selectPlanIsOpen;
		},
		selectPlan: (state, action: PayloadAction<any>) => {},

		setQuantity: (state, { type, payload }: PayloadAction<any>) => {
			const { index, newCartItems } = payload;
			state.cartItems[index] = newCartItems;
			console.log("newCartItems", newCartItems);
			// cartSlice.actions.toggleSelectPlan(newCartItems)
			state.selectedCart = {
				...state.selectedCart,
				Quantity: newCartItems.Quantity
			};
		}
	},
	extraReducers(builder) {
		builder
			.addMatcher(applyCouponCode.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.couponCode = Data.Code;
				state.discountPercentage = Data?.Discount?.Percent;
			})
			.addMatcher(cartList.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.isCartEmpty = !Data?.length;
				state.isCartEmpty = !Data?.length;
				state.cartItems = Data || [];
				state.selectedCart = Data?.[0] || {};
			})
			.addMatcher(shippingAddress.matchFulfilled, (state, action: any) => {
				const { Data } = action.payload;
				state.shippingDetails = {
					name: `${Data.FirstName} ${Data.LastName}`,
					address: formatAddress(Data),
					...Data
				};
			})
			.addMatcher(
				isAnyOf(addToCart.matchFulfilled, removeCartItem.matchFulfilled, trialValidation.matchFulfilled),
				(state, action: any) => {
					const { Message } = action.payload;
					toast.success(Message, { id: "cart_error_message" });
				}
			)
			.addMatcher(isAnyOf(recurlyCheckout.matchFulfilled, cartResponse.matchFulfilled), (state, action: any) => {
				state.couponCode = undefined;
				state.discountPercentage = 0;
			})
			.addMatcher(rejectedMatches, (state, action: any) => {
				const payload = action.payload;
				if (payload?.data) notify("cart_error_message", payload?.data);
			});
	}
});

export const { changeCurrencyType, updateMailingAddress, removeCouponCode, toggleSelectPlan, selectPlan, setQuantity } =
	cartSlice.actions;
const cartReducer = { cartReducer: cartSlice.reducer };

addRootReducer(cartReducer);
