import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { sso } from "~/features/auth/sso-login/constants";
import { SsoLoginRequest } from "~/features/auth/sso-login/@types";
import { FloatingLabelInput } from "~/components/FloatingLabelInput";
import { useSsoRequestMutation } from "~/features/auth/sso-login/store";
import { SsoValidationSchema } from "~/features/auth/sso-login/validation";

export const DomainForm = React.memo(() => {
	const [doSsoRequest, option] = useSsoRequestMutation();
	const { register, handleSubmit, formState } = useForm<SsoLoginRequest>({
		resolver: yupResolver(SsoValidationSchema),
		mode: "onChange"
	});
	const { errors, isDirty, isValid } = formState;
	const onSubmit: SubmitHandler<SsoLoginRequest> = async formData => {
		await doSsoRequest({ DomainName: formData.domain }).unwrap();
	};
	return (
		<form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
			<div className="form-group flex flex-col">
				<FloatingLabelInput name={sso.form.domain.placeholder} register={register("domain")} />
				{errors.domain && <p className="mt-0.5 ml-1.5 text-xs+ text-red-600">{errors.domain.message}</p>}
			</div>
			<button
				disabled={!isDirty || !isValid || option.isLoading}
				type="submit"
				className="btn w-full h-12 mt-6 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
			>
				{option.isLoading ? "redirecting into SSO login" : sso.btnTxt}
			</button>
		</form>
	);
});
