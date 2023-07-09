import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = (props: any) => {
	return (
		<>
			<CircularProgressbar
				value={props.data}
				text={props.data + "%"}
				styles={buildStyles({
					textColor: "#FFFFFF",
					pathColor: "#FFFFFF",
					trailColor: "rgba(233, 236, 239, 0.5)"
				})}
			/>
		</>
	);
};

export default CircularProgress;
