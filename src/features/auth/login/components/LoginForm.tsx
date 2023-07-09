import React, { useEffect } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { navigateLink } from "~/config/api/links";
import { login } from "~/features/auth/login/constants";
import { LoginRequest } from "~/features/auth/login/@types";
import { useLoginMutation } from "~/features/auth/login/store";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { loginValidationSchema } from "~/features/auth/login/validation";
import { ForgotPasswordPageLink } from "~/features/auth/login/components/PageLinks";

export const LoginForm = React.memo(() => {
	const navigate = useNavigate();
	const location = useLocation();
	console.log(window.location.origin, "location");

	const [doLogin, option] = useLoginMutation();

	const { register, handleSubmit, formState } = useForm<LoginRequest>({
		resolver: yupResolver(loginValidationSchema),
		mode: "onChange"
	});
	const { errors, isDirty, isValid } = formState;

	const onSubmit: SubmitHandler<LoginRequest> = async formData => {
		await doLogin(formData).unwrap();
		window.location.replace(window.location.origin + navigateLink.dashboard + location.search);
		// navigate(
		// 	{
		// 		pathname: navigateLink.dashboard,
		// 		search: location.search
		// 	},
		// 	{ replace: true }
		// );
	};

	useEffect(() => {
		window.addEventListener("keydown", event => {
			if (event.key === "Enter" && (isDirty || isValid || option.isLoading)) {
				document.getElementById("Signin_Submit")?.click();
			}
		});
	}, [isDirty, isValid, option.isLoading]);

	return (
		<div className="login-form mt-10">
			<div className="group mb-4">
				<FloatingLabelInput name={login.form.email.placeholder} register={register("Email")} />
				{errors.Email && <p className="mt-0.5 ml-1.5 text-xs text-red-600">{errors.Email.message}</p>}
			</div>
			<div className="group mb-2">
				<FloatingLabelInput
					type="password"
					name={login.form.password.placeholder}
					register={register("EncPassword")}
				/>
				{errors.EncPassword && (
					<p className="mt-0.5 ml-1.5 text-xs text-red-600">{errors.EncPassword.message}</p>
				)}
			</div>
			<div className="flex items-center justify-end">
				<ForgotPasswordPageLink />
			</div>
			<button
				id="Signin_Submit"
				onClick={handleSubmit(onSubmit)}
				disabled={!isDirty || !isValid || option.isLoading}
				className="btn w-full h-12 mt-6 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
			>
				{login.btnTxt}
			</button>
		</div>
	);
});
