import { Page } from "~/components";
import SearchBar from "./components/SearchBar";
import Catagory from "./components/Catagory";
import SubCatagory from "./components/SubCatagory";
import Topics from "./components/Topics";
import Artical from "./components/Artical";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { getLoggedUser } from "~/helpers/auth";
import {
	handleCategorySubCategoryIDTopicIDPageNum,
	handleApply,
	getCategorySubCategoryIDTopicIDPageNum,
	useGetTechTipSubcategoryQuery,
	useGetTechTipCategoryQuery,
	useGetUserPreferencesQuery
} from "~/features/techtips/store";
import { useDispatch, useSelector } from "react-redux";
import DefaultSubCategory from "./components/DefaultSubCategory";

function TechTipsPage() {
	const { UserId } = getLoggedUser();
	const [isFilter, setIsFilter] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const dispatch = useDispatch();
	const CategorySubCategoryIDTopicIDPageNum = useSelector(getCategorySubCategoryIDTopicIDPageNum);
	const SubCategoryID = CategorySubCategoryIDTopicIDPageNum["SubCategoryID"];
	const CategoryID = CategorySubCategoryIDTopicIDPageNum["CategoryID"];
	const TopicID = CategorySubCategoryIDTopicIDPageNum["TopicID"];
	useGetTechTipSubcategoryQuery({ UserID: UserId, CategoryID });
	useGetTechTipCategoryQuery(UserId);

	function apply(): void {
		dispatch(handleApply(true));
	}

	function filterClick(): void {
		dispatch(
			handleCategorySubCategoryIDTopicIDPageNum({ CategoryID: -1, SubCategoryID: -1, TopicID: -1, PageNumber: 1 })
		);
		dispatch(handleApply(true));
		setIsFilter(!isFilter);
	}

	const handleSetDefault = () => {
		setIsDisabled(!isDisabled);
	};

	return (
		<Page title="Tech Tips">
			<div className="flex items-center justify-between mb-5">
				<div className="w-[65%] sm:w-[40%]">
					<SearchBar />
				</div>
				<div className="w-20 h-10 flex justify-end">
					<button className="btn bg-white border" onClick={() => filterClick()}>
						<span className="mr-2">
							<Icon icon="ic:round-filter-list" width="16" height="16" color="#020A12" />
						</span>
						<span className="text-[#020A12] text-sm"></span>Filter
					</button>
				</div>
			</div>
			{isFilter && (
				<>
					<div className="mb-4">
						<div className="text-[#475569] font-bold">Filter</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
						<Catagory UserID={UserId} isDisabled={isDisabled} />

						<SubCatagory UserID={UserId} isDisabled={isDisabled} />

						<Topics isDisabled={isDisabled} />

						<DefaultSubCategory UserID={UserId} />
					</div>
					{/* <input className="mr-2" type="checkbox" checked={isDisabled} onChange={handleSetDefault} />
						<div className="text-sm">Set this as default filter view</div> */}
					<div className="flex my-4">
						<button
							className="btn bg-[#1268B3] text-[#FFFFFF] rounded-full text-sm"
							onClick={() => apply()}
						>
							Apply
						</button>
						<button
							className="btn text-sm"
							onClick={() =>
								dispatch(
									handleCategorySubCategoryIDTopicIDPageNum({
										CategoryID: -1,
										SubCategoryID: -1,
										TopicID: -1,
										PageNumber: 1
									})
								)
							}
						>
							Cancel
						</button>
					</div>
				</>
			)}

			<div>
				<Artical UserID={UserId} />
			</div>
		</Page>
	);
}

export default TechTipsPage;
