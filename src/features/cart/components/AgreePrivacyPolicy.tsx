import React from "react";
import { Icon } from "@iconify/react";

export const AgreePrivacyPolicy = React.memo(() => (
	<p className="flex select-none text-xs+ space-x-2">
		<Icon icon="mingcute:information-line" width={20} className="fill-current" />
		<span>By clicking on "Proceed to pay" you agree to the Terms of Use and Privacy Policy.</span>
	</p>
));
