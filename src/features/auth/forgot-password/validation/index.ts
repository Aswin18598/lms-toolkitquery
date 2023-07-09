import * as Yup from "yup";
import { regex } from "~/helpers";
import { forgotPassword } from "./../constants";

const { form } = forgotPassword;

export const forgotPasswordValidationSchema = Yup.object().shape({
	Email: Yup.string().required(form.email.error.required).matches(regex.email, form.email.error.regex)
});
