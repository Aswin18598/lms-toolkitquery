import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "~/config/store";
import { useUserNotificationQuery } from "~/config/api";
import { selectCartItems } from "~/features/cart/store";
import CommonCard from "~/features/headersandmenu/components/CommonCard";
import { useDisMissNotificationMutation, useGetCheckTrialUserQuery } from "~/features/headersandmenu/store";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";
import { navigateLink } from "~/config/api/links";
import HeaderSearch from "~/features/search/components/HeaderSearch";
import ElementPopper from "react-element-popper";
import toast from "react-hot-toast";
import { Modal } from "~/components";
export function Header(props: any) {
	const location = useLocation();
	const user = getLoggedUser();
	useGetCheckTrialUserQuery(user.UserId);
	const cartItems = useAppSelector(selectCartItems);
	const notification = useUserNotificationQuery();
	const [isFavorites, setIsFavorites] = useState(true);
	const [isClose, setIsClose] = useState(true);
	const [handleIcon, setIsHandleIcon] = useState(false);
	const [Notify, setNotify] = useState(false);
	const [isMobileSearchBtnClicked, setIsMobileSearchBtnClicked] = useState(false);
	const navigate = useNavigate();
	const { TrialUser } = useAppSelector((state: any) => state.headersandmenuReducer);
	const date = new Date().getDate();
	const year = new Date().getFullYear();
	const month = new Date().toLocaleString("en-US", { month: "short" });
	const currentDate = `${date} ${month} ${year}`;
	const ref: any = useRef();
	const [ClearNotify] = useDisMissNotificationMutation();

	useEffect(() => {
		function handleClickOutside(e: any) {
			if (ref?.current && !ref?.current?.contains(e.target)) {
				setNotify(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const toggleMonochrome = () => {
		const monochromeClassName = "is-monochrome";
		const hasMonochromeClass = document.body.classList.contains(monochromeClassName);
		if (hasMonochromeClass) {
			document.body.classList.remove(monochromeClassName);
			return;
		}
		document.body.classList.add(monochromeClassName);
	};

	const handleClearNotification = async (ID: any) => {
		const payload = {
			UserID: user.UserId,
			DismissAll: false,
			NotificationID: ID
		};
		const response: any = await ClearNotify(payload);
		toast.success(response?.data.Message);
		notification.refetch();
	};

	const handleClearAllNotification = async () => {
		const payload = {
			UserID: user.UserId,
			DismissAll: true,
			NotificationID: 0
		};
		const response: any = await ClearNotify(payload);
		toast.success(response?.data.Message);
		notification.refetch();
	};

	const NotificationContent = () => {
		return (
			<div id="notification-wrapper" className="flex translate-x-[20%]">
				<div id="notification-box" className="popper-root">
					<div className="notification-tab-wrapper popper-box mx-4 mt-1 flex max-h-[calc(100vh-6rem)] flex-col rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-800 dark:bg-navy-700 dark:shadow-soft-dark sm:m-0">
						<div className="rounded-t-lg bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-navy-200">
							<div className="flex items-center justify-between px-4 pt-2">
								<div className="flex justify-between items-center space-x-2">
									<h3 className="p-3 font-medium text-slate-700 dark:text-navy-100">Notifications</h3>
									{notification?.data?.headersAndMenu_UserNotificationDetails.NotificationsCount >
										0 && (
										<div className="badge h-5 rounded-full bg-primary/10 px-1.5 text-primary dark:bg-accent-light/15 dark:text-accent-light">
											{
												notification?.data?.headersAndMenu_UserNotificationDetails
													.NotificationsCount
											}
										</div>
									)}
								</div>
								{notification?.data?.headersAndMenu_UserNotificationDetails.NotificationsCount > 0 && (
									<span
										title="Close All"
										className="text-slate-400 cursor-pointer"
										onClick={handleClearAllNotification}
									>
										Clear all
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-col overflow-hidden">
							<div
								className="tab-content tab-shift-left is-scrollbar-hidden space-y-4 overflow-y-auto pt-4"
								id="notification-all"
							>
								<div className="flex items-center flex-col gap-4 max-w-[350px]">
									{notification?.data?.headersAndMenu_UserNotificationDetails.Notifications?.length >
									0 ? (
										notification?.data?.headersAndMenu_UserNotificationDetails.Notifications.map(
											(item: any) => (
												<div className="flex px-4 pb-4 border-b-2" title={item.Message}>
													<span className="text-sm+ text-slate-400 line-clamp-3 dark:text-navy-300 cursor-pointer">
														{item.Message}
													</span>
													<span
														title="Close"
														onClick={() => handleClearNotification(item.NotificationID)}
													>
														<Icon
															icon="ic:round-close"
															className="text-slate-400 w-4 h-4 cursor-pointer"
														/>
													</span>
												</div>
											)
										)
									) : (
										<>
											<img
												className="h-40 my-auto"
												src="/assets/images/Tiger_images/tiger-logoutX400.png"
												alt={"empty"}
											/>
											<p className="text-xs+ pb-4 text-[#020A12]/60">{"No notification"}</p>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const hanldeClickMobileSearchIcon = () => {
		if (location?.pathname !== "/search") {
			setIsMobileSearchBtnClicked(true);
		}
	};

	return (
		<>
			{TrialUser?.Result === 1 && isClose && (
				<div
					className="flex items-center justify-center w-full h-10 bg-[#FD6F3C] text-[#FFFFFF] text-sm space-x-2"
					id="trial-user"
				>
					<div className="w-[95%] mr-2 flex justify-center">
						<div className="flex space-x-2">
							<div>{TrialUser?.Message}</div>
							<span
								className="underline cursor-pointer"
								onClick={() => navigate(navigateLink.subscriptions + "?" + 2)}
							>
								Upgrade
							</span>
						</div>
					</div>
					<div className="w-[5%] flex justify-center" onClick={() => setIsClose(!isClose)}>
						<Icon icon="ic:round-close" width="16" height="16" color="#FFFFFF" />
					</div>
				</div>
			)}
			<nav className="shrink-0 z-20 flex h-[61px] w-full border-b border-slate-150 transition-all duration-[.25s] dark:border-navy-700 print:hidden">
				<div className="px-[var(--margin-x)] transition-[padding,width] duration-[.25s] relative flex w-full bg-white dark:bg-navy-750 print:hidden">
					<div className="flex w-full items-center justify-between">
						<button
							title="Toggle Menu"
							onClick={props.handleMenuClick}
							className="menu-toggle flex h-7 w-7 flex-col justify-center space-y-1.5 text-primary outline-none focus:outline-none dark:text-accent-light/80"
						>
							<span />
							<span />
							<span />
						</button>
					</div>
					<div className="flex items-center gap-1">
						<HeaderSearch setIsMobileSearchBtnClicked={() => {}} />
						<div
							title="search"
							className="sm:hidden relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
						>
							<Icon
								icon="mingcute:search-line"
								className="w-5 h-5  ml-1.5 mt-1.5 text-slate-500 dark:text-navy-100"
								onClick={hanldeClickMobileSearchIcon}
							/>
						</div>
						{isMobileSearchBtnClicked ? (
							<section className="w-full z-50 h-full fixed bg-white top-0 left-0 right-0 bottom-0">
								<div className="w-full flex items-center p-4 bg-slate-150">
									<button
										onClick={() => setIsMobileSearchBtnClicked(false)}
										className="btn h-7 w-7 rounded-md p-0 text-primary hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25"
									>
										<Icon icon="mingcute:left-line" className="h-6 w-6" />
									</button>
									<HeaderSearch
										isMobileSearchBtnClicked={isMobileSearchBtnClicked}
										setIsMobileSearchBtnClicked={setIsMobileSearchBtnClicked}
									/>
								</div>
							</section>
						) : null}
						<div title="beta" className="flex items-center space-x-1 w-max font-bold mr-4">
							<span className="text-red-500">BETA</span>
						</div>
						<div title="points" className="flex items-center space-x-1 w-max font-medium">
							<Icon
								icon="mingcute:copper-coin-line"
								className="h-5 w-5 transition-colors duration-200 text-orange-400"
							/>
							<span>{props?.Point || 0} Points</span>
						</div>
						<button className="hidden btn relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
							<Icon
								icon="mingcute:sun-fill"
								color="#FBBF24"
								className="h-6 w-6 text-slate-500 dark:text-navy-100"
							/>
						</button>
						<button
							title="Toggle Monochrome"
							onClick={() => toggleMonochrome()}
							className="btn relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
						>
							<Icon
								icon="mingcute:palette-fill"
								color="#2A79EE"
								className="h-5 w-5 text-slate-500 dark:text-navy-100"
							/>
						</button>
						{!checkIsB2B() && (
							<Link
								title="Cart"
								to="cart"
								className="btn relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
							>
								<Icon
									icon="mingcute:shopping-cart-2-line"
									className="h-5 w-5 text-slate-500 dark:text-navy-100"
								/>
								{cartItems.length > 0 && (
									<div className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-tiny font-medium leading-none text-white dark:bg-accent">
										{cartItems.length}
									</div>
								)}
							</Link>
						)}

						<ElementPopper
							ref={ref}
							offsetX={0}
							offsetY={10}
							active={Notify}
							popper={<NotificationContent />}
							position={"bottom-end"}
							containerClassName="user-profile"
							containerStyle={{ display: "flex" }}
							element={
								<button
									title="Notification"
									className="btn relative h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
									onClick={() => setNotify(!Notify)}
								>
									<Icon
										icon="mingcute:notification-line"
										className="h-5 w-5 text-slate-500 dark:text-navy-100"
									/>
									{notification?.data?.headersAndMenu_UserNotificationDetails.NotificationsCount >
										0 && (
										<span className="absolute -top-px -right-px flex h-3 w-3 items-center justify-center">
											<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f000b9] opacity-80"></span>
											<span className="inline-flex h-2 w-2 rounded-full bg-[#f000b9]"></span>
										</span>
									)}
								</button>
							}
						/>
						<div
							title="Favorite"
							className=" h-8 w-8 rounded-md p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
						>
							<Icon
								icon="mingcute:grid-line"
								className="h-5 w-5 mt-1.5 ml-1.5 text-slate-500 dark:text-navy-100"
								onClick={() => setIsHandleIcon(!handleIcon)}
							/>
						</div>
						{handleIcon && (
							<section className="w-full z-[55] h-screen fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex justify-end items-end">
								<main className="bg-white h-full w-full -right-full sm:w-[30vw] absolute sm:-right-[30vw] rounded-tl-lg rounded-bl-lg animate-[canvas-slide_0.3s_ease-in-out_forwards] overflow-hidden">
									<div className="offcanvas-header flex items-center justify-between p-4">
										<div className="w-full flex">
											{isFavorites ? (
												<div className="w-[50%] flex items-center space-x-2">
													<Icon icon="uil:calender" width="16" height="16" />
													<span className="text-sm">{currentDate}</span>
												</div>
											) : (
												<div className="w-[50%] flex items-center space-x-2">
													<Icon icon="mingcute:grid-line" width="16" height="16" />
													<span className="text-sm">Subscriptions</span>
												</div>
											)}
										</div>
										<button
											type="button"
											className="box-content rounded-none border-none opacity-50 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
											onClick={() => setIsHandleIcon(false)}
										>
											<Icon icon="material-symbols:close-rounded" width="16" height="16" />
										</button>
									</div>

									<div className="offcanvas-body flex-grow pl-4 overflow-y-auto training-height">
										<CommonCard
											isFavorites={isFavorites}
											handleIcon={handleIcon}
											setIsFavorites={setIsFavorites}
										/>
									</div>
								</main>
							</section>
						)}
					</div>
				</div>
			</nav>
		</>
	);
}
