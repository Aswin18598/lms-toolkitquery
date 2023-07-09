import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { dispatch, useAppSelector } from "~/config/store";
import { navigateLink } from "~/config/api/links";
import { signUp } from "~/features/auth/sign-up/constants";
import { SingUpRequest } from "~/features/auth/sign-up/@types";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { signupFormValidationSchema } from "~/features/auth/sign-up/validation";
import { useSignUpMutation, useSendOtpMutation, signUpAction } from "~/features/auth/sign-up/store";

export const SignUpForm = React.memo(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const [createAccount, { isLoading }] = useSignUpMutation();
	const [verifyEmail, verifyEmailOption] = useSendOtpMutation();
	const signup = useAppSelector((state: any) => state.authSignUp);
	const { register, handleSubmit, getValues, setValue, formState, watch } = useForm<SingUpRequest>({
		resolver: yupResolver(signupFormValidationSchema),
		mode: "onChange"
	});
	const { errors, isDirty, isValid } = formState;

	const onSubmit: SubmitHandler<SingUpRequest> = async formData => {
		await createAccount(formData).unwrap();
		navigate(
			{
				pathname: navigateLink.auth.login,
				search: location.search
			},
			{ replace: true }
		);
	};
	const handleVerifyEmail = React.useCallback(async () => {
		await verifyEmail({ EmailID: getValues("Email") })
			.unwrap()
			.catch(() => {
				navigate(
					{
						pathname: navigateLink.auth.login,
						search: location.search
					},
					{ replace: true }
				);
			});

		//eslint-disable-next-line
	}, []);

	React.useEffect(() => {
		watch((values, { name }) => {
			if (name === "Email") {
				dispatch(signUpAction.toggleOtpVerified(false));
			}
			if (name === "Password") {
				setValue("CPassword", "", {
					shouldValidate: true,
					shouldDirty: true
				});
			}
		});
	}, [watch]);

	useEffect(() => {
		window.addEventListener("keydown", event => {
			if (event.key === "Enter" && (isDirty || isValid || signup.isOtpVerified)) {
				document.getElementById("Signup_Submit")?.click();
			}
		});
	}, [isDirty, isValid, signup.isOtpVerified]);

	return (
		<section className="space-y-4 mt-10">
			<div className="flex flex-col space-y-1">
				<div className="flex space-x-3">
					<FloatingLabelInput error={!!errors?.FirstName} register={register("FirstName")} />
					<FloatingLabelInput error={!!errors.LastName} register={register("LastName")} />
				</div>
				{errors.FirstName && !errors.LastName && (
					<span className="text-red-500 text-xs+ ml-2">{errors.FirstName?.message}</span>
				)}
				{!errors.FirstName && errors.LastName && (
					<span className="text-red-500 text-xs+ ml-2">{errors.LastName?.message}</span>
				)}
				{errors.FirstName && errors.LastName && (
					<span className="text-red-500 text-xs+ ml-2">Enter first and last names</span>
				)}
			</div>
			<div className="w-full relative">
				<FloatingLabelInput
					isVerify={!!getValues("Email") && !errors.Email && !signup.isOtpVerified}
					handleVerify={handleVerifyEmail}
					error={!!errors?.Email}
					register={register("Email")}
				/>
				<span className="bg-white inline-flex w-24 items-center justify-end absolute top-8 right-3">
					{verifyEmailOption.isLoading && (
						<Icon width={22} icon="tabler:loader-2" color="#666" className="animate-spin" />
					)}
					{signup.isOtpVerified && (
						<Icon width={24} icon="mdi:email-check-outline" className="text-green-500" />
					)}
				</span>
				{errors.Email && <span className="text-red-500 text-xs+ ml-2">{errors.Email?.message}</span>}
				{!errors.Email && !!getValues("Email") && !signup.isOtpVerified && (
					<span className="text-red-500 text-xs+ ml-2">Email not verified</span>
				)}
			</div>
			<div className="flex flex-col space-y-1">
				<div className="flex space-x-3">
					<FloatingLabelInput type="password" error={!!errors?.Password} register={register("Password")} />
					<FloatingLabelInput
						type="password"
						error={!!errors?.CPassword}
						name="Confirm Password"
						register={register("CPassword")}
					/>
				</div>
				{errors.Password && <span className="text-red-500 text-xs+ ml-2">{errors.Password?.message}</span>}
				{!errors.Password && getValues("Password") && errors.CPassword && (
					<span className="text-red-500 text-xs+ ml-2">{errors.CPassword?.message}</span>
				)}
			</div>
			<div className="pt-2 flex select-none text-[#0000008A]">
				<input
					id="marketing"
					type="checkbox"
					{...register("MarketingEmail")}
					className="form-checkbox is-outline h-5 w-5 rounded border-slate-400/70 bg-slate-100 before:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-500 dark:bg-navy-900 dark:before:bg-accent dark:checked:border-accent dark:hover:border-accent dark:focus:border-accent"
				/>
				<label htmlFor="marketing" className="relative -top-[2px] cursor-pointer ml-1.5 block text-sm">
					{signUp.marketingTxt}
				</label>
			</div>
			<button
				id="Signup_Submit"
				disabled={!isDirty || !isValid || isLoading || !signup.isOtpVerified}
				onClick={handleSubmit(onSubmit)}
				className="btn w-full h-12 mt-6 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
			>
				{signUp.btnTxt}
			</button>
		</section>
	);
});
