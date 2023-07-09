import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const CartSuccess = React.memo(() => (
	<main className="w-full flex h-full items-center justify-center">
		<div className="flex items-center flex-col justify-center">
			<Icon icon="mingcute:check-circle-fill" className="hidden w-32 h-32 text-success mx-auto" />
			<img src="/tiger-super.png" alt="" />
			<div className="relative -top-14 flex items-center flex-col justify-center">
				<p className="text-2xl font-semibold text-slate-800 dark:text-navy-50">Payment successful</p>
				{/* <p className="pt-2 text-slate-500 dark:text-navy-200">
					You can download invoice or go to your purchased training
				</p> */}

				<div className="flex gap-4 items-center justify-center mt-8">
					{/* <button className="btn space-x-2 bg-white  border border-slate-300 text-slate-800 hover:bg-white-focus focus:bg-white-focus active:bg-white-focus/90">
						<Icon icon="mingcute:download-2-line" className="w-5 h-5" />
						<span>Download Invoice</span>
					</button> */}
					<Link
						to="/learning"
						className="btn space-x-2 bg-primary font-medium text-white hover:bg-primary/60 focus:bg-primary/60 active:bg-primary/60"
					>
						<span>Start learning</span>
						<Icon icon="mingcute:arrow-right-line" className="w-5 h-5" />
					</Link>
				</div>
			</div>
		</div>
	</main>
));
