import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "./Card";
import { useAppSelector } from "~/config/store";
import { Spinner } from "~/components/spinner";
import {
	useGetGridQuery,
	getCategorySubCategoryIDPageNum,
	handleCategorySubCategoryIDPageNum
} from "~/features/quickstarts/store";
import _ from "lodash";
interface IProps {
	UserID?: string;
}

const QuickstartGrid = ({ UserID }: IProps) => {
	const { Grid, GridMessage, Playlist } = useAppSelector((state: any) => state.quickstarts);
	const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1);
	const dispatch = useDispatch();
	const CategorySubCategoryIDPageNum = useSelector(getCategorySubCategoryIDPageNum);
	const PageNumber = CategorySubCategoryIDPageNum["PageNumber"];
	const SubCategoryID = CategorySubCategoryIDPageNum["SubCategoryID"];
	const CategoryID = CategorySubCategoryIDPageNum["CategoryID"];
	const SearchText = Playlist.trim();
	const { isFetching } = useGetGridQuery({ UserID, CategoryID, SubCategoryID, PageNumber, SearchText });

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDPageNum({
				CategoryID: CategoryID,
				SubCategoryID: SubCategoryID,
				PageNumber: selectedPageNumber
			})
		);
	}, [selectedPageNumber]);

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDPageNum({
				CategoryID: 0,
				SubCategoryID: 0,
				PageNumber: 1
			})
		);
	}, []);

	useEffect(() => {
		if (PageNumber === 1) {
			setSelectedPageNumber(1);
		}
	}, [PageNumber]);

	useEffect(() => {
		setSelectedPageNumber(1);
	}, [SearchText]);

	function minusPageNumber(): void {
		if (selectedPageNumber === 1) {
			setSelectedPageNumber(selectedPageNumber);
		} else {
			setSelectedPageNumber(selectedPageNumber - 1);
		}
	}

	function plusPageNumber(): void {
		if (selectedPageNumber === Grid.TotalPages) {
			setSelectedPageNumber(selectedPageNumber);
		} else {
			setSelectedPageNumber(selectedPageNumber + 1);
		}
	}

	function highlightSelectedButton(index: number): string {
		if (selectedPageNumber === index) {
			return "bg-[#1268B3] text-[#FFFFFF]";
		} else {
			return "";
		}
	}

	return (
		<>
			{isFetching && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!isFetching &&
				(Grid.TotalItems === 0 ? (
					<div className="flex flex-col text-center items-center mx-auto py-20">
						<img
							className="h-40 my-auto"
							src="assets/images/Tiger_images/tiger-logoutX400.png"
							alt={GridMessage}
						/>
						<p className="text-xs+ text-[#020A12]/60">{GridMessage}</p>
					</div>
				) : (
					<div className="flex flex-row grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
						{Grid.QuickStartGridData?.map((item: any, index: any) => {
							return (
								<Card
									title={item.Title}
									views={item.Views}
									authorImage={item.URL}
									authorName={item.ModifiedBy}
									timeAgo={item.ModifiedDate}
								/>
							);
						})}
					</div>
				))}
			{!isFetching && Grid.TotalPages > 0 && (
				<div className="flex flex-row justify-center mt-12 space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
					<ul className="pagination inline-flex center">
						<li className="rounded-full bg-[#E9EEF5]">
							<button
								className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 active:bg-slate-300/80"
								onClick={() => minusPageNumber()}
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
						{_.times(Grid.TotalPages, i => (
							<li key={i + 1} className="rounded-full bg-[#E9EEF5] ml-2">
								<button
									className={` ${highlightSelectedButton(
										i + 1
									)} flex h-8 min-w-[2rem] items-center justify-center rounded-full px-3 leading-tight transition-colors hover:bg-[slate-300] focus:bg-[#1268B3] focus:text-[#FFFFFF] active:bg-[#1268B3] active:text-[#FFFFFF]`}
									onClick={() => setSelectedPageNumber(i + 1)}
								>
									{i + 1}
								</button>
							</li>
						))}
						<li className="rounded-full bg-[#E9EEF5] ml-2">
							<button
								className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-300 active:bg-slate-300/80"
								onClick={() => plusPageNumber()}
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
			)}
		</>
	);
};

export default QuickstartGrid;
