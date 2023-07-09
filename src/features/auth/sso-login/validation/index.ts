import * as Yup from "yup";
import { sso } from "./../constants";

const { form } = sso;

export const SsoValidationSchema = Yup.object().shape({
	domain: Yup.string().required(form.domain.error.required)
});
