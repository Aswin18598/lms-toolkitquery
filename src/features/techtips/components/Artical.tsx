import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppSelector } from "~/config/store";
import {
	useGetTopicsQuery,
	getSearch,
	getCategorySubCategoryIDTopicIDPageNum,
	handleCategorySubCategoryIDTopicIDPageNum,
	getApply,
	handleApply
} from "~/features/techtips/store";
import { Icon } from "@iconify/react";
import { Spinner } from "~/components/spinner";
import Pagination from "./Pagination";
import { RedirectLinkArticleID } from "~/helpers/RedirectLink";
interface IProps {
	UserID?: string;
}

const Artical = ({ UserID }: IProps) => {
	const locationEndPoint = window.location.pathname.replace("/", "") + encodeURIComponent(window.location.search);
	const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1);
	const dispatch = useDispatch();
	const apply = useSelector(getApply);
	const [entries, setEntries] = useState<number>(100);
	const SearchTextInTitle = useSelector(getSearch);
	const SearchText = SearchTextInTitle["SearchText"];
	const SearchInTitle = SearchTextInTitle["SearchInTitle"];
	const CategorySubCategoryIDTopicIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const SubCategoryID = CategorySubCategoryIDTopicIDPageNum["SubCategoryID"];
	const CategoryID = CategorySubCategoryIDTopicIDPageNum["CategoryID"];
	const TopicID = CategorySubCategoryIDTopicIDPageNum["TopicID"];
	const { refetch, isFetching } = useGetTopicsQuery(
		{ UserID, CategoryID, SubCategoryID, TopicID, SearchInTitle, SearchText, selectedPageNumber, entries },
		{ skip: apply === false }
	);
	const { Topics, TopicsMessage } = useAppSelector((state: any) => state.techtips);

	useEffect(() => {
		dispatch(handleApply(true));
		refetch();
	}, [entries]);

	useEffect(() => {
		const TopElement = document.getElementById("Tech Tips");
		TopElement?.scrollIntoView();
	}, [selectedPageNumber, entries, Topics]);

	useEffect(() => {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({
				CategoryID: CategoryID,
				SubCategoryID: SubCategoryID,
				TopicID: TopicID,
				PageNumber: selectedPageNumber
			})
		);
	}, [selectedPageNumber]);

	useEffect(() => {
		setSelectedPageNumber(1);
	}, [SearchText]);

	return (
		<>
			{isFetching && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}

			{!isFetching &&
				(Topics && Topics.TotalPages > 0 ? (
					<>
						<div className="col-span-12 bg-white rounded-lg  overflow-auto">
							<table className="is-hoverable w-full text-left">
								<thead>
									<tr className="bg-[#E2E8F0]">
										<th className="whitespace-nowrap xl:text-sm text-xs+ bg-slate-200/50 font-semibold text-slate-800 px-1 py-3 w-1/12">
											ARTICLE ID
										</th>
										<th className=" whitespace-nowrap xl:text-sm text-xs+ bg-slate-200/50 font-semibold text-slate-800 px-1 py-3 w-5/12">
											TITLE
										</th>
										<th className=" whitespace-nowrap xl:text-sm text-xs+ bg-slate-200/50 font-semibold text-slate-800 px-1 py-3 w-3/12">
											SUBCATEGORY
										</th>
										<th className=" whitespace-nowrap xl:text-sm text-xs+ bg-slate-200/50 font-semibold text-slate-800 px-1 py-3 w-2/12">
											MODIFIED DATE
										</th>
										<th className=" whitespace-nowrap xl:text-sm text-xs+ bg-slate-200/50 font-semibold text-slate-800 py-3 w-1/12">
											ACTION
										</th>
									</tr>
								</thead>

								<tbody>
									{Topics.TechTipsData?.map((Artical: any) => (
										<Fragment key={Artical.ArticleID}>
											<tr className="bg-white border">
												<td className="whitespace-nowrap pl-4 py-3 sm:pl-5 w-1/12">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{Artical.ArticleID}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap truncate px-1 py-4 last:py-4 w-5/12">
													<div className="flex text-left">
														<button
															className="text-sm font-dmsans text-[#020A12]/60"
															onClick={() =>
																window.location.replace(
																	RedirectLinkArticleID(
																		Artical.ArticleID,
																		locationEndPoint
																	)
																)
															}
															title={Artical.Title}
														>
															{Artical.Title}
														</button>
													</div>
												</td>
												<td className="whitespace-nowrap px-1 py-4 last:py-4 w-3/12">
													<div className="flex text-left">
														<p className="text-sm font-dmsans text-[#020A12]/60">
															{Artical.SubCategory}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-1 py-4 last:py-4 w-2/12">
													<div className="flex text-left">
														<p className="text-xs+ font-dmsans text-[#020A12]/60">
															{Artical.ModifiedDate}
														</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-1 py-4 last:py-4 lg:pr-1 pr-0 w-1/12">
													<button
														className="flex justify-start cursor-pointer"
														title="View"
														onClick={() =>
															window.location.replace(
																RedirectLinkArticleID(
																	Artical.ArticleID,
																	locationEndPoint
																)
															)
														}
													>
														<Icon
															className="color-[#020A12]"
															icon="ic:outline-remove-red-eye"
														/>
													</button>
												</td>
											</tr>
										</Fragment>
									))}
								</tbody>
							</table>
						</div>
						{Topics?.TotalPages > 0 && (
							<Pagination
								PaginationData={Topics}
								count={100}
								pageNumber={selectedPageNumber}
								setPageNumber={setSelectedPageNumber}
								pageSize={entries}
								setPageSize={setEntries}
							/>
						)}
					</>
				) : (
					<>
						<div className="flex justify-center flex-col text-center items-center mx-auto py-10">
							<img
								className="h-40 my-auto"
								src="assets/images/Tiger_images/tiger-logoutX400.png"
								alt={TopicsMessage}
							/>
							<p className="text-xs+ text-[#020A12]/60">{TopicsMessage}</p>
						</div>
					</>
				))}
		</>
	);
};

export default Artical;
