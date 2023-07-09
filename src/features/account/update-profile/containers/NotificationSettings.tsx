import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetProfileDataQuery } from "~/features/dashboard/store";
import { getLoggedUser } from "~/helpers/auth";
import { UpdateProfileContent } from "../components";
import { UserUpdateProfileApi, PageName } from "../store";

function NotificationSettings() {
	const { isLoading, data } = UserUpdateProfileApi.useGetProfileQuery(PageName.UserNotification);
	const [updateProfile, option] = UserUpdateProfileApi.useUpdateProfileMutation();
	const { register, handleSubmit, reset, getValues, setValue } = useForm();
	const [IsWeeklyInsights, setIsWeeklyInsights] = useState<boolean>(false);
	const { UserId } = getLoggedUser();
	const { refetch } = useGetProfileDataQuery(UserId);
	const onSubmit = (body: any) => {
		updateProfile({ pageName: PageName.UserNotification, body });
		setTimeout(() => {
			refetch();
		}, 500);
	};

	useEffect(() => {
		if (data?.Data) {
			setIsWeeklyInsights(!data?.Data.IsWeeklyInsights);
			reset(data?.Data);
		}
	}, [data]);

	return (
		<UpdateProfileContent
			onSave={handleSubmit(onSubmit)}
			onCancel={() => reset(data?.Data)}
			title="Notification Settings"
			isLoading={isLoading || option.isLoading}
		>
			<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
				Marketing updates
			</h6>
			<p className="mt-0.5 mb-4 text-sm+">Notifications like marketing emails, newsletters and more</p>
			<div className="mt-5 flex flex-col space-y-4">
				<label className="inline-flex items-center space-x-2">
					<input
						className="form-switch dark:checked:bg-accent h-4 w-7 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:before:bg-white"
						type="checkbox"
						{...register("IsNewsletterNotification")}
					/>
					<span className="select-none">
						Receive our newsletters including course and product information
					</span>
				</label>
				<label className="inline-flex items-center space-x-2">
					<input
						className="form-switch dark:checked:bg-accent h-4 w-7 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:before:bg-white"
						type="checkbox"
						{...register("IsMarketingNotification")}
					/>
					<span className="select-none">Marketing Emails about Tata Technologies Products and Services</span>
				</label>
			</div>
			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
			<h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
				Learning activity
			</h6>
			<p className="mt-0.5 mb-4 text-sm+">Notifications like insights on your weekly, monthly performance</p>

			<div className="flex flex-col mt-5 space-y-5">
				<label className="inline-flex items-center space-x-2">
					<input
						className="form-switch dark:checked:bg-accent h-4 w-7 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:before:bg-white"
						type="checkbox"
						{...register("IsWeeklyInsights")}
						onClick={() => {
							setIsWeeklyInsights(getValues().IsWeeklyInsights);
							setValue(
								"IsWeeklyProfileCompletionNotification",
								!getValues().IsWeeklyInsights
									? getValues().IsWeeklyProfileCompletionNotification
									: false
							);
						}}
					/>
					<span className="select-none">Weekly insights</span>
				</label>
				<label className="inline-flex items-center space-x-2">
					<input
						className="w-5 h-5 rounded-lg border disabled:cursor-not-allowed peer-checked:bg-primary peer-checked:border-primary after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0"
						type="checkbox"
						{...register("IsWeeklyProfileCompletionNotification")}
						onChange={() => {
							setValue(
								"IsWeeklyProfileCompletionNotification",
								!getValues().IsWeeklyProfileCompletionNotification
							);
						}}
						disabled={IsWeeklyInsights}
					/>
					<span className="pl-2 select-none">Profile completion</span>
				</label>
				{/* <div className="hidden flex flex-col gap-2 ">
					<h4>Courses pending notification</h4>
					<div className="flex gap-4">
						<label className="inline-flex items-center space-x-2">
							<input
								type="radio"
								value="D"
								className="form-radio is-basic h-4 w-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
								{...register("PendingCourseNotification")}
							/>
							<span className="select-none">Daily</span>
						</label>
						<label className="inline-flex items-center space-x-2">
							<input
								type="radio"
								value="W"
								className="form-radio is-basic h-4 w-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
								{...register("PendingCourseNotification")}
							/>
							<span className="select-none">Weekly</span>
						</label>
					</div>
				</div> */}
			</div>

			<div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
			{/* <h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
				General Notification
			</h6>
			<p className="mt-0.5 mb-4 text-sm+">Notifications like general settings</p>
			<label className="inline-flex items-center space-x-2">
				<input
					className="form-switch dark:checked:bg-accent h-5 w-7 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:before:bg-white"
					type="checkbox"
					{...register("IsWeeklyProfileCompletionNotification")}
				/>
				<span className="select-none">Profile completion (Weekly)</span>
			</label> */}
		</UpdateProfileContent>
	);
}

export default NotificationSettings;
