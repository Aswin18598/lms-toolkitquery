import React from "react";
interface ISearchBoxProps {
	value?: string;
	setState?: React.Dispatch<React.SetStateAction<string>> | any;
	placeholder?: string;
	isUsersTabContent?: boolean;
	handleClick?: () => Promise<void>;
	handleBlur?: (event: any) => Promise<void>;
}
function SearchBox(props: ISearchBoxProps) {
	const { value, setState, placeholder, isUsersTabContent, handleClick, handleBlur } = props;
	return (
		<div className="w-full relative border border-slate-300 rounded-lg flex items-center h-10">
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<button
					type="submit"
					className="p-1 focus:outline-none focus:shadow-outline text-black focus:cursor-default"
					onClick={handleClick}
				>
					<svg
						fill="currentColor"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						className="w-4 h-4"
					>
						<path fill="white" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</button>
			</span>

			<input
				value={value}
				onChange={e => setState(e.target.value)}
				onKeyDown={isUsersTabContent ? handleBlur : undefined}
				type="text"
				placeholder={placeholder || "Search"}
				className="pr-2 py-2 h-full w-full text-sm text-black rounded-lg pl-11 focus:outline-primary focus:bg-white focus:text-gray-900"
			/>
		</div>
	);
}

export default SearchBox;
