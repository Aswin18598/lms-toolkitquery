import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import { setSelectedSearchText } from "../store/slice";
import toast from "react-hot-toast";

interface IProps {
	setLoader: any;
	isLearningPath?: boolean;
}

const SearchBar = ({ setLoader, isLearningPath }: IProps) => {
	const { SearchText } = useAppSelector((state: any) => state?.learningReducer);
	const [Search, setSearch] = useState<string>(SearchText);
	const dispatch = useDispatch();

	useEffect(() => {
		setSearch(decodeURIComponent(SearchText));
	}, [SearchText]);

	useEffect(() => {
		setSearch("");
	}, [isLearningPath]);

	const handleBlur = (event: any) => {
		if (event.key === "Enter" && SearchText !== Search) {
			//setLoader(true);
			dispatch(setSelectedSearchText(encodeURIComponent(Search.trim())));
		}
	};

	useEffect(() => {
		if (Search === "") {
			dispatch(setSelectedSearchText(encodeURIComponent(Search.trim())));
		}
	}, [Search]);

	const handleChange = (e: any) => {
		e.preventDefault();
		setSearch(e?.target?.value);
	};

	return (
		<div className="relative border border-slate-300 rounded-lg flex items-center h-10">
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
				placeholder={isLearningPath ? "Search by Path Name" : "Search by Title"}
				className="pr-2 py-2 h-full w-full text-sm text-black rounded-lg pl-11 focus:outline-none focus:bg-white focus:text-gray-900"
				onKeyDown={handleBlur}
				onChange={handleChange}
				value={Search}
			/>
		</div>
	);
};
export default SearchBar;
