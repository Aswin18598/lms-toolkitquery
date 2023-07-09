import { dispatch } from "~/config/store";
import { setSelectedPageNumber } from "../store";

interface IProps {
	setFavToggle: any;
	favToggle: boolean;
	setLoader: any;
}

const FavCourseToggle = ({ setFavToggle, favToggle, setLoader }: IProps) => {
	const toggleClass = "transform translate-x-3 md:translate-x-5";
	return (
		<>
			<div className="flex justify-between items-center bg-white border rounded-lg border border-slate-300 py-2 px-1 h-10 w-full">
				<button
					className={`md:w-10 md:h-4 w-8 h-4 flex items-center ${
						!favToggle ? "bg-[#cbd5e1]" : "bg-[#1268B3]"
					} rounded-full p-1 cursor-pointer`}
					onClick={() => {
						setFavToggle(!favToggle);
						setLoader(true);
						dispatch(setSelectedPageNumber(1)); //changed
					}}
				>
					<div
						className={
							"bg-white md:w-3 h-2.5 w-3 rounded-full shadow-md transform duration-300 ease-in-out " +
							(!favToggle ? null : toggleClass)
						}
					></div>
				</button>
				<p className="cursor-default text-sm mr-2">Favorites</p>
			</div>
		</>
	);
};

export default FavCourseToggle;
