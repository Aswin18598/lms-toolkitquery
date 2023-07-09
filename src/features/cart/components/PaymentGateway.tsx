import React from "react";
import { notify } from "~/helpers";
import { getLoggedUser } from "~/helpers/auth";
import { CardElement, useRecurly } from "@recurly/react-recurly";
import { dispatch, useAppSelector } from "~/config/store";
import {
	changeCurrencyType,
	useCartCheckoutMutation,
	useCartResponseMutation,
	useRecurlyCheckoutMutation
} from "../store";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { Spinner } from "~/components/spinner";
import { useGetCheckTrialUserQuery } from "~/features/headersandmenu/store";

const formfield = [
	{ id: "first_name", key: "FirstName", placeholder: "First name" },
	{ id: "last_name", key: "LastName", placeholder: "Last name" },
	{ id: "postal_code", key: "PostalCode", placeholder: "PostalCode" },
	{ id: "address1", key: "Address1", placeholder: "Address1" },
	{ id: "city", key: "City", placeholder: "City" },
	{ id: "country", key: "Country", placeholder: "Country" },
	{ id: "state", key: "State", placeholder: "State" }
];

type RazorpayOption = RazorpayOptions & { subscription_id?: string; config?: any };

function CardForm() {
	const { shippingDetails } = useAppSelector((state: any) => state.cartReducer);
	return (
		<div className="flex flex-wrap w-full">
			{formfield.map(field => (
				<input
					type="hidden"
					key={field.id}
					data-recurly={field.id}
					placeholder={field.placeholder}
					defaultValue={shippingDetails[field.key]}
					className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent w-1/2"
				/>
			))}
		</div>
	);
}

