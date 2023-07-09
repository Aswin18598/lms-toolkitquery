import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useState } from "react";

const TrainingRating = ({ id, setSelectedStar, selectedStar, setIsRequiredRate }: any) => {
	const [currRating, setCurrRating] = useState(0);
	const givenRate = (rating: any) => {
		setSelectedStar({ ...selectedStar, [id]: rating });
		setCurrRating(rating);
		setIsRequiredRate(false);
	};

	const nodes = Array.from(Array(5), (_, i) => {
		const starClasses = classNames("w-4 h-4", {
			"text-warning": i <= currRating,
			"text-slate-200": i >= currRating
		});
		return (
			<Icon
				key={`star-${i}`}
				icon="mingcute:star-fill"
				className={starClasses}
				onClick={() => givenRate(i + 1)}
			/>
		);
	});

	return (
		<>
			<div className="flex"> {nodes} </div>
		</>
	);
};

export default TrainingRating;
