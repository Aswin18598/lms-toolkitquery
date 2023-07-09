import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { setSelectedSearchText } from "../store/slice";

interface IProps {
	setLoader: any;
}

const SearchBar = ({ setLoader }: IProps) => {
	const { TypeID, SearchText } = useAppSelector((state: any) => state?.learningReducer);
	const [Search, setSearch] = useState<string>(SearchText);
	const dispatch = useDispatch();

	const handleBlur = (event: any) => {
		if (event.key === "Enter") {
			setLoader(true);
			dispatch(setSelectedSearchText(Search.trim()));
		}
	};

	useEffect(() => {
		if (Search === "") {
			dispatch(setSelectedSearchText(Search.trim()));
		}
	}, [Search]);

	const handleChange = (e: any) => {
		e.preventDefault();
		setSearch(e?.target?.value);
	};
	return (
		<div className="relative border rounded flex items-center h-10">
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<button
					type="submit"
					className="p-1 focus:outline-none focus:shadow-outline text-black focus:cursor-default"
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
				type="search"
				placeholder="Search by Title"
				className="py-2 h-full w-full text-sm text-black rounded-md pl-11 focus:outline-none focus:bg-white focus:text-gray-900 cursor-pointer"
				onKeyDown={handleBlur}
				onChange={handleChange}
				value={Search}
			/>
		</div>
	);
};
export default SearchBar;
