import { Icon } from "@iconify/react";
import classNames from "classnames";

export const Ratings = ({ rating = 0 }: { rating?: number }) => {
	const nodes = Array.from(Array(5), (_, i) => {
		const starClasses = classNames("w-4 h-4", {
			"text-warning": i < rating,
			"text-slate-200": i >= rating
		});
		return <Icon key={`star-${i}`} icon="mingcute:star-fill" className={starClasses} />;
	});
	return <div className="flex items-center">{nodes}</div>;
};
