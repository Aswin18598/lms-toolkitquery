import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { CatalogApi } from "../store";

function CataloglibraryPage() {
	const category = CatalogApi.endpoints.getCategories.useQuery();
	const [searchParams, setSearchParams] = useSearchParams();
	const [activeLibrary, setActiveLibrary] = useState<string>("all");

	const getFilterData = () => {
		if (activeLibrary === "all") return category.data?.Data?.getCategories;
		return category.data?.Data?.getCategories?.filter((cat: any) => cat.MasterCategoryName === activeLibrary);
	};

	const handleLibraryClick = (lib: string) => {
		setSearchParams({ lib });
	};

	useEffect(() => {
		setActiveLibrary(searchParams.get("lib") || "all");
	}, [searchParams]);

	return (
		<div className="flex flex-col w-full space-y-4 p-4">
			<section className="flex flex-col gap-5 p-8 bg-white">
				<div className="flex flex-col">
					<h3 className="text-3xl font-semibold">Library</h3>
					<p className="text-sm+">Select a software or domain category to see the courses offered.</p>
				</div>
				{!category.isLoading && (
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleLibraryClick("all")}
							className={classNames("text-sm font-medium px-2.5 py-0.5 rounded hover:bg-slate-200", {
								"bg-primary text-white focus:bg-primary": activeLibrary === "all",
								"bg-slate-150 text-slate-800": activeLibrary !== "all"
							})}
						>
							All
						</button>
						{category.data?.Data?.getMasterCategories.map((mCategory: any) => (
							<button
								key={mCategory?.ID}
								onClick={() => handleLibraryClick(mCategory.MasterCategoryName)}
								className={classNames("text-sm font-medium px-2.5 py-0.5 rounded hover:bg-slate-200", {
									"bg-primary text-white focus:bg-primary":
										activeLibrary === mCategory.MasterCategoryName,
									"bg-slate-150 text-slate-800": activeLibrary !== mCategory.MasterCategoryName
								})}
							>
								{mCategory.MasterCategoryName}
							</button>
						))}
					</div>
				)}
			</section>

			<section className="flex-1 overflow-auto">
				{category.isLoading && (
					<div className="grid h-full w-full place-content-center">
						<Spinner />
					</div>
				)}
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
					{getFilterData()?.map((catagory: any) => (
						<Link
							key={catagory.CategoryID}
							to={`/catalog/course/?cat_id=${catagory.CategoryID}`}
							className="card flex flex-col place-items-center hover:bg-primary/10"
						>
							<div className="flex-1 grid place-items-center p-5">
								<img
									className="object-center"
									width={250}
									height={150}
									src={`${import.meta.env.VITE_APP_IMG_URL}${catagory.CategoryImageFileName}`}
									alt=" "
								/>
							</div>
							<h3 className="py-2 flex-shrink-0 pb-5">{catagory.CategoryName}</h3>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}

export default CataloglibraryPage;
