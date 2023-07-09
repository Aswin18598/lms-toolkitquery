import { useState } from "react";
import { Icon } from "@iconify/react";
import OtpInput from "react-otp-input";
import CountDownTimer from "./CountDownTimer";
import { dispatch, useAppSelector } from "~/config/store";
import { signUpAction, useSendOtpMutation, useVerifyOtpMutation } from "~/features/auth/sign-up/store";

const timing = 30;
const numInputs = 4;

export function VerifyOtp() {
	const [otp, setOtp] = useState("");
	const [timer, setTimer] = useState(timing);
	const handleChange = (otp: any) => setOtp(otp);
	const [sendOtp, sendOtpOption] = useSendOtpMutation();
	const [verifyOtp, verifyOtpOption] = useVerifyOtpMutation();
	const signup = useAppSelector((state: any) => state.authSignUp);

	const handleSubmit = async () => {
		await verifyOtp({ Email: signup.Email, Otp: otp }).unwrap();
	};

	const handleOtpSend = async () => {
		await sendOtp({ EmailID: signup.Email }).unwrap();
		setTimer(30);
		setOtp("");
	};

	return (
		<div
			id="defaultModal"
			className="animate-opacity backdrop-filter backdrop-blur bg-white/30 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
			aria-modal="true"
			role="dialog"
		>
			<div className="relative p-4 w-full max-w-sm h-full md:h-auto">
				<div className="relative bg-white rounded-lg shadow p-10">
					<button
						className="border-none p-3 absolute top-3 right-3"
						onClick={() => dispatch(signUpAction.toggleIsVerified())}
					>
						<Icon icon="ic:baseline-close" width={18} color="text-[#C7CFD761]" />
					</button>
					<h3 className="text-xl font-semibold text-gray-900 text-center">OTP Verification</h3>
					<OtpInput
						containerStyle="flex flex-row justify-between mt-5"
						inputStyle="border h-12 !w-12 text-center form-control rounded text-lg font-semibold"
						value={otp}
						isInputNum
						shouldAutoFocus
						onChange={(otp: any) => handleChange(otp)}
					/>

					<div className="flex items-center space-x-3 my-5 items-center justify-center text-xs">
						<CountDownTimer hours={0} minutes={0} seconds={timer} onTimeUp={() => setTimer(0)} />
						{(timer === 0 || sendOtpOption.isLoading) && (
							<button
								className="disabled:(text-[#C7CFD761] pointer-events-none) cursor-pointer text-blue-500"
								onClick={() => handleOtpSend()}
							>
								Resend OTP
							</button>
						)}
					</div>
					<button
						disabled={otp.length < numInputs || timer === 0 || verifyOtpOption.isLoading}
						onClick={() => handleSubmit()}
						className="btn w-full h-12 bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:pointer-events-none disabled:select-none disabled:opacity-60 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
					>
						Verify
					</button>
				</div>
			</div>
		</div>
	);
}
