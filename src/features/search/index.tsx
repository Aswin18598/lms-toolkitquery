import { useEffect, useState } from "react";
import { useAppSelector } from "~/config/store";
import { getLoggedUser } from "~/helpers/auth";
import FilterSelectionHeader from "./components/FilterSelectionHeader";
import SearchFilterSection from "./components/SearchFilterSection";
import SearchHeaderSection from "./components/SearchHeaderSection";
import SearchTableView from "./components/SearchTableView";
import { useGetGetHiddenCategoriesListQuery, useGetMoreFacetsMutation, useSearchMutation } from "./store";

function SearchPage() {
	const { GlobalSearchText, PageSize, PageNumber, FilterContentType, FilterSubTopic, FilterSubCategory } =
		useAppSelector((state: any) => state.searchReducer);
	const [SearchTableData, setSearchTableData] = useState<any[]>([]);
	const [ContentTypeData, setContentTypeData] = useState<any[]>([]);
	const [CategoryTypeData, setCategoryTypeData] = useState<any[]>([]);
	const [TopicTypeData, setTopicTypeData] = useState<any[]>([]);
	const [HiddenCategoryIds, setHiddenCategoryIds] = useState<string>("");
	const [HiddenSubcategoryIds, setHiddenSubcategoryIds] = useState<string>("");
	const UserDetails = getLoggedUser();
	const hiddenCategoryList = useGetGetHiddenCategoriesListQuery("");
	const [searchQuery, searchQueryOption] = useSearchMutation();
	const [GetMoreFacetsQuery, GetMoreFacetsQueryOption] = useGetMoreFacetsMutation();
	const [APIResultCount, setAPIResultCount] = useState<number>(0);
	const [APIFetching, setAPIFetching] = useState<boolean>(
		searchQueryOption.isLoading || GetMoreFacetsQueryOption.isLoading
	);

	useEffect(() => {
		setAPIFetching(searchQueryOption.isLoading || GetMoreFacetsQueryOption.isLoading);
	}, [searchQueryOption.isLoading, GetMoreFacetsQueryOption.isLoading]);

	async function SearchAPI() {
		const { HiddenCategoryIds, HiddenSubcategoryIds } = hiddenCategoryList.data?.Data[0];
		setHiddenCategoryIds(HiddenCategoryIds);
		setHiddenSubcategoryIds(HiddenSubcategoryIds);
		const searchData: any = await searchQuery({
			Text: GlobalSearchText,
			Subcategory: FilterSubCategory,
			Subtopic: FilterSubTopic,
			AccountID: +UserDetails.AccountId,
			HiddenCategoryIds: HiddenCategoryIds,
			HiddenSubcategoryIds: HiddenSubcategoryIds,
			page: PageNumber,
			pageSize: PageSize,
			ContentType: FilterContentType
		});
		const { contentType, subcategoryName, subtopic } = searchData.data?.Data?.facets;
		setAPIResultCount(searchData.data?.Data?.Total);
		setSearchTableData(searchData.data?.Data?.value);
		setContentTypeData(contentType);
		setCategoryTypeData(subcategoryName);
		setTopicTypeData(subtopic);
	}

	const handleGetMoreFacets = async (FacetName: string) => {
		const getMoreFacetsData: any = await GetMoreFacetsQuery({
			FacetName: FacetName,
			Text: GlobalSearchText,
			Subcategory: FilterSubCategory,
			Subtopic: FilterSubTopic,
			AccountID: UserDetails.AccountId,
			HiddenCategoryIds: HiddenCategoryIds,
			HiddenSubcategoryIds: HiddenSubcategoryIds,
			page: PageNumber,
			pageSize: PageSize,
			ContentType: FilterContentType
		});
		const { contentType, subcategoryName, subtopic } = getMoreFacetsData.data?.Data?.moreFacets;
		setContentTypeData(contentType);
		setCategoryTypeData(subcategoryName);
		setTopicTypeData(subtopic);
	};

	useEffect(() => {
		if (hiddenCategoryList.data?.Data?.length > 0) {
			SearchAPI();
		}
	}, [
		hiddenCategoryList,
		GlobalSearchText,
		FilterContentType,
		FilterSubTopic,
		FilterSubCategory,
		PageNumber,
		PageSize
	]);

	return (
		<>
			<section className="main flex flex-col mx-14 my-8">
				<SearchHeaderSection />
				<div className="flex flex-row mt-10 gap-6">
					<div className="w-1/4">
						<SearchFilterSection
							handleGetMoreFacets={handleGetMoreFacets}
							ContentTypeData={ContentTypeData}
							CategoryTypeData={CategoryTypeData}
							TopicTypeData={TopicTypeData}
						/>
					</div>

					<div className="flex flex-col gap-6 w-3/4">
						<FilterSelectionHeader SearchTableDataCount={APIResultCount} />
						<SearchTableView
							SearchTableData={SearchTableData}
							APIFetching={APIFetching}
							APIResultCount={APIResultCount}
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export default SearchPage;
