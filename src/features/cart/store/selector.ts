export const selectCartItems = (state: any) => state.cartReducer?.cartItems;
export const selectedCartItem = (state: any) => state.cartReducer?.selectedCart;
export const CartIsEmpty = (state: any) => !state.cartReducer?.cartItems.length;
export const shippingDetails = (state: any) => !state.cartReducer?.shippingDetails;
