export function Spinner({ size = 7 }: any) {
	return (
		<div
			className={`h-${size} w-${size} mx-auto animate-spin rounded-full border-[3px] border-slate-150 border-r-slate-500 dark:border-navy-500 dark:border-r-navy-300`}
		/>
	);
}
export function Spinner1({ size = 7 }: any) {
	return (
		<div
			className={`h-${size} w-${size} mx-auto my-5 animate-spin rounded-full border-[3px] border-slate-150 border-r-slate-500 dark:border-navy-500 dark:border-r-navy-300`}
		/>
	);
}