export function PaymentGateway({ onSuccess, onFailure, count }: any) {
	const Razorpay = useRazorpay();
	const recurly = useRecurly();
	const payPal = recurly.PayPal({
		display: { displayName: "@ViewBag.PlanName" }
	});
	const formRef: any = React.useRef();
	const [paymentMode, SetPaymentMode] = React.useState("card");
	const { shippingDetails, isDollarCurrency, cartItems, couponCode, selectedCart } = useAppSelector(
		(state: any) => state.cartReducer
	);
	const [checkoutResponse, options] = useRecurlyCheckoutMutation();
	const [cartResponse] = useCartResponseMutation();
	const [checkout, checkoutOption] = useCartCheckoutMutation();

	React.useEffect(() => {
		payPal.on("token", async token => {
			await handleRecurlyPayment(token);
		});

		payPal.on("error", error => {
			console.error(error);
		});

		payPal.on("cancel", () => {
			console.info("Cancelled");
		});

		payPal.on("ready", () => {
			console.info("Ready");
		});
		// eslint-disable-next-line
	}, [payPal]);

	const handleRecurlyPayment = async (token: any) => {
		const user = getLoggedUser();
		await checkoutResponse({
			UserId: user.UserId,
			// CartID,
			AccountId: user.AccountId,
			RecurlyToken: token.id,
			Purchase: {
				PlanCode: selectedCart?.SubscriptionID.toString(),
				CurrencyCode: "USD",
				Coupon: couponCode,
				LastFour: "1111",
				Card: "4111111111111111"
			},
			Billing: {
				...shippingDetails,
				Zip: shippingDetails.PostalCode,
				Email: user.Email
			},
			Subscriptions: cartItems
		}).unwrap();
		onSuccess();
	};

	const handleRazorpayPayment = React.useCallback(
		({ data }: any) => {
			const { Data } = data;
			const options: RazorpayOption = {
				key: Data.RazorpayKey,
				amount: Data.Amount,
				currency: Data.Currency,
				name: "TATA Technologies",
				order_id: Data?.OrderID || null,
				subscription_id: Data?.RZP_SubscriptionID,
				prefill: {
					email: Data.Email,
					contact: Data.ContactNumber
				},
				// config: {
				// 	display: {
				// 		// blocks: {
				// 		// 	custome: {
				// 		// 		//name for HDFC block
				// 		// 		name: "Choose Payment Method",
				// 		// 		instruments: [
				// 		// 			{
				// 		// 				method: "card"
				// 		// 			},
				// 		// 			{
				// 		// 				method: "netbanking",
				// 		// 				banks: ["HDFC"]
				// 		// 			},
				// 		// 			{
				// 		// 				method: "upi"
				// 		// 			}
				// 		// 		]
				// 		// 	}
				// 		// },

				// 		// sequence: ["block.custome"],
				// 		preferences: {
				// 			show_default_blocks: true // Should Checkout show its default blocks?
				// 		}
				// 	}
				// },
				handler: async (res: any) => {
					await cartResponse({
						...Data,
						Signature: res.razorpay_signature,
						PaymentID: res.razorpay_payment_id,
						ChargeAt: Data?.DtChargeAt || 0,
						StartAt: Data?.DtStartAt || 0,
						EndAt: Data?.DtEndAt || 0,
						TrialStartAt: Data?.DtTrialStartAt || 0,
						TrialEndAt: Data?.DtTrialEndAt || 0,
						PlanName: Data?.PlanName?.toString() || "",
						Address: shippingDetails.address
					}).unwrap();
					onSuccess();
				}
			};
			const rzpay = new Razorpay(options);
			rzpay.open();
		},
		[Razorpay]
	);

	const handleCheckout = () => {
		const filterData = cartItems.filter((data: any) => data.CartID === selectedCart.CartID);
		const { CartID, PurchaseType, SubscriptionID, PlanCode, IsTrial } = filterData[0];

		if (isDollarCurrency && paymentMode === "paypal") {
			payPal.start();
			return;
		}

		if (isDollarCurrency && paymentMode === "card") {
			recurly.token(formRef.current, async (err, token) => {
				if (err) {
					notify("recurly_error", err);
					return;
				}
				await handleRecurlyPayment(token);
			});
			return;
		}

		checkout({
			IsTrial,
			PlanCode,
			PurchaseType,
			SubscriptionID,
			CartID,
			Quantity: selectedCart.Quantity,
			...shippingDetails,
			Address: shippingDetails.address
		}).then(handleRazorpayPayment);
	};

	return (
		<>
			{isDollarCurrency && (
				<div className="card p-5 sm:px-5 gap-2">
					<ul className="grid gap-6 w-full md:grid-cols-2">
						<li>
							<input
								type="radio"
								id="card"
								name="recurly"
								value="card"
								className="hidden peer"
								onChange={() => SetPaymentMode("card")}
								checked={paymentMode === "card"}
							/>
							<label
								htmlFor="card"
								className="inline-flex items-center justify-center p-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/20"
							>
								<img src="/assets/images/card.png" width="100px" height="60px" alt="card" />
							</label>
						</li>
						<li>
							<input
								type="radio"
								id="paypal"
								name="recurly"
								value="paypal"
								className="hidden peer"
								onChange={() => SetPaymentMode("paypal")}
								checked={paymentMode === "paypal"}
							/>
							<label
								htmlFor="paypal"
								className="inline-flex justify-center items-center p-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/20"
							>
								<img src="/assets/images/paypal.png" width="100px" height="60px" alt="paypal" />
							</label>
						</li>
					</ul>
					{paymentMode === "card" && (
						<form ref={formRef}>
							<CardForm />
							<CardElement />
						</form>
					)}
				</div>
			)}
			<div className="flex space-x-3">
				{/* <select
					value={isDollarCurrency ? "USD" : "INR"}
					onChange={(e: any) => dispatch(changeCurrencyType(e.target.value))}
					className="form-select w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:none dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					<option value="INR">INR</option>
					<option value="USD">USD</option>
				</select>  */}

				<button
					disabled={options.isLoading || checkoutOption.isLoading}
					onClick={() => handleCheckout()}
					className="flex-1 btn text-lg bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
				>
					{options.isLoading || checkoutOption.isLoading ? <Spinner /> : "Proceed to Pay"}
				</button>
			</div>
		</>
	);
}
