import { ChangeEvent } from "react";

interface IProps {
	setStatusID: any;
	statusID: number;
	optionChoice?: boolean;
	setLoader: any;
	TypeID?: number;
}

const Progress = ({ statusID, setStatusID, optionChoice, setLoader, TypeID }: IProps) => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLoader(true);
		setStatusID(e.target.value);
	};
	return (
		<select
			value={statusID}
			placeholder="Category"
			onChange={handleChange}
			className="form-select text-sm  w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
		>
			{TypeID !== 2 ? (
				<>
					<option value={0}>{"Status (All)"}</option>
					<option value={1}>{optionChoice ? "Yet to start" : "Not taken"}</option>
					<option value={2}>In-progress</option>
					<option value={3}>Completed</option>
				</>
			) : (
				<>
					<option value={0}>{"Status (All)"}</option>
					<option value={1}>Not taken</option>
					<option value={2}>Passed</option>
					<option value={3}>Failed</option>
				</>
			)}
		</select>
	);
};
export default Progress;
