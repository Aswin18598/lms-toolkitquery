import classNames from "classnames";
import React, { PropsWithChildren } from "react";

export interface IPage {
	title?: string;
	harizontal?: boolean;
	pt?: boolean;
	center?: boolean;
	noPadding?: boolean;
	isBr?: boolean;
}
function Page(props: PropsWithChildren<IPage>) {
	const { title, children, harizontal = true, pt = false, isBr = true, center, noPadding } = props;
	const wrapper = classNames("main w-full h-full flex", {
		"flex-col": harizontal,
		"items-center justify-center": center,
		"pt-4 sm:pt-8": pt,
		"p-0": noPadding,
		"px-[var(--margin-x)] sm:px-8": !noPadding
	});
	return (
		<section id={title} className={wrapper}>
			{title && (
				<div className="flex items-center space-x-4 py-4 md:py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">{title}</h2>
				</div>
			)}
			{children}
			{isBr && <br />}
		</section>
	);
}

export default React.memo(Page);
