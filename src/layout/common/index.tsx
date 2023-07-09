import classNames from "classnames";
import { PropsWithChildren } from "react";
import Header from "./Header";

function CommonLayout(props: PropsWithChildren<{ overflow?: boolean; title?: string }>) {
	return (
		<div className="w-full h-full flex flex-col">
			<Header title={props.title} />
			<section
				className={classNames("flex-1 flex flex-col lg:flex-row w-full h-full md:pb-10 overflow-auto", {
					// "overflow-hidden": !props.overflow,
					// "overflow-auto": props.overflow
				})}
			>
				{props.children}
			</section>
			<nav className="hidden md:flex fixed inset-x-0 bottom-0 items-center justify-between px-4 py-2 bg-white">
				<img src="/tata-tech.png" alt="" className="h-6" />
				<span className="text-sm">© 2023 Tata Technologies. All rights reserved.</span>
				<img src="/tata-logo.png" alt="" className="h-4" />
			</nav>
		</div>
	);
}

export default CommonLayout;
