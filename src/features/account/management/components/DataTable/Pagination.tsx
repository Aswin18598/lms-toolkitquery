import classNames from "classnames";
import { usePagination, DOTS } from "./usePagination";

const Pagination = (props: any) => {
	const {
		onPageChange,
		totalCount,
		siblingCount = 1,
		currentPage,
		pageSize = 10,
		onPageSizeChange,
		isItemsCenter
	} = props;

	const paginationRange: any = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize
	});

	if (currentPage === 0) return null;

	const onNext = () => onPageChange(currentPage + 1);
	const onPrevious = () => onPageChange(currentPage - 1);

	return (
		<div
			className={`flex flex-col justify-between space-y-4 ${
				isItemsCenter ? "items-center" : ""
			} px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5`}
		>
			<div className="flex items-center space-x-2 text-xs+">
				<span>Show</span>
				<label className="block">
					<select
						defaultValue={pageSize}
						onChange={e => onPageSizeChange(Number(e.target.value))}
						className="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
					>
						<option>10</option>
						<option>30</option>
						<option>50</option>
					</select>
				</label>
				<span>entries</span>
			</div>
			<ol className="pagination flex">
				<li onClick={onPrevious} className="rounded-l-full bg-slate-150 dark:bg-navy-500">
					<button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
						</svg>
					</button>
				</li>
				{paginationRange?.map((pageNumber: number | string) => {
					if (pageNumber === DOTS) {
						return (
							<li key={pageNumber} className="bg-slate-150 dark:bg-navy-500">
								<button className="flex h-6 min-w-[2rem] items-center justify-center rounded-full px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80">
									&#8230;
								</button>
							</li>
						);
					}
					return (
						<li
							key={pageNumber}
							onClick={() => onPageChange(pageNumber)}
							className="bg-slate-150 dark:bg-navy-500"
						>
							<button
								className={classNames(
									"flex h-8 min-w-[2rem] items-center justify-center rounded-full px-3 leading-tight transition-colors hover:bg-primary hover:text-white focus:none",
									{
										"bg-transparent": pageNumber !== currentPage,
										"bg-primary text-white": pageNumber === currentPage
									}
								)}
							>
								{pageNumber}
							</button>
						</li>
					);
				})}
				<li onClick={onNext} className="rounded-r-full bg-slate-150 dark:bg-navy-500">
					<button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
						</svg>
					</button>
				</li>
			</ol>
			<div className="text-xs+">1 - 10 of {pageSize} entries</div>
		</div>
	);
};

export default Pagination;
