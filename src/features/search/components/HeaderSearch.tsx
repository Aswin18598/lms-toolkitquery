import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import ElementPopper from "react-element-popper";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { dispatch, useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import { SuggestTypeData } from "../@types";
import {
	HandleFilterContentType,
	HandleFilterSubCategory,
	HandleFilterSubTopic,
	HandleSearchText,
	useGetGetHiddenCategoriesListQuery,
	useSuggestMutation
} from "../store";

interface IHeaderSearchProps {
	isMobileSearchBtnClicked?: boolean;
	setIsMobileSearchBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
function HeaderSearch(props: IHeaderSearchProps) {
	const { isMobileSearchBtnClicked, setIsMobileSearchBtnClicked } = props;
	const UserDetails = getLoggedUser();
	const location = useLocation();
	const navigate = useNavigate();
	const { GlobalSearchText, FilterContentType, FilterSubTopic, FilterSubCategory } = useAppSelector(
		(state: any) => state.searchReducer
	);
	const ref: any = useRef();
	const globalSearchRef: any = useRef();
	const [ShowPopper, setShowPopper] = useState<boolean>(false);
	const [SuggestTableData, setSuggestTableData] = useState<SuggestTypeData[]>([]);
	const hiddenCategoryList = useGetGetHiddenCategoriesListQuery("");
	const [SuggestQuery] = useSuggestMutation();

	const SuggestAPI = async () => {
		const { HiddenCategoryIds, HiddenSubcategoryIds } = hiddenCategoryList.data?.Data[0];
		const suggestData: any = await SuggestQuery({
			searchText: GlobalSearchText,
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
		if (hiddenCategoryList.data?.Data?.length > 0 && !location?.pathname.includes("search")) SuggestAPI();
	}, [hiddenCategoryList, GlobalSearchText]);

	const handleInputChange = (event: any) => {
		dispatch(HandleSearchText(event.target.value));
	};

	const handleNavigate = (event: any) => {
		if (event.key === "Enter" && GlobalSearchText.length > 0) {
			navigate(navigateLink.search + "?Term=" + GlobalSearchText);
			if (isMobileSearchBtnClicked) {
				setIsMobileSearchBtnClicked(false);
			}
		}
	};
	const handleMobileSearchBtnClick = () => {
		if (isMobileSearchBtnClicked && GlobalSearchText.length > 0) {
			navigate(navigateLink.search + "?Term=" + GlobalSearchText);
			setIsMobileSearchBtnClicked(false);
		}
	};

	const handleSugesstionSelect = (value: string) => {
		dispatch(HandleSearchText(value));
		navigate(navigateLink.search + "?Term=" + value);
	};

	useEffect(() => {
		if (!location?.pathname.includes("search")) {
			dispatch(HandleSearchText(""));
			dispatch(HandleFilterContentType(0));
			dispatch(HandleFilterSubTopic(""));
			dispatch(HandleFilterSubCategory(""));
		}
	}, [location]);
	useEffect(() => {
		if (globalSearchRef.current && isMobileSearchBtnClicked) {
			globalSearchRef?.current.focus();
		}
	}, []);

	const SearchOption = () => (
		<>
			{SuggestTableData?.length > 0 && (
				<div className="border bg-white w-56 rounded-lg shadow-soft bg-shadow-[0_0_6px#becadb] text-left">
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
		function handleClickOutside(e: any) {
			if (ref?.current && !ref?.current?.contains(e.target)) {
				setShowPopper(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<>
			{location?.pathname !== "/search" && (
				<ElementPopper
					ref={ref}
					active={ShowPopper}
					offsetY={12}
					popperShadow
					popper={<SearchOption />}
					position={"bottom-start"}
					containerClassName={`Header-search ${isMobileSearchBtnClicked ? "w-full" : ""}`}
					containerStyle={{ display: "flex" }}
					element={
						<div
							className={`relative mr-4  h-8 ${
								isMobileSearchBtnClicked ? "flex  w-full" : "hidden"
							} sm:flex`}
						>
							<input
								placeholder="Search"
								className={`${
									isMobileSearchBtnClicked ? "w-full" : "w-56"
								} form-input peer h-full rounded-full bg-slate-150 px-4 pl-9 text-xs+ text-slate-800 ring-primary/50 hover:bg-slate-200 focus:none dark:bg-navy-900/90 dark:text-navy-100 dark:placeholder-navy-300 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900`}
								type="search"
								value={decodeURIComponent(GlobalSearchText)}
								onFocus={() => setShowPopper(true)}
								onChange={handleInputChange}
								onKeyDown={handleNavigate}
								ref={globalSearchRef}
							/>
							<div
								className={`${
									isMobileSearchBtnClicked ? "" : "pointer-events-none"
								} absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent`}
							>
								<Icon
									icon="mingcute:search-line"
									className="h-5 w-5 transition-colors duration-200"
									onClick={handleMobileSearchBtnClick}
								/>
							</div>
						</div>
					}
				/>
			)}
		</>
	);
}

export default HeaderSearch;
