import React from "react";

const TranscriptHeader = () => {
	return (
		<nav className="shrink-0 z-20 flex h-[41px] w-full border-b border-slate-150 transition-all duration-[.25s] dark:border-navy-700 print:hidden">
			<div className="px-[var(--margin-x)] transition-[padding,width] duration-[.25s] relative flex w-full bg-[#F2F8FF] items-center justify-between dark:bg-navy-750 print:hidden">
				<img src="/assets/images/tata.svg" alt="tata" />
				<img src="/assets/images/tatalogo.svg" alt="logo" />
			</div>
		</nav>
	);
};

export default TranscriptHeader;
