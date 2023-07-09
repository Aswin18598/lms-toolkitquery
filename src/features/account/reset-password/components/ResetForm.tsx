import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { encryptPassword } from "~/helpers";
import { navigateLink } from "~/config/api/links";
import { passwordsSchema } from "~/features/auth/sign-up/validation";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { resetPassword } from "~/features/account/reset-password/constants";
import { ResetPasswordRequest } from "~/features/account/reset-password/@types";
import { useResetPasswordMutation, useVerifyEmailLinkMutation } from "~/features/account/reset-password/store";

export const ResetForm = React.memo(() => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [resetUserPassword, option] = useResetPasswordMutation();
	const [verifyEmailLink] = useVerifyEmailLinkMutation();

	const { register, handleSubmit, formState, setValue, watch } = useForm<ResetPasswordRequest>({
		resolver: yupResolver(passwordsSchema),
		mode: "onChange"
	});
	const { errors, isDirty, isValid } = formState;
	const EmailSessionId = params.get("tokenID");

	const onSubmit: SubmitHandler<ResetPasswordRequest> = async formData => {
		const password = encryptPassword(formData?.CPassword);
		await resetUserPassword({ EmailSessionId, EncPassword: password }).unwrap();
		navigate(navigateLink.auth.login);
	};

	React.useEffect(() => {
		if (EmailSessionId) {
			verifyEmailLink({ EmailSessionId })
				.unwrap()
				.catch(() => {
					navigate(navigateLink.auth.forgotPassword);
				});
		} else navigate(navigateLink.auth.forgotPassword);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		watch((values, { name }) => {
			if (name === "Password") {
				setValue("CPassword", "", {
					shouldValidate: true,
					shouldDirty: true
				});
			}
		});
	}, [watch]);

	return (
		<>
			<div className="mt-6 w-full space-y-5">
				<div className="w-full">
					<FloatingLabelInput name="New Password" type="password" register={register("Password")} />
					{errors.Password && <span className="text-red-500 text-xs ml-2">{errors.Password?.message}</span>}
				</div>
				<div className="w-full">
					<FloatingLabelInput name="Confirm New Password" type="password" register={register("CPassword")} />
					{errors.CPassword && <span className="text-red-500 text-xs ml-2">{errors.CPassword?.message}</span>}
				</div>
			</div>
			<button
				disabled={!isDirty || !isValid || option.isLoading}
				onClick={handleSubmit(onSubmit)}
				className="btn w-full h-12 mt-6 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
			>
				{resetPassword.btnTxt}
			</button>
		</>
	);
});
