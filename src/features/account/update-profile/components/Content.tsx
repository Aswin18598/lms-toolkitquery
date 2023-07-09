import { PropsWithChildren } from "react";
import { Spinner } from "~/components/spinner";

type Props = PropsWithChildren<{
	title: string;
	isLoading?: boolean;
	onSave?: () => void;
	onCancel?: () => void;
}>;

export function UpdateProfileContent(props: Props) {
	const { title, isLoading, onSave, onCancel, children } = props;
	return (
		<div className="card">
			<div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
				<h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">{title}</h2>
				<div className="flex justify-center space-x-2">
					<button
						onClick={onCancel}
						className="btn min-w-[7rem] rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
					>
						Cancel
					</button>
					<button
						onClick={onSave}
						className="btn hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 min-w-[7rem] rounded-full bg-primary font-medium text-white"
					>
						Save
					</button>
				</div>
			</div>
			<div className="p- relative p-5">
				{isLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
						<Spinner />
					</div>
				)}
				{children}
			</div>
		</div>
	);
}
