import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { dispatch, useAppSelector } from "~/config/store";
import { TypeData } from "../@types";
import { HandleFilterContentType, HandleFilterSubCategory, HandleFilterSubTopic } from "../store";

const FilterTitleData = ["Filter by Content Type", "Filter by Categories", "Filter by Topics"];

interface IProps {
	TopicTypeData: TypeData[];
	CategoryTypeData: TypeData[];
	ContentTypeData: TypeData[];
	handleGetMoreFacets: (FacetName: string) => Promise<void>;
}

const SearchFilterSection = ({ TopicTypeData, CategoryTypeData, ContentTypeData, handleGetMoreFacets }: IProps) => {
	const [GetMoreFacets, setGetMoreFacets] = useState<string[]>([]);
	const [FilterSectionType, setFilterSectionType] = useState<number>(0);
	const { FilterContentType, FilterSubTopic, FilterSubCategory, GlobalSearchText } = useAppSelector(
		(state: any) => state.searchReducer
	);

	const HandleFilterSectionTypes = (
		Title: string,
		Section: string[],
		setSection: React.Dispatch<React.SetStateAction<string[]>>
	) => {
		let sectionType = Section;
		if (sectionType.includes(Title)) {
			sectionType.splice(sectionType.indexOf(Title), 1);
		} else {
			sectionType.push(Title);
		}
		setSection(sectionType);
	};

	const handleMoreFacets = (FacetName: string, Title: string) => {
		handleGetMoreFacets(FacetName);
		HandleFilterSectionTypes(Title, GetMoreFacets, setGetMoreFacets);
	};

	useEffect(() => {
		setGetMoreFacets([]);
	}, [GlobalSearchText]);

	return (
		<div className="flex flex-col gap-6">
			{FilterTitleData.map((title: string, index: number) => (
				<div className="flex flex-col bg-white text-sm+ font-bold px-4 py-3 rounded-lg gap-6" key={title}>
					<button
						className="flex items-center justify-between"
						onClick={() =>
							FilterSectionType !== index ? setFilterSectionType(index) : setFilterSectionType(-1)
						}
						// onClick={() => HandleFilterSectionTypes(title, FilterSectionType, setFilterSectionType)}
					>
						<span>{title}</span>
						<Icon
							className="w-6 h-6"
							icon="ic:round-keyboard-arrow-down"
							rotate={FilterSectionType === index ? 2 : 0}
							// rotate={!FilterSectionType.includes(title) ? 0 : 2}
						/>
					</button>
					{title === FilterTitleData[0] &&
						FilterSectionType === index &&
						ContentTypeData.map((content: any) => (
							<button
								className="flex items-center justify-start font-medium text-left"
								key={content.value}
							>
								<input
									className="form-radio is-basic h-4 w-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
									type="checkbox"
									onChange={() => dispatch(HandleFilterContentType(content.value))}
									checked={content.value === FilterContentType}
								/>
								<span className="ml-2">
									{(content.value === 1 ? "Course" : "Document") + "  (" + content.count + ")"}
								</span>
							</button>
						))}
					{title === FilterTitleData[2] && FilterSectionType === index && (
						<>
							{TopicTypeData.map((content: any) => (
								<button
									className="flex items-center justify-start font-medium text-left"
									key={content.value}
								>
									<input
										className="form-radio is-basic h-4 w-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
										type="checkbox"
										onChange={() => dispatch(HandleFilterSubTopic(content.value))}
										checked={content.value === FilterSubTopic}
									/>
									<span className="ml-2">{content.value + "  (" + content.count + ")"}</span>
								</button>
							))}
							{TopicTypeData.length > 0 && !GetMoreFacets.includes(title) && (
								<button onClick={() => handleMoreFacets("subtopic", title)}>See all Topics</button>
							)}
						</>
					)}
					{title === FilterTitleData[1] && FilterSectionType === index && (
						<>
							{CategoryTypeData.map((content: any) => (
								<button
									className="flex items-center justify-start font-medium text-left"
									key={content.value}
								>
									<input
										className="form-radio is-basic h-4 w-4 rounded-full border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
										type="checkbox"
										onChange={() => dispatch(HandleFilterSubCategory(content.value))}
										checked={content.value === FilterSubCategory}
									/>
									<span className="ml-2">{content.value + "  (" + content.count + ")"}</span>
								</button>
							))}
							{CategoryTypeData.length > 0 && !GetMoreFacets.includes(title) && (
								<button onClick={() => handleMoreFacets("subcategoryName", title)}>
									See all Categories
								</button>
							)}
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default SearchFilterSection;
