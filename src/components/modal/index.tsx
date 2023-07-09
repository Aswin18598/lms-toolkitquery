import classNames from "classnames";
import type { PropsWithChildren, ReactElement } from "react";

interface Props {
	className?: string;
	title?: string | ReactElement;
	action?: ReactElement;
	onCancel?: VoidFunction;
	position?: "center" | "right";
}

const style = {
	wrapper: classNames("fixed inset-0 z-[100] flex flex-col overflow-hidden"),
	backdrop: classNames("absolute inset-0 bg-slate-900/60 transition-opacity duration-300"),
	content: "w-full relative rounded-lg bg-white transition-all duration-300 dark:bg-navy-700"
};

function Modal(props: PropsWithChildren<Props>) {
	const { className = "max-w-md", position, children, title, action, onCancel } = props;
	return (
		<div
			className={classNames(style.wrapper, {
				"items-center justify-center": !position || position === "center",
				"items-end": position === "right"
			})}
			role="dialog"
		>
			<div className={style.backdrop} />
			<div className={classNames(style.content, className)}>
				{title && (
					<div className="bg-gray-100 px-4 pt-3 pb-2.5 flex items-center justify-between border-b rounded-t-lg">
						<h2 className="font-medium tracking-wide text-slate-700 dark:text-navy-100 text-lg">{title}</h2>
						<div className="flex gap-3 items-center">
							{action || null}
							{onCancel && (
								<button
									onClick={onCancel}
									className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4.5 w-4.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>
					</div>
				)}
				{children}
			</div>
		</div>
	);
}

export default Modal;
