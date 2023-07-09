import { login } from "./constants";
import { useState, useEffect } from "react";
import SocialLogin from "~/features/auth/social-login";
import { LoginForm, SignUpPageLink, SsoPageLink } from "./components";

function LoginPage() {
	const [show, setShow] = useState(false);
	useEffect(() => {
		setShow(true);
	}, []);
	return (
		<>
			{show ? (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<div className="bg-white max-w-[600px] p-4 rounded-lg ">
						<img
							className="w-full mx-auto"
							src="/crossArmsTiger.png"
							style={{ height: 100, width: 170 }}
							alt="Cosmos"
						/>
						<h1 className="text-xl font-semibold text-center">Welcome !</h1>
						<p className="p-4  text-justify text-xl ">
							{" "}
							Your iGET IT Application has improved. Click on Cancel to continue or click on Classic to
							navigate to Classic view of iGET IT Application
						</p>
						<br />
						<div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
							<div className={"flex justify-center w-full"}>
								<button
									onClick={() => setShow(false)}
									className=" btn w-40 space-x-1 bg-primary text-white text-xs+ rounded-full hover:opacity-80 "
								>
									Cancel
								</button>
							</div>
							<div className={"flex justify-center w-full"}>
								<a
									href="https://app.myigetit.com/"
									target="_blank"
									className="btn w-40 space-x-1 bg-primary text-white text-xs+ rounded-full hover:opacity-80 "
								>
									Classic
								</a>
							</div>
						</div>
						<br />
						<br />
					</div>
				</section>
			) : null}

			<div className="flex w-full max-w-lg grow flex-col justify-center p-5 bg-white">
				<div title="beta" className="flex justify-end space-x-1 w-full font-bold mr-4">
					<span className="text-red-500">BETA</span>
				</div>
				<div className="text-center">
					<img className="mx-auto mb-5 lg:hidden w-32" src="/logo.png" alt="logo" />
					<div className="mt-4">
						<h2 className="text-3xl font-semibold text-slate-600 dark:text-navy-100">{login.title}</h2>
						<SsoPageLink />
					</div>
				</div>
				<LoginForm />
				<SignUpPageLink />
				<SocialLogin />
			</div>
		</>
	);
}

export default LoginPage;
