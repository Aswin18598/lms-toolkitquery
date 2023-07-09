import React, { useState } from "react";
import { Page } from "~/components";
import { Spinner } from "~/components/spinner";
import { dispatch, useAppSelector } from "~/config/store";
import { MailingAddress, CartList, AgreePrivacyPolicy, EmptyCart, CartSuccess } from "./components";
import { changeCurrencyType, useCartCheckoutMutation, useCartListQuery, useCartResponseMutation } from "./store";
import { CartNotification } from "./components/CartNotification";
import { PaymentGateway } from "./components/PaymentGateway";
import { ApplyCouponCode } from "./components/ApplyCouponCode";
import { RecurlyProvider, Elements } from "@recurly/react-recurly";
import { getLoggedUser } from "~/helpers/auth";
import { useGetCheckTrialUserQuery } from "../headersandmenu/store";

function CartPage() {
	const { isLoading, refetch } = useCartListQuery();
	const user = getLoggedUser();
	const trailUser = useGetCheckTrialUserQuery(user.UserId);
	const [, checkoutOption] = useCartCheckoutMutation();
	const [, checkoutResponseOption] = useCartResponseMutation();
	const [isPaymentSuccess, setIsPaymentSuccess] = React.useState<boolean>(false);
	const { isCartEmpty, isDollarCurrency } = useAppSelector((state: any) => state.cartReducer);

	const [count, setCount] = useState(1);
	const incrementCount = () => {
		if (count < 10) {
			//count = count + 1;
			setCount(count + 1);
			//ReturnCount({count});
		}
	};

	const decrementCount = () => {
		if (count > 1) {
			//count = count - 1;
			setCount(count - 1);
			//ReturnCount({count});
		}
	};

	React.useEffect(() => {
		const user = getLoggedUser();
		dispatch(changeCurrencyType(user.Currency));
	}, []);

	if (isPaymentSuccess) return <CartSuccess />;

	if (isLoading || isCartEmpty) return isLoading ? <Spinner /> : <EmptyCart />;

	return (
		<Page title="Cart">
			{(checkoutOption.isLoading || checkoutResponseOption.isLoading) && <Spinner />}
			{!isDollarCurrency && <CartNotification />}
			<section className="flex flex-col lg:flex-row gap-4 mt-5">
				<CartList incrementCount={incrementCount} decrementCount={decrementCount} count={count} />
				<div className="flex shirnk-0 flex-col gap-4 w-full lg:w-2/5 xl:w-1/4">
					<RecurlyProvider publicKey={import.meta.env.VITE_RECURLY_PUBLIC_KEY}>
						<ApplyCouponCode count={count} />
						<MailingAddress />
						<Elements>
							<PaymentGateway
								count={count}
								onSuccess={() => {
									setIsPaymentSuccess(true);
									refetch();
									trailUser.refetch();
								}}
								onFailure={() => {
									console.error("transaction is failed");
								}}
							/>
						</Elements>
					</RecurlyProvider>
					<AgreePrivacyPolicy />
				</div>
			</section>
		</Page>
	);
}

export default CartPage;
