import { useEffect, useState } from "react";
import { handleSearchPlaylist } from "../store/slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
const SearchBar = () => {
	const { Playlist } = useAppSelector((state: any) => state.quickstarts);
	const [Search, setSearch] = useState<string>(Playlist);
	const dispatch = useDispatch();

	const handleBlur = (event: any) => {
		if (event.key === "Enter") {
			dispatch(handleSearchPlaylist(Search.trim()));
		}
	};

	useEffect(() => {
		if (Search === "") {
			dispatch(handleSearchPlaylist(Search.trim()));
		}
	}, [Search]);

	const handleChange = (e: any) => {
		e.preventDefault();
		setSearch(e?.target?.value);
	};

	return (
		<div className="border border-slate-300 rounded-lg relative w-full flex items-center h-10">
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<button type="submit" className="focus:outline-none focus:shadow-outline text-black cursor-default">
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
				type="search"
				placeholder="Search"
				className="text-sm py-1 h-full w-full  rounded-lg pl-10 focus:outline-none"
				onChange={handleChange}
				onKeyDown={handleBlur}
				value={Search}
			/>
		</div>
	);
};

export default SearchBar;
