import { useState, useEffect } from "react";
import { useAppSelector } from "~/config/store";
import { useGetNotificationFlagQuery, useUpdateNotificationFlagMutation } from "~/features/quickstarts/store";

interface IProps {
	UserID?: string;
}

const QuickStartsNotification = ({ UserID }: IProps) => {
	const [toggle, setToggle] = useState(false);
	const [updateNotificationFlag, option] = useUpdateNotificationFlagMutation();
	useGetNotificationFlagQuery(UserID);
	const { NotificationFlag } = useAppSelector((state: any) => state.quickstarts);
	useEffect(() => {
		if (NotificationFlag && NotificationFlag === 1) {
			setToggle(true);
		}
	}, [NotificationFlag]);

	function onClickToggle(): void {
		setToggle(!toggle);
		updateNotificationFlag({
			UserID: UserID,
			Flag: "NewQuickStartsRelease",
			NewQuickstartsReleaseFlag: toggle ? 0 : 1
		}).unwrap();
	}

	const toggleClass = "transform translate-x-5";
	return (
		<>
			<div className="flex justify-between items-center bg-white rounded-lg w-full h-10 p-4">
				<p className="tracking-wide text-sm mr-4">Receive new video release notification</p>
				<button
					className={
						"md:w-10 md:h-5 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer " +
						(!toggle ? "bg-[#cbd5e1]" : "bg-[#1268B3]")
					}
					onClick={() => {
						onClickToggle();
					}}
				>
					<div
						className={
							"bg-white md:w-3 md:h-3 h-3 w-3 rounded-full shadow-md transform duration-300 ease-in-out" +
							(!toggle ? null : toggleClass)
						}
					></div>
				</button>
			</div>
		</>
	);
};

export default QuickStartsNotification;
