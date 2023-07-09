import * as Yup from "yup";

import { login } from "./../constants";

const { form } = login;
// .matches(regex.email, form.email.error.regex),

export const loginValidationSchema = Yup.object().shape({
	Email: Yup.string().required(form.email.error.required),
	EncPassword: Yup.string().required(form.password.error.required)
});
