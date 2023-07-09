import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import ElementPopper from "react-element-popper";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { SuggestTypeData } from "../@types";
import { HandleSearchText, useGetGetHiddenCategoriesListQuery, useSuggestMutation } from "../store";

function SearchHeaderSection() {
	const UserDetails = getLoggedUser();
	const location = useLocation();
	const navigate = useNavigate();
	const { GlobalSearchText, FilterContentType, FilterSubTopic, FilterSubCategory } = useAppSelector(
		(state: any) => state.searchReducer
	);
	const ref: any = useRef();
	const searchText = location.search.includes("Term")
		? location.search.split("?Term=")[1].split("&")[0]
		: GlobalSearchText;
	const [ShowPopper, setShowPopper] = useState<boolean>(false);
	const [SearchText, setSearchText] = useState<string>(decodeURIComponent(searchText));
	const [SuggestTableData, setSuggestTableData] = useState<SuggestTypeData[]>([]);
	const hiddenCategoryList = useGetGetHiddenCategoriesListQuery("");
	const [SuggestQuery] = useSuggestMutation();

	useEffect(() => {
		dispatch(HandleSearchText(decodeURIComponent(searchText)));
		setSearchText(decodeURIComponent(searchText));
	}, []);

	useEffect(() => {
		navigate(
			navigateLink.search + "?Term=" + GlobalSearchText
			// +
			// "&Type=" +
			// FilterContentType +
			// "&Categories=" +
			// FilterSubCategory +
			// "&Topic=" +
			// FilterSubTopic
		);
	}, [GlobalSearchText, FilterContentType, FilterSubCategory, FilterSubTopic]);

	const SuggestAPI = async () => {
		const { HiddenCategoryIds, HiddenSubcategoryIds } = hiddenCategoryList.data?.Data[0];
		const suggestData: any = await SuggestQuery({
			searchText: SearchText,
			Subcategory: FilterSubCategory,
			Subtopic: FilterSubTopic,
			AccountID: +UserDetails.AccountId,
			hiddenCategoryIds: HiddenCategoryIds,
			hiddenSubcategoryIds: HiddenSubcategoryIds,
			ContentType: FilterContentType === 0 ? -1 : FilterContentType
		});
		setSuggestTableData(suggestData.data?.Data);
	};

	useEffect(() => {
		if (hiddenCategoryList.data?.Data?.length > 0) SuggestAPI();
	}, [hiddenCategoryList, SearchText]);

	const handleSugesstionSelect = (value: string) => {
		dispatch(HandleSearchText(value));
		setSearchText(value);
	};
	const SearchOption = () => (
		<>
			{SuggestTableData?.length > 0 && (
				<div
					className={
						"border bg-white w-[" +
						document.getElementById("hearderSearch")?.offsetWidth +
						"px] rounded-lg shadow-soft bg-shadow-[0_0_6px#becadb] text-left"
					}
				>
					{SuggestTableData.filter((suggest: SuggestTypeData) => suggest.type === 1).length > 0 && (
						<div className="recent-search-p flex flex-col w-full text-slate-500">
							<span className="recent-search-h bg-slate-150 p-2 w-full text-xs+">Course</span>
							{SuggestTableData.filter((suggest: SuggestTypeData) => suggest.type === 1).map(
								(suggest: SuggestTypeData) => (
									<button
										onClick={() => handleSugesstionSelect(suggest.value)}
										className="recent-search-h p-2 w-full text-xs+ text-left line-clamp-2 hover:text-primary"
									>
										{suggest.value}
									</button>
								)
							)}
						</div>
					)}
					{SuggestTableData.filter((suggest: SuggestTypeData) => suggest.type === 3).length > 0 && (
						<div className="recent-search-p flex flex-col w-full text-slate-500">
							<span className="recent-search-h bg-slate-150 p-2 w-full text-xs+">Document</span>
							{SuggestTableData.filter((suggest: SuggestTypeData) => suggest.type === 3).map(
								(suggest: SuggestTypeData) => (
									<button
										onClick={() => handleSugesstionSelect(suggest.value)}
										className="recent-search-h p-2 w-full text-xs+ text-left line-clamp-2  hover:text-primary"
									>
										{suggest.value}
									</button>
								)
							)}
						</div>
					)}
				</div>
			)}
		</>
	);

	useEffect(() => {
		if (SearchText === "") dispatch(HandleSearchText(SearchText));
	}, [SearchText]);

	useEffect(() => {
		function handleClickOutside(e: any) {
			if (ref?.current && !ref?.current?.contains(e.target)) {
				setShowPopper(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<div className="relative flex flex-col rounded-lg justify center bg-slate-150 p-12 w-full gap-6">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col gap-4">
					<span className="text-[#000] font-bold text-[24px]">Search Courses and Documents </span>
					<span className="text-[#000] font-bold text-[24px]"></span>
					<span className="text-[#000] font-bold text-[24px]"></span>
				</div>
				<div>
					<img
						className="hidden lg:block absolute w-56 z-10 top-[-5%] right-[20%] h-40 aspect-ratio-[1/2]"
						src="assets/images/Tiger_images/tiger-crouchingX400.png"
						alt="tiger-crouchingX400.png"
					/>
				</div>
			</div>
			<ElementPopper
				ref={ref}
				active={ShowPopper}
				offsetY={5}
				offsetX={50}
				popperShadow
				popper={<SearchOption />}
				position={"bottom-start"}
				containerClassName="Header-search"
				containerStyle={{ display: "flex" }}
				element={
					<>
						<div
							className="relative w-full flex items-center h-14 bg-white border rounded-full"
							id="hearderSearch"
						>
							<input
								type="search"
								placeholder="Search"
								className="form-input py-2 px-2 h-full w-full text-sm text-black pl-11 rounded-full focus:outline-none focus:bg-white focus:text-gray-900"
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(e: any) => {
									if (e.key === "Enter") dispatch(HandleSearchText(SearchText));
								}}
								value={SearchText}
								onFocus={() => setShowPopper(true)}
							/>
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<button className="focus:outline-none focus:shadow-outline text-black cursor-default">
									<Icon icon="uil:search" width="16" height="16" color="#697179" />
								</button>
							</span>
							<button
								className="w-44 h-10 text-xs+ font-normal rounded-fill bg-[#1268B3] text-[#FFFFFF] mr-3 rounded-full"
								onClick={() => dispatch(HandleSearchText(SearchText))}
							>
								Find Result
							</button>
						</div>
					</>
				}
			/>
		</div>
	);
}

export default SearchHeaderSection;
