import * as Yup from "yup";

import { regex } from "~/helpers";
import { training, session } from "./../constants";

const { form: trainingForm } = training;
const { form: sessionForm } = session;

export const trainingValidationSchema = Yup.object().shape({
	Name: Yup.string().required(trainingForm.name.error.required).max(50),
	Description: Yup.string().required(trainingForm.description.error.required).max(250)
});

export const sessionValidationSchema = Yup.object().shape({
	Name: Yup.string().required(sessionForm.name.error.required).max(50),
	Location: Yup.string().required(sessionForm.location.error.required).max(50),
	InstructorName: Yup.string().required(sessionForm.instructorname.error.required).max(50),
	Description: Yup.string().required(sessionForm.description.error.required).max(250)
});
