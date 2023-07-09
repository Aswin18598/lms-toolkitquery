import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useAppSelector } from "~/config/store";
import { useGetCatalogListQuery } from "~/features/dashboard/store";
import { Icon } from "@iconify/react";
import { Spinner } from "~/components/spinner";
import { useNavigate } from "react-router-dom";
import { navigateLink } from "~/config/api/links";
import { useDispatch } from "react-redux";
// import { setSelectedCatagoryID } from "~/features/learning/store";
const ResizePlugin = (slider: any) => {
	const observer = new ResizeObserver(function () {
		slider.update();
	});

	slider.on("created", () => {
		observer.observe(slider.container);
	});
	slider.on("destroyed", () => {
		observer.unobserve(slider.container);
	});
};
const Catalog = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	const { isLoading } = useGetCatalogListQuery("a");
	const [currentSlide, setCurrentSlide] = useState(0);
	const [selectedCatalog, setSelectedCatalog] = useState();
	const { catalogList } = useAppSelector((state: any) => state.dashboard);
	const [distinctCatalog, setDistinctCatalog] = useState([]);
	const [catalogDetails, setCatalogDetails] = useState([]);
	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
		{
			initial: 1,
			loop: false,
			slideChanged(s) {
				setCurrentSlide(s.track.details.rel);
			},
			breakpoints: {
				"(min-width: 400px)": {
					slides: { perView: 2, spacing: 24 }
				},
				"(min-width: 992px)": {
					slides: { perView: 3, spacing: 24 }
				},
				"(min-width: 1200px)": {
					slides: { perView: 5, spacing: 24 }
				}
			}
		},
		[ResizePlugin]
	);

	useEffect(() => {
		setDistinctCatalog(Array.from(new Set(catalogList.map(({ CatalogCategoryName }: any) => CatalogCategoryName))));
	}, [catalogList]);

	useEffect(() => {
		setSelectedCatalog(distinctCatalog[0]);
	}, [distinctCatalog]);

	useEffect(() => {
		setCatalogDetails(catalogList.filter((item: any) => item.CatalogCategoryName === selectedCatalog));
		setTimeout(() => instanceRef.current?.update(), 10);
	}, [selectedCatalog]);

	const handleRedirect = (CategoryID: number) => {
		navigate(navigateLink.learning + "?Catalog-1", { state: { CategoryID: CategoryID } });
	};

	return (
		<div className="w-full">
			<div className="flex items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Catalog</h2>
			</div>
			<div className="flex-wrap tabs-list p-1 gap-2 rounded-lg bg-slate-150 flex w-fit">
				{isLoading && <Spinner />}
				{!isLoading &&
					distinctCatalog.map((catalog: any) => (
						<button
							key={catalog}
							onClick={() => {
								setSelectedCatalog(catalog);
							}}
							className={`px-[10px] py-[7px] text-slate-500 rounded-lg text-[14px] font-bold my-1 ${
								selectedCatalog === catalog && "bg-white p-4 dark:bg-navy-700"
							}`}
						>
							{catalog}
						</button>
					))}
			</div>
			<div className="mt-6">
				<div className="relative">
					<div className="flex keen-slider overflow-hidden w-full" ref={sliderRef}>
						{!isLoading &&
							catalogDetails.map((item: any, index: number) => (
								<button
									key={index}
									title={"View Detail"}
									className={`bg-white border border-gray-200 px-5 py-5 flex flex-col items-center justify-between rounded-lg max-h-[200px]  keen-slider__slide number-slide${index}  `}
									onClick={() => handleRedirect(item.CategoryID)}
								>
									<img
										src={imageUrl + item.CategoryImageFileName}
										alt="profile"
										className="h-3/5 "
										onError={({ currentTarget }) => {
											currentTarget.onerror = null;
											currentTarget.src = "assets/images/user-pic.svg";
										}}
									/>
									<div className="flex flex-col  h-2/5 justify-center">
										<span className="mt-[6px] line-clamp-1 text-base font-medium text-slate-600 dark:text-navy-100">
											{item.CategoryName}
										</span>
										<span className=" mt-1 text-xs+ text-slate-400 dark:text-navy-300">
											{item.CourseCount} courses
										</span>
									</div>
								</button>
							))}
					</div>
					{!isLoading && catalogDetails.length > 5 && currentSlide !== 0 && (
						<button
							title="Previous"
							className="flex items-center justify-center cursor-pointer shadow-[0px_0px_7px] shadow-[#00000017] bg-white w-[52px] h-[52px] rounded-[50%] top-[50%] absolute translate-y-[-50%] left-[-1.75%]"
							onClick={() => instanceRef?.current?.prev()}
						>
							<Icon icon="majesticons:chevron-left-line" width="24px" height="24px" />
						</button>
					)}

					{!isLoading && catalogDetails.length > 5 && currentSlide !== catalogDetails?.length - 5 && (
						<button
							title="Next"
							className="flex items-center justify-center cursor-pointer w-[52px] shadow-[0px_0px_7px] shadow-[#00000017] bg-white h-[52px] rounded-[50%] top-[50%] absolute   translate-y-[-50%] right-[-1.75%]"
							onClick={() => instanceRef?.current?.next()}
						>
							<Icon icon="majesticons:chevron-right-line" width="24px" height="24px" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Catalog;
