import * as Yup from "yup";

import { regex } from "~/helpers";
import { signUp } from "./../constants";

const { form } = signUp;

export const passwordsSchema = Yup.object().shape({
	Password: Yup.string().required(form.password.error.required).matches(regex.password, form.password.error.regex),
	CPassword: Yup.string()
		.required(form.confirm_password.error.required)
		.oneOf([Yup.ref("Password"), null], form.confirm_password.error.mismatch)
});

export const passwordUpdateSchema = Yup.object()
	.shape({
		CurrentPassword: Yup.string().required()
	})
	.concat(passwordsSchema);

export const signupFormValidationSchema = Yup.object()
	.shape({
		FirstName: Yup.string().required(form.firstName.error.required),
		LastName: Yup.string().required(form.lastName.error.required),
		Email: Yup.string().required(form.email.error.required).matches(regex.email, form.email.error.regex),

		MarketingEmail: Yup.boolean()
		// optVerified: Yup.boolean().required(form.otpVerified.required)
	})
	.concat(passwordsSchema);
