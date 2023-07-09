export const signUp = {
	title: "Sign Up",
	loginText: "Already a user? ",
	loginLinkText: "Sign In",
	btnTxt: "Sign Up",
	marketingTxt: "Send me Marketing Emails about Tata Technologies Products and Services",
	form: {
		firstName: {
			placeholder: "First Name",
			error: {
				required: "Enter First Name"
			}
		},
		lastName: {
			placeholder: "Last Name",
			error: {
				required: "Enter Last Name"
			}
		},
		email: {
			placeholder: "Email",
			error: {
				required: "Enter Your email",
				regex: "Invalid email address"
			}
		},
		password: {
			placeholder: "Password",
			error: {
				required: "Enter a Password",
				regex: "Use 8 or more characters with a mix of letters, numbers & symbols"
			}
		},
		confirm_password: {
			placeholder: "Confirm Password",
			error: {
				required: "Confirm your password",
				mismatch: "Those passwords didn't match. Try again."
			}
		},
		otpVerified: { required: "otp not verified" }
	}
};
