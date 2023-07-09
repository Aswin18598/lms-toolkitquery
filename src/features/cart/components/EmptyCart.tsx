import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const EmptyCart = React.memo(() => (
	<section className="flex flex-col h-full items-center justify-center max-w-sm mx-auto">
		<Icon icon="pajamas:warning-solid" className="hidden text-red-500 mb-3" fontSize={90} />
		<img src="/tiger-thinking-1.png" alt="" width={300} />
		<h1 className="text-[#25313D] text-lg font-semibold mb-3">Your cart is empty</h1>
		<p className="hidden text-[#020A1299] my-2 text-center">
			Please check your payment details / internet connection and try again
		</p>
		<Link
			to="/subscriptions?2"
			className="hover:(bg-gray-50) rounded text-[#020A1299] border bg-white py-1 px-3 font-medium font-sm flex justify-center items-center gap-2"
		>
			<span>Go to Available Subscription</span>
			<Icon icon="heroicons-solid:arrow-narrow-right" fontSize={20} />
		</Link>
	</section>
));
