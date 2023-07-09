import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleSearchJobs } from "../store/slice";
const SearchBar = () => {
	const dispatch = useDispatch();
	const [searchInput, setSearchInput] = useState("");

	const handleChange = (e: any) => {
		e.preventDefault();
		if (e.target.value == "") {
			setSearchInput("");
		} else {
			setSearchInput(e.target.value);
		}
	};

	const handleBlur = (event: any) => {
		if (event.key === "Enter") {
			dispatch(handleSearchJobs(searchInput.trim()));
		}
	};

	useEffect(() => {
		if (searchInput === "") {
			dispatch(handleSearchJobs(searchInput.trim()));
		}
	}, [searchInput]);

	return (
		<div className="relative w-full flex items-center h-9">
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<button type="submit" className="p-1 focus:outline-none focus:shadow-outline text-black cursor-default">
					<Icon icon="uil:search" width="16" height="16" color="#697179" />
				</button>
			</span>
			<input
				type="search"
				placeholder="Search by Title"
				className="py-2 h-full w-full text-sm text-black rounded-lg pl-11 border focus:outline-none focus:bg-white focus:text-gray-900"
				onChange={handleChange}
				onKeyDown={handleBlur}
				value={searchInput}
			/>
		</div>
	);
};

export default SearchBar;
