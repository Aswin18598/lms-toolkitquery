import React from "react";

interface ICountdown {
	hours: number;
	minutes: number;
	seconds: number;
}

const CountDownTimer = ({ hours = 0, minutes = 0, seconds = 30, onTimeUp }: ICountdown & { onTimeUp?: () => void }) => {
	const [time, setTime] = React.useState<ICountdown>({ hours, minutes, seconds });

	const tick = () => {
		if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
			reset();
			onTimeUp && onTimeUp();
		} else if (time.hours === 0 && time.seconds === 0) {
			setTime({ hours: time.hours - 1, minutes: 59, seconds: 59 });
		} else if (time.seconds === 0) {
			setTime({ hours: time.hours, minutes: time.minutes - 1, seconds: 59 });
		} else {
			setTime({ hours: time.hours, minutes: time.minutes, seconds: time.seconds - 1 });
		}
	};

	const reset = () => setTime({ hours: time.hours, minutes: time.minutes, seconds: time.seconds });

	React.useEffect(() => {
		const timerId = setInterval(() => tick(), 1000);
		return () => clearInterval(timerId);
	});

	React.useEffect(() => {
		setTime({ hours, minutes, seconds });
	}, [hours, minutes, seconds]);

	// if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) return null;
	return (
		<time className="text-[#00000099]">
			{time.minutes.toString().padStart(2, "0")}:{time.seconds.toString().padStart(2, "0")}
		</time>
	);
};

export default CountDownTimer;
