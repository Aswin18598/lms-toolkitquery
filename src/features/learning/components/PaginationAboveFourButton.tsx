import React from "react";
import { PaginationData } from "../@types";
interface IPaginationAboveFourButton {
	handlePageNumber: (index: number) => void;
	pageNumber: number;
	PaginationData: PaginationData;
	selectedBackGround: string;
}
function PaginationAboveFourButton(props: IPaginationAboveFourButton) {
	const { handlePageNumber, pageNumber, PaginationData, selectedBackGround } = props;
	return (
		<>
			<li className="bg-[#E9EEF5] ">
				<button
					className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
						pageNumber === pageNumber && selectedBackGround
					}`}
					onClick={() => handlePageNumber(pageNumber)}
				>
					{pageNumber}
				</button>
			</li>
			<li className="bg-[#E9EEF5] ">
				<button
					className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
						pageNumber === pageNumber + 1 && selectedBackGround
					}`}
					onClick={() => handlePageNumber(pageNumber + 1)}
				>
					{pageNumber + 1}
				</button>
			</li>
			<li className="bg-[#E9EEF5] ">
				<button
					className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
						pageNumber === pageNumber + 2 && selectedBackGround
					}`}
					onClick={() => handlePageNumber(pageNumber + 2)}
				>
					{pageNumber + 2}
				</button>
			</li>
			<li className="bg-[#E9EEF5] ">
				<button
					className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${""}`}
				>
					. . . . . .
				</button>
			</li>
			<li className="bg-[#E9EEF5] ">
				<button
					className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
						pageNumber === PaginationData.TotalPages && selectedBackGround
					}`}
					onClick={() => handlePageNumber(PaginationData?.TotalPages)}
				>
					{PaginationData?.TotalPages}
				</button>
			</li>
		</>
	);
}

export default PaginationAboveFourButton;
