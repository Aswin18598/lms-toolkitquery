import { useEffect, useState } from "react";

export const ProgressBar = (props: any) => {
	const [offset, setOffset] = useState(0);
	const { size, progress, strokeWidth, circleOneStroke, circleTwoStroke } = props;

	const center = size / 2;
	const radius = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		const progressOffset = ((100 - progress) / 100) * circumference;
		setOffset(progressOffset);
	}, [setOffset, progress, circumference, offset]);

	return (
		<svg className="svg transform -rotate-90" width={size} height={size}>
			<circle
				fill="none"
				className="svg-circle-bg"
				stroke={circleOneStroke}
				cx={center}
				cy={center}
				r={radius}
				strokeWidth={strokeWidth}
			/>
			<circle
				fill="none"
				className="svg-circle"
				stroke={circleTwoStroke}
				cx={center}
				cy={center}
				r={radius}
				strokeLinecap="round"
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
			/>
			<text
				x={`${center + 3}`}
				y={-`${center - 6}`}
				textAnchor="middle"
				className="transform rotate-90 text-middle font-bold text-sm fill-white"
			>
				{progress}%
			</text>
		</svg>
	);
};
