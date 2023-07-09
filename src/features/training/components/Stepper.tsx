import { useState } from "react";

interface IStepperProps {
	step: number;
	updateStep: Function;
}

function Stepper({ step, updateStep }: IStepperProps) {
	return (
		<>
			<div className="steps w-full">
				<ul className="form-stepper form-stepper-horizontal mx-auto w-1/2">
					<li
						className={
							"text-center form-stepper-list " +
							(step === 1 ? "form-stepper-active" : "") +
							(step === 2 ? "form-stepper-completed" : "")
						}
					>
						<div>
							<span className="form-stepper-circle"></span>
							<div className="label">Training</div>
						</div>
					</li>
					<li className={"text-center form-stepper-list " + (step === 2 ? "form-stepper-active" : "")}>
						<div>
							<span className="form-stepper-circle"></span>
							<div className="label">Session</div>
						</div>
					</li>
				</ul>
			</div>
		</>
	);
}

export default Stepper;
