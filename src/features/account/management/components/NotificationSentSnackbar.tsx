import React, { useEffect } from "react";

interface INotificationSentSnackbarProps {
	isNotificationSent: boolean;
	setIsNotificationSent: React.Dispatch<React.SetStateAction<boolean>>;
}
function NotificationSentSnackbar(props: INotificationSentSnackbarProps) {
	const { isNotificationSent, setIsNotificationSent } = props;
	useEffect(() => {
		if (isNotificationSent) {
			var timeout = setTimeout(() => {
				setIsNotificationSent(false);
			}, 3000);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [isNotificationSent]);
	return (
		<div className="w-[90vw] sm:m-0 mx-auto h-auto p-4 rounded-md bg-black absolute right-8 bottom-0 animate-[slide-up_0.5s_ease-in-out_forwards] sm:w-[60vw] md:w-[30vw] lg:w-[25vw]">
			<h5 className="text-white my-1">Notification Sent</h5>
			<p className="text-white text-sm my-2">Email has been sent to all the assigned users and groups</p>
			<span className="text-primary underline my-1 cursor-pointer" onClick={() => setIsNotificationSent(false)}>
				Ok,thanks
			</span>
		</div>
	);
}

export default NotificationSentSnackbar;
