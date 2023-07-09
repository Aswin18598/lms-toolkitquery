import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSSORequestByAccountIDMutation } from "~/features/auth/sso-login/store";
import { Spinner } from "./spinner";

const RedirectingPage = () => {
	const [SSORequestByAccountIDQuery] = useSSORequestByAccountIDMutation();
	const params = useParams();
	localStorage.clear();
	const SSORequestByAccountIDFunc = async () => {
		const SSORequestByAccountIDData: any = await SSORequestByAccountIDQuery({
			AccountID: params.AccountID,
			ItemID: 0,
			ItemTypeID: 0
		});
		const SSORequestByAccountIDResponseURL = SSORequestByAccountIDData?.data.Data[0].ssoLoginUrl;
		window.location.replace(SSORequestByAccountIDResponseURL);
	};

	useEffect(() => {
		if (params.AccountID) SSORequestByAccountIDFunc();
	}, []);

	return (
		<div className="flex justify-center items-center gap-8 m-auto flex-wrap">
			<span className="text-2xl font-bold text-primary m-auto">Please Wait ...</span>
			<div className="flex justify-center items-center w-full">
				<Spinner />
			</div>
		</div>
	);
};

export default RedirectingPage;
