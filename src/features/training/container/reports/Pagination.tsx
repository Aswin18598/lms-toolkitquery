import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { PaginationData } from "../../@types";

interface IProps {
	PaginationData: PaginationData;
	count?: number;
	pageNumber: number;
	setPageNumber: any;
	pageSize: number;
	setPageSize: any;
}

const Pagination = ({ PaginationData, count = 10, pageSize, setPageSize, pageNumber, setPageNumber }: IProps) => {
	const [startIndex, setStartIndex] = useState<number>(pageNumber === 1 ? 0 : pageNumber * pageSize - pageSize);
	const [endIndex, setEndIndex] = useState<number>(pageNumber * pageSize);
	const selectedBackGround = "bg-[#1268B3] text-[#FFFFFF]";

	const enteriesHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		setStartIndex(0);
		setPageSize(e.target.value);
		setEndIndex(+e.target.value);
		setPageNumber(1);
	};

	function minusPageNumber(): void {
		if (pageNumber === 1) {
			setPageNumber(pageNumber);
		} else {
			setPageNumber(pageNumber - 1);
			setStartIndex(startIndex - pageSize);
			setEndIndex(endIndex === PaginationData?.TotalItems ? startIndex : endIndex - pageSize);
		}
	}

	function plusPageNumber(): void {
		if (pageNumber === PaginationData.TotalPages) {
			setPageNumber(pageNumber);
		} else {
			setPageNumber(pageNumber + 1);
			setStartIndex(startIndex + pageSize);
			setEndIndex(
				endIndex + pageSize > PaginationData.TotalItems ? PaginationData.TotalItems : endIndex + pageSize
			);
		}
	}

	const handlePageNumber = (index: number) => {
		setPageNumber(index);
		let newStartIndex = (index - 1) * pageSize;
		setStartIndex(newStartIndex);
		setEndIndex(
			newStartIndex + pageSize > PaginationData.TotalItems ? PaginationData.TotalItems : newStartIndex + pageSize
		);
	};

	return (
		<>
			{PaginationData?.TotalPages > 0 && (
				<div className="flex flex-col items-center rounded-b-lg bg-[#FFFFFF] border justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
					<div className="text-sm flex-row">
						Show{" "}
						<select
							value={pageSize}
							placeholder="Category"
							onChange={enteriesHandler}
							className="border rounded-lg"
						>
							{_.times(4, i => (
								<option key={i + 1} value={(i + 1) * count}>
									{(i + 1) * count}
								</option>
							))}
						</select>{" "}
						Entries
					</div>
					<div>
						<ul className="pagination inline-flex items-center -space-x-px">
							<li className="rounded-l-full bg-[#E9EEF5]">
								<button
									className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300"
									onClick={minusPageNumber}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
							</li>
							{PaginationData?.TotalPages < 5 &&
								_.times(PaginationData?.TotalPages, i => (
									<li key={i + 1} className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:text-[#FFFFFF] ${
												pageNumber === i + 1 ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(i + 1)}
										>
											{i + 1}
										</button>
									</li>
								))}
							{PaginationData?.TotalPages > 4 && pageNumber < PaginationData?.TotalPages - 2 && (
								<>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === pageNumber ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(pageNumber)}
										>
											{pageNumber}
										</button>
									</li>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === pageNumber + 1 ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(pageNumber + 1)}
										>
											{pageNumber + 1}
										</button>
									</li>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === pageNumber + 2 ? selectedBackGround : ""
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
												pageNumber === PaginationData?.TotalPages ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(PaginationData?.TotalPages)}
										>
											{PaginationData?.TotalPages}
										</button>
									</li>
								</>
							)}
							{PaginationData?.TotalPages > 4 && pageNumber > PaginationData?.TotalPages - 3 && (
								<>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === 1 ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(1)}
										>
											{1}
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
												pageNumber === PaginationData?.TotalPages - 2 ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(PaginationData?.TotalPages - 2)}
										>
											{PaginationData?.TotalPages - 2}
										</button>
									</li>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === PaginationData?.TotalPages - 1 ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(PaginationData?.TotalPages - 1)}
										>
											{PaginationData?.TotalPages - 1}
										</button>
									</li>
									<li className="bg-[#E9EEF5] ">
										<button
											className={`flex mx-0.5 h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 leading-tight transition-colors hover:bg-[slate-300] active:bg-[#1268B3] active:text-[#FFFFFF] ${
												pageNumber === PaginationData?.TotalPages ? selectedBackGround : ""
											}`}
											onClick={() => handlePageNumber(PaginationData?.TotalPages)}
										>
											{PaginationData?.TotalPages}
										</button>
									</li>
								</>
							)}

							<li className="rounded-r-full bg-slate-150">
								<button
									className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300"
									onClick={plusPageNumber}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</li>
						</ul>
					</div>
					<div className="text-sm">
						{startIndex + 1} - {endIndex > PaginationData.TotalItems ? PaginationData.TotalItems : endIndex}{" "}
						of {PaginationData.TotalItems} entries
					</div>
				</div>
			)}
		</>
	);
};

export default Pagination;
