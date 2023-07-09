import React, { PropsWithChildren } from "react";

interface ITabPanelProps {
	selectedTab: string;
	value: string;
}

function TabPanel(props: PropsWithChildren<ITabPanelProps>) {
	const { children, value, selectedTab, ...other } = props;

	return value === selectedTab ? <> {children}</> : null;
}
export default TabPanel;
