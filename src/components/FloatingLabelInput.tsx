import React from "react";
import { Icon } from "@iconify/react";

interface IFloatingLabelInput {
	type?: "text" | "email" | "password";
	name?: string;
	isVerify?: boolean;
	error?: boolean;
	disabled?: boolean;
	handleVerify?: any;
	register?: any;
}

export function FloatingLabelInput(props: IFloatingLabelInput) {
	const { type, name, error, isVerify = true, handleVerify, register, disabled } = props;
	const [active, setActive] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);

	function handleActivation(e: any) {
		e.preventDefault();
		setActive(!!e.target.value);
		register.onChange(e);
	}

	return (
		<label className="block relative ">
			<span className="text-sm">{name || register?.name?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")}</span>
			<input
				autoComplete="off"
				className="form-input mt-1.5 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary disabled:pointer-events-none disabled:select-none disabled:border-none disabled:bg-zinc-100"
				placeholder={name || register?.name?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")}
				type={showPassword ? "text" : type || "text"}
				{...register}
				disabled={disabled}
				onChange={handleActivation}
			/>
			{handleVerify && isVerify && (
				<button
					onClick={() => handleVerify()}
					className="absolute capitalize rounded-t bg-white right-1 top-7 h-8 w-auto text-xs+ pr-3 text-blue-500 inline-flex items-center justify-center focus:outline-none"
				>
					Verify email
				</button>
			)}
			{type === "password" && (
				<button
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-0 h-12 w-12 inline-flex items-center justify-center focus:outline-none"
				>
					<Icon
						color="rgba(55, 65, 81, 1)"
						icon={!showPassword ? "akar-icons:eye" : "akar-icons:eye-slashed"}
						width={20}
					/>
				</button>
			)}
		</label>
	);
}
