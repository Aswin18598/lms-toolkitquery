import React from "react";
import { Icon } from "@iconify/react";
import { Price } from "~/components";
import { dispatch, useAppSelector } from "~/config/store";

import { Cart } from "../@types";
import {
	setQuantity,
	toggleSelectPlan,
	useCartListQuery,
	useRemoveCartItemMutation,
	useTrialValidationMutation
} from "../store";
import classNames from "classnames";

const CartItem = React.memo((props: any) => {
	const { cart, uniqueIndex } = props;
	const { refetch } = useCartListQuery();
	const [removeCartItem, { isLoading }] = useRemoveCartItemMutation();
	const [trailValidate, trail] = useTrialValidationMutation();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const { isDollarCurrency, selectedCart } = useAppSelector((state: any) => state.cartReducer);
	const { TrialUser } = useAppSelector((state: any) => state.headersandmenuReducer);
	//const { incrementCount, decrementCount, count } = cart;
	const incrementCount = (event: any, index: number) => {
		event.stopPropagation();
		const updatedCart = JSON.parse(JSON.stringify(cart));
		const newCartItems = {
			...updatedCart,
			Quantity: cart?.Quantity + 1
		};
		dispatch(setQuantity({ newCartItems, index }));
	};
	const decrementCount = (event: any, index: number) => {
		event.stopPropagation();
		const updatedCart = JSON.parse(JSON.stringify(cart));
		const newCartItems = {
			...updatedCart,
			Quantity: cart.Quantity - 1
		};
		dispatch(setQuantity({ newCartItems, index }));
	};

	const toggleTrail = async (e: any, { CartID, PurchaseType }: any) => {
		await trailValidate({
			CartID,
			IsTrial: +e.target.checked,
			PurchaseType
		}).unwrap();
		refetch();
	};

	const renderLoading = () => (
		<>
			{!isLoading && (
				<button
					onClick={async () => {
						await removeCartItem(cart.CartID).unwrap();
						refetch();
					}}
				>
					<Icon icon="mingcute:close-line" className="w-5 h-5" />
				</button>
			)}
			{isLoading && <Icon width={22} className="animate-spin w-5 h-5" icon="bx:loader-alt" />}
		</>
	);

	return (
		<div
			onClick={() => {
				!isDollarCurrency && dispatch(toggleSelectPlan(cart));
			}}
			//title={cart.Description}
			className={classNames(
				"group cursor-pointer bg-white p-2 rounded-md rounded-md border-2 flex flex-col sm:items-center sm:flex-row justify-between space-x-3",
				{ "bg-info/10 border-primary/40": cart.CartID === selectedCart?.CartID && !isDollarCurrency },
				{ "bg-white border-gray-200 ": cart.CartID !== selectedCart?.CartID }
			)}
		>
			<div className="flex sm:items-center gap-3">
				<div className="relative flex mt-1 sm:m-0">
					<img
						src={`${imageUrl}${cart?.ImagePath}` || "/assets/images/sample_learn.png"}
						className="mask is-star h-11 w-11 origin-center object-cover rounded"
						alt="course"
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = "assets/images/sample_learn.png";
						}}
					/>
				</div>
				<div className="flex flex-col flex-1 gap-1">
					<div className="flex items-center space-x-1">
						<p
							className="flex-1 sm:text-lg font-medium text-slate-700 line-clamp-1 dark:text-navy-100"
							title={cart.Description}
						>
							{cart.Title}
						</p>
						<span className="grid place-center sm:hidden">{renderLoading()}</span>
					</div>
					<span className="sm:hidden">
						<Price
							currenctType={isDollarCurrency ? "USD" : "INR"}
							price={cart[isDollarCurrency ? "Price_USD" : "Price_INR"]}
							usd={cart.Price_USD}
							inr={cart.Price_INR}
						/>
					</span>
					<div className="flex items-center text-xs+ space-x-2">
						<span>{cart.CourseCount} courses</span>
						{cart?.CourseDuration && (
							<>
								<span className="bg-gray-300 w-1.5 h-1.5 rounded-full" />
								<button className="flex items-center gap-1 cursor-text">
									<span>{cart?.CourseDuration}</span>
									<Icon icon="mingcute:down-line" className="w-4 h-4 hidden" />
								</button>
							</>
						)}
						{cart.PurchaseType !== "Plan" && TrialUser.Result !== 1 && (
							<>
								<span className="bg-gray-300 w-1.5 h-1.5 rounded-full" />
								<label className="inline-flex items-center space-x-2">
									<input
										onChange={e => toggleTrail(e, cart)}
										defaultChecked={cart.IsTrial}
										className="form-checkbox is-basic h-3.5 w-3.5 border-slate-400/70 checked:bg-primary checked:border-primary"
										type="checkbox"
									/>
									{trail.isLoading && (
										<Icon width={15} className="animate-spin" icon="bx:loader-alt" />
									)}
									<span className="relative top-[1px] select-none">7 days Trial</span>
								</label>
							</>
						)}
						<span className="bg-gray-300 w-1.5 h-1.5 rounded-full" />
						<label className="inline-flex items-center space-x-2">
							<span className="relative top-[1px] select-none">Quantity</span>
							<button onClick={e => decrementCount(e, uniqueIndex)} disabled={+cart.Quantity == 1}>
								-
							</button>
							<div>{cart?.Quantity}</div>
							<button onClick={e => incrementCount(e, uniqueIndex)}>+</button>
						</label>
					</div>
				</div>
			</div>
			<div className="hidden sm:flex space-x-2 pl-10 pt-1">
				<Price
					currenctType={isDollarCurrency ? "USD" : "INR"}
					price={cart[isDollarCurrency ? "Price_USD" : "Price_INR"]}
					usd={cart.Price_USD}
					inr={cart.Price_INR}
				/>
				{renderLoading()}
			</div>
		</div>
	);
});

export const CartList = React.memo((props: any) => {
	const { incrementCount, decrementCount, count } = props;
	const { cartItems, isDollarCurrency } = useAppSelector((state: any) => state.cartReducer);
	//console.log("cartItems",cartItems)
	return (
		<div className="flex-1 flex flex-col space-y-4 w-full lg:w-3/5 xl:w-2/3">
			{cartItems.map((cart: Cart, index: number) => (
				<CartItem
					key={cart.CartID}
					cart={cart}
					isDollarCurrency={isDollarCurrency}
					incrementCount={incrementCount}
					decrementCount={decrementCount}
					count={count}
					uniqueIndex={index}
				/>
			))}
		</div>
	);
});
