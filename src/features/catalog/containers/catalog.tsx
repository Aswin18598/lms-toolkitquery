import React from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToggle, useWindowSize } from "react-use";

import { Spinner } from "~/components/spinner";
import { CatalogFilter, Ratings } from "../components";

import { CatalogApi } from "../store";

function CourseCatalogPage() {
	const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
	const [fetchCatalog, catalog] = CatalogApi.endpoints.getCatalog.useLazyQuery();
	const navigate = useNavigate();
	const { width } = useWindowSize();
	const [searchParams, setSearchParams] = useSearchParams();

	const [on, toggle] = useToggle(width < 1024 ? false : true);

	React.useEffect(() => {
		fetchCatalog({
			filter: {
				catagoryId: searchParams.get("cat_id") || "-1"
			}
		});
	}, []);

	if (catalog.isLoading || catalog.isError) {
		return (
			<div className="grid h-full w-full place-content-center">
				{catalog.isError && <p className="center">Error: {catalog.isError}</p>}
				{catalog.isLoading && <Spinner />}
			</div>
		);
	}

	if (!catalog.data?.Data) {
		return (
			<div className="grid h-full w-full place-content-center">
				<img src="/tiger-thinking-1.png" alt="" width="300" />
				<p className="text-[#25313D] text-lg font-semibold mb-3">Something Went Wrong. Try Again</p>
				<button
					className="hover:(bg-gray-50) rounded text-[#020A1299] border bg-white py-2 px-3 font-medium font-sm"
					onClick={() => navigate(0)}
				>
					Refresh
				</button>
			</div>
		);
	}

	return (
		<main className="main w-full h-full flex flex-col">
			<section className="flex flex-col px-[var(--margin-x)] sm:px-8">
				<ul className="flex flex-wrap items-center space-x-2 text-sm pt-4 mb-2 md:pt-5 lg:pt-6">
					<li className="flex items-center space-x-2">
						<Link
							className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
							to="/catalog"
						>
							Course Library
						</Link>
						<Icon icon="mingcute:right-line" className="h-4 w-4" />
					</li>
					<li>Course Catalog</li>
				</ul>
				<div className="flex items-center justify-between pb-3">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-3xl">Course Catalog</h2>
					<div className="flex gap-2">
						{catalog.data?.Data && (
							<button onClick={toggle} className="btn w-8 h-8 p-0 rounded-md hover:bg-slate-300/20">
								<Icon
									icon="mingcute:filter-2-line"
									className="w-5.5 h-5.5 transition-colors duration-200"
								/>
							</button>
						)}
					</div>
				</div>
				<CatalogFilter
					isOpen={on}
					onClose={() => toggle(false)}
					handleApplyFilter={(filter: any) => {
						fetchCatalog({ filter });
						setSearchParams({});
					}}
				/>
			</section>
			<section className="overflow-auto px-[var(--margin-x)] h-full sm:px-8 pb-8 relative">
				{catalog.isFetching && (
					<div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
						<Spinner size="5" />
					</div>
				)}
				{!catalog.data?.Data?.catalogCourses && (
					<div className="h-full flex flex-col items-center justify-center">
						<img src="/tiger-thinking-1.png" alt="" width={250} />
						<p className="pt-4 text-xl">Sorry, No courses available for the selected Role and Software</p>
					</div>
				)}
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
					{catalog.data?.Data?.catalogCourses?.map((course: any) => (
						<Link
							to={`/catalog/course/${course.CourseID}`}
							key={course.CourseID}
							className="card w-full flex flex-col gap-3 shrink-0 justify-between rounded-xl p-4"
						>
							<div className="flex items-center justify-center">
								<img
									className="rounded-md h-40 w-fullobject-cover object-center"
									src={`${import.meta.env.VITE_APP_IMG_URL}${course?.InitialGraphic}`}
									alt="sd"
								/>
							</div>
							<div className="block space-y-3 text-base">
								<span
									title={course?.CategoryName}
									className="badge font-semibold text-xs+ bg-info/20 text-info px-2 py-1 rounded-md"
								>
									{course?.CategoryName}
								</span>
								<p title={course.Title} className="text-base text-slate-600 font-semibold line-clamp-2">
									{course.Title}
								</p>
							</div>
							<div className="flex items-center text-sm space-x-2">
								<span>{course?.TotalLessons || 0} lessons</span>
								<span className="bg-gray-200 w-1.5 h-1.5 rounded-full" />
								<span>{course?.OnlineHours || 0} hrs</span>
								<span className="bg-gray-200 w-1.5 h-1.5 rounded-full" />
								<span>{course?.SkillLevel}</span>
							</div>
							<div className="flex items-center justify-between">
								<Ratings rating={course?.AverageRating || 0} />
								<a
									onClick={e => e.stopPropagation()}
									target="_blank"
									href={`${PreprodUrl}iGETIT2/Api/${course.ItemID}?PathID=-1&From=Catalog&type=1`}
									className="hidden btn h-7 w-7 rounded-full bg-slate-150 p-0 text-slate-800 hover:bg-slate-300"
									rel="noreferrer"
								>
									<Icon icon="mingcute:arrow-right-line" className="w-4 h-4 -rotate-45" />
								</a>
							</div>
							<p className="line-clamp-4 h-20">{course?.Overview}</p>

							<button className="btn mt-3 border py-2.5 border-primary text-primary hover:bg-primary hover:text-white">
								View more
							</button>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}

export default CourseCatalogPage;
