import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import TranscriptCard from "./TranscriptCard";
import TranscriptHeader from "./TranscriptHeader";

const TranscriptLayout = () => {
	return (
		<Fragment>
			<section className="flex-1 flex flex-col" style={{ width: "calc(100% - var(--main-sidebar-width))" }}>
				<TranscriptHeader />
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</section>
		</Fragment>
	);
};

export default TranscriptLayout;
