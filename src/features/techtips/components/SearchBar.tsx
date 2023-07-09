import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleSearchJobs } from "../store/slice";
const SearchBar = () => {
	const dispatch = useDispatch();
	const [searchInput, setSearchInput] = useState("");
	const [searchFinalInput, setSearchFinalInput] = useState("");
	const [searchInTitle, setSearchInTitle] = useState(1);

	const handleChange = (e: any) => {
		e.preventDefault();
		if (e.target.value === "") {
			setSearchInput("");
			setSearchFinalInput("123");
			setSearchInTitle(-1);
		} else {
			setSearchInput(e.target.value);
			setSearchFinalInput(e.target.value.trim());
			setSearchInTitle(1);
		}
	};

	useEffect(() => {
		if (searchInput === "" && searchFinalInput === "123") {
			dispatch(handleSearchJobs({ SearchText: searchFinalInput, SearchInTitle: searchInTitle }));
		}
	}, [searchInput]);

	return (
		<div className="relative w-full flex items-center h-10">
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<button type="submit" className="p-1 focus:outline-none focus:shadow-outline text-black cursor-default">
					<Icon icon="uil:search" width="16" height="16" color="#697179" />
				</button>
			</span>
			<input
				type="search"
				placeholder="Search by Title"
				className="py-2 h-full w-full text-sm text-black rounded-l-lg pl-11 border focus:outline-none focus:bg-white focus:text-gray-900"
				onChange={handleChange}
				value={searchInput}
			/>
			<button
				className="w-32 h-10 rounded-r-lg bg-[#1268B3] text-[#FFFFFF]"
				onClick={() =>
					dispatch(handleSearchJobs({ SearchText: searchFinalInput, SearchInTitle: searchInTitle }))
				}
			>
				Search
			</button>
		</div>
	);
};

export default SearchBar;
