import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { navigateLink } from "~/config/api/links";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { BackToLogin } from "~/features/auth/forgot-password/components";
import { forgotPassword } from "~/features/auth/forgot-password/constants";
import { ForgotPasswordRequest } from "~/features/auth/forgot-password/@types";
import { useForgotPasswordMutation } from "~/features/auth/forgot-password/store";
import { forgotPasswordValidationSchema } from "~/features/auth/forgot-password/validation";

function ForgotPasswordPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [doForgotPassword, option] = useForgotPasswordMutation();
	const { register, handleSubmit, formState } = useForm<ForgotPasswordRequest>({
		// resolver: yupResolver(forgotPasswordValidationSchema),
		mode: "onChange"
	});
	const { errors, isDirty, isValid } = formState;
	const onSubmit: SubmitHandler<ForgotPasswordRequest> = async formData => {
		await doForgotPassword(formData).unwrap();
		window.location.replace(window.location.origin + navigateLink.dashboard + location.search);
		// navigate(
		// 	{
		// 		pathname: navigateLink.dashboard,
		// 		search: location.search
		// 	},
		// 	{ replace: true }
		// );
	};

	return (
		<div className="flex w-full max-w-md grow flex-col justify-center p-5 bg-white">
			<BackToLogin />
			<div className="text-center">
				<img className="mx-auto mb-5 lg:hidden w-32" src="/logo.png" alt="logo" />
				<div className="mt-4">
					<h2 className="text-3xl font-semibold text-slate-600 dark:text-navy-100">{forgotPassword.title}</h2>
					<p className="text-slate-400 dark:text-navy-300 mt-2 text-sm+">{forgotPassword.description}</p>
				</div>
			</div>
			<form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group flex flex-col">
					<FloatingLabelInput name={forgotPassword.form.email.placeholder} register={register("Email")} />
					{/* {errors.Email && <p className="mt-0.5 ml-1.5 text-xs+ text-red-600">{errors.Email.message}</p>} */}
				</div>
				<button
					disabled={option.isLoading}
					// disabled={!isDirty || !isValid || option.isLoading}
					className="btn w-full h-12 mt-6 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
				>
					{forgotPassword.btnTxt}
				</button>
			</form>
			<div className="hidden mt-6 text-center text-sm">
				<p className="line-clamp-1">
					<span>If you are still having trouble this </span>
					<a
						className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
						href="/"
					>
						article
					</a>
					<span> might help</span>
				</p>
			</div>
		</div>
	);
}

export default ForgotPasswordPage;
