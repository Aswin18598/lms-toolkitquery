import React from "react";
import { Icon } from "@iconify/react";
import { Price } from "~/components";
import { dispatch, useAppSelector } from "~/config/store";
import { removeCouponCode, useApplyCouponCodeMutation } from "../store";
import { Spinner } from "~/components/spinner";

export function ApplyCouponCode({ count }: any) {
	const [applyCoupenCode, option] = useApplyCouponCodeMutation();
	const { cartItems, discountPercentage, isDollarCurrency, couponCode, selectedCart } = useAppSelector(
		(state: any) => state.cartReducer
	);
	const [code, setCode] = React.useState<string>("");
	const calculateDiscountPrice = (price: number) => {
		return (discountPercentage / 100) * price;
	};

	const getTotalPrice = () => {
		let price: any = 0;
		let quantity: any = 0;
		if (isDollarCurrency) {
			price = cartItems
				.reduce((price: any, cart: any) => price + +cart?.Price_USD * cart?.Quantity, 0)
				?.toFixed(2);
		} else {
			price = (+selectedCart?.Price_INR * +selectedCart?.Quantity)?.toFixed(2);
		}
		return price;
	};

	return (
		<div className="card p-4 border border-gray-200 gap-4 flex flex-col">
			{isDollarCurrency && (
				<div className="space-y-3">
					<h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
						Apply Coupon Code
					</h2>
					<div className="relative flex">
						<input
							defaultValue={couponCode}
							onChange={e => setCode(e.target.value)}
							className="form-input peer w-full rounded-l-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:none dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
							placeholder="Enter Coupon Code"
							type="text"
						/>
						<button
							onClick={() => {
								applyCoupenCode({ code });
							}}
							disabled={option.isLoading || !code}
							className="btn rounded-l-none bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60"
						>
							{option.isLoading ? <Spinner size={5} /> : "Apply"}
						</button>
					</div>
				</div>
			)}
			{couponCode && (
				<div className="flex items-center justify-between p-1 bg-[#E6F7E966] rounded-lg">
					<div className="ml-3 text-sm font-medium text-[#4FC666]">{couponCode}</div>
					<button
						onClick={() => {
							setCode("");
							dispatch(removeCouponCode());
						}}
						className="p-1.5 inline-flex h-8 w-8"
						aria-label="Close"
					>
						<Icon icon="mingcute:close-fill" />
					</button>
				</div>
			)}

			<div className="flex items-center space-x-4">
				<p className="flex-1 text-sm truncate">Total Price</p>
				<Price currenctType={isDollarCurrency ? "USD" : "INR"} price={getTotalPrice()} />
			</div>

			{/* <div className="flex items-center space-x-4">
				<p className="flex-1 text-sm truncate">Discount Price</p>
				<Price
					currenctType={isDollarCurrency ? "USD" : "INR"}
					price={calculateDiscountPrice(selectedCart[isDollarCurrency ? "Price_USD" : "Price_INR"])?.toFixed(
						2
					)}
				/>
			</div> */}

			<div className="flex items-center space-x-4">
				<p className="flex-1 text-sm truncate">Summary</p>
				<Price
					currenctType={isDollarCurrency ? "USD" : "INR"}
					price={(
						getTotalPrice() -
						+calculateDiscountPrice(selectedCart[isDollarCurrency ? "Price_USD" : "Price_INR"])
					)?.toFixed(2)}
				/>
			</div>
		</div>
	);
}
