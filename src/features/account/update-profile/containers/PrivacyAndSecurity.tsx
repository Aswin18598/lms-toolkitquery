import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { navigateLink } from "~/config/api/links";
import { passwordUpdateSchema } from "~/features/auth/sign-up/validation";
import { useGetProfileDataQuery } from "~/features/dashboard/store";
import { encryptPassword } from "~/helpers";
import { getLoggedUser } from "~/helpers/auth";
import { UpdateProfileContent } from "../components";
import { UserUpdateProfileApi } from "../store";

function PrivacyAndSecurity() {
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(true);
	const [updatePassword, option] = UserUpdateProfileApi.useUpdatePasswordMutation();
	const { UserId, Email } = getLoggedUser();
	const { refetch } = useGetProfileDataQuery(UserId);
	const { register, handleSubmit, formState, reset } = useForm({
		resolver: yupResolver(passwordUpdateSchema),
		mode: "onChange"
	});

	const onSubmit = async ({ CPassword, CurrentPassword }: any) => {
		await updatePassword({
			NewPassword: encryptPassword(CPassword),
			CurrentPassword: encryptPassword(CurrentPassword),
			UserName: Email,
			UserId: +UserId
		}).unwrap();
		navigate(navigateLink.auth.logout);
		//reset({ CurrentPassword: "", NewPassword: "", ConfirmPassword: "" });
		//setIsVisible(false);
		setTimeout(() => {
			refetch();
		}, 500);
	};

	return (
		<UpdateProfileContent
			title="Privacy And Security"
			isLoading={option.isLoading}
			onSave={handleSubmit(onSubmit)}
			onCancel={() => reset({ CurrentPassword: "", Password: "", CPassword: "" })}
		>
			<section>
				{/* <h6 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
					Password and authentication
				</h6> */}
				{/* <p className="text-sm+ mt-0.5 mb-4">Some text related to the password and authentication</p> */}

				<button
					onClick={() => setIsVisible(!isVisible)}
					className="hidden btn rounded-full bg-primary/10 h-10 text-sm font-semibold text-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
				>
					Change Password
				</button>

				{isVisible && (
					<div className="space-y-4">
						<div className="w-full">
							<FloatingLabelInput type="password" register={register("CurrentPassword")} />
							{formState?.errors?.CurrentPassword && (
								<span className="text-red-500 text-xs ml-2">
									{formState?.errors?.CurrentPassword?.message}
								</span>
							)}
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="w-full">
								<FloatingLabelInput
									name="New Password"
									type="password"
									register={register("Password")}
								/>
								{formState.errors.Password && (
									<span className="text-red-500 text-xs ml-2">
										{formState.errors.Password?.message}
									</span>
								)}
							</div>
							<div className="w-full">
								<FloatingLabelInput
									name="Confirm New Password"
									type="password"
									register={register("CPassword")}
								/>
								{formState.errors.CPassword && (
									<span className="text-red-500 text-xs ml-2">
										{formState.errors.CPassword?.message}
									</span>
								)}
							</div>
						</div>
					</div>
				)}
			</section>
		</UpdateProfileContent>
	);
}
export default PrivacyAndSecurity;
