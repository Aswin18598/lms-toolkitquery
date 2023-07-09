import { Tab, Tabs } from "@mui/material";
import React from "react";
interface IAssignableItemsTabs {
	assignableItemsTabs: string[];
	selectedTab: string;
	setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}
function AssignableItemsTabs(props: IAssignableItemsTabs) {
	const { assignableItemsTabs, selectedTab, setSelectedTab } = props;
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue);
	};
	return (
		<Tabs value={selectedTab} onChange={handleChange} variant="scrollable">
			{assignableItemsTabs.map((t, i) => (
				<Tab
					value={t}
					label={t}
					key={i}
					sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
					disableRipple
				/>
			))}
		</Tabs>
	);
}

export default AssignableItemsTabs;
