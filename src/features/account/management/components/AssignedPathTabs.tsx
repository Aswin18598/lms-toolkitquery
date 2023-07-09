import { Tab, Tabs } from "@mui/material";
interface IAssignedPathTabsProps {
	selectedTab: string;
	renderTabValue: string;
}
function AssignedPathTabs(props: IAssignedPathTabsProps) {
	const { selectedTab, renderTabValue } = props;

	return (
		<Tabs value={selectedTab} variant="scrollable" scrollButtons={false}>
			<Tab
				value={renderTabValue}
				disabled
				label={"Courses, Assessments & Aggregations"}
				sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
				disableRipple
			/>
			{/* <Tab
				value={"Aggregations"}
				disabled
				label={"Aggregations"}
				sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
				disableRipple
			/> */}
			<Tab
				value={"Users"}
				disabled
				label={"Users"}
				sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
				disableRipple
			/>
			<Tab
				value={"Groups"}
				disabled
				label={"Groups"}
				sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
				disableRipple
			/>
			<Tab
				value={"Conditional"}
				disabled
				label={"Conditional Users"}
				sx={{ textTransform: "capitalize", fontWeight: "bold", py: 0 }}
				disableRipple
			/>
		</Tabs>
	);
}

export default AssignedPathTabs;
