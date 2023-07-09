export const sso = {
	title: "Single Sign On",
	description:
		'If your company has single sign-on set-up with i GET IT, enter your company\'s web address to access your unique login page. The format needs to be as such: "domainname.com".',
	loginText: "Not an enterprise user?",
	loginLinkText: "Sign In",
	btnTxt: "Proceed",
	form: {
		domain: {
			placeholder: "Domain Name",
			error: {
				required: "Domain is required",
				regex: "Invalid domain"
			}
		}
	}
};
