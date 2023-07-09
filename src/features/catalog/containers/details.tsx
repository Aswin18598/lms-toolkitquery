import { Icon } from "@iconify/react";
import classNames from "classnames";
import _ from "lodash";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Timeago from "react-timeago";
import { useToggle } from "react-use";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
// import { useEffect, useState } from "react";
// import { useGetCatalogCurriculumQuery, useGetCatalogDetailsQuery } from "../store";
import { useGetCatalogDetailsQuery } from "../store";
// import { useGetCheckTrialUserQuery } from "~/features/headersandmenu/store";
// import { useAppSelector } from "~/config/store";

function CurriculumItem({ title, content }: any) {
	const [on, toggle] = useToggle(false);
	return (
		<div className="flex flex-col">
			<button className="flex items-center gap-3 text-primary p-3" onClick={toggle}>
				<Icon
					icon={on ? "mingcute:minimize-line" : "mingcute:close-line"}
					className={classNames("w-4 h-4", {
						"rotate-45": !on
					})}
				/>
				<h3 className="flex flex-col items-start md:flex-row md:items-center md:justify-between w-full">
					<span className="font-medium text-base text-left line-clamp-1">{title}</span>
					<span className="font-light text-base text-right line-clamp-1">{content?.length || 0} lessons</span>
					<div className="hidden flex items-center text-sm space-x-2 text-slate-400">
						<span className="bg-gray-300 w-1.5 h-1.5 rounded-full" />
						<span>1hr 00m</span>
					</div>
				</h3>
			</button>
			{on && (
				<div className="flex flex-col bg-gray-100 py-2">
					{content.map((con: any) => (
						<div className="flex items-center gap-2 py-2 px-3 text-gray-500" onClick={toggle}>
							<Icon icon="mingcute:notebook-line" className="w-4 h-4" />
							<h3 className="text-sm flex flex-col items-start md:flex-row md:items-center md:justify-between w-full">
								<span className="line-clamp-1">{con.DocTitle}</span>
								<div className="hidden flex items-center space-x-2 text-slate-400">
									<span>1hr 00m</span>
								</div>
							</h3>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// function Curriculum() {
// 	const params = useParams();
// 	const curriculum = useGetCatalogCurriculumQuery(params?.catalogId);
// 	return (
// 		<div className="card p-4">
// 			<div className="flex items-center justify-between">
// 				<h3 className="text-lg text-slate-800">Curriculum</h3>
// 				<button className="hidden text-sm text-primary flex items-center gap-2 rounded-md hover:bg-primary/70 hover:text-white px-4 py-2">
// 					<Icon icon="mingcute:download-2-line" className="w-3.5 h3.5" />
// 					<span>Download Contents</span>
// 				</button>
// 			</div>
// 			<div className="grid border my-2 divide-y">
// 				{_.keys(_.groupBy(curriculum.data?.Data, (car: any) => car.UnitTitle))?.map((cur: any) => (
// 					<CurriculumItem
// 						key={cur}
// 						title={cur}
// 						content={_.groupBy(curriculum.data?.Data, (car: any) => car.UnitTitle)[cur]}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

function CatalogDetails() {
	const params = useParams();
	// const imageUrl = import.meta.env.VITE_APP_IMG_URL;
	// const PreprodUrl = import.meta.env.VITE_PREPROD_URL;
	const { isLoading, data } = useGetCatalogDetailsQuery(params?.catalogId);
	// const [Exist, setExist] = useState<boolean>(false);
	const user: any = getLoggedUser();
	const navigate = useNavigate();
	const location = useLocation();
	// const locationEndPoint = location.pathname.replace("/", "");
	// useGetCheckTrialUserQuery(user.UserId);
	// const { TrialUser } = useAppSelector((state: any) => state.headersandmenuReducer);

	// const downloadZip = (file: string) => {
	// 	const a = document.createElement("a");
	// 	a.setAttribute("download", "Resources.zip");
	// 	a.href = file;
	// 	a.setAttribute("target", "_blank");
	// 	document.body.appendChild(a);
	// 	a.click();
	// 	document.body.removeChild(a);
	// };

	// const FileExistCheck = () => {
	// 	fetch(imageUrl + data.Data[0].Filename)
	// 		.then((res: any) => {
	// 			setExist(true);
	// 		})
	// 		.catch((error: any) => {
	// 			setExist(false);
	// 		});
	// };

	// useEffect(() => {
	// 	if (data?.Data && data?.Data[0]?.Filename !== "") FileExistCheck();
	// }, [data]);

	if (isLoading) {
		return (
			<div className="grid h-full w-full place-content-center">
				<Spinner />
			</div>
		);
	}

	return (
		<main className="main w-full h-full flex flex-col">
			<ul className="flex flex-wrap items-center space-x-2 my-5 px-[var(--margin-x)] text-sm sm:px-8">
				<li className="flex items-center space-x-2">
					<Link
						className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
						to="/catalog"
					>
						Course Library
					</Link>
					<Icon icon="mingcute:right-line" className="h-4 w-4" />
				</li>
				<li className="flex items-center space-x-2">
					<Link
						className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
						to={`/catalog/course/?cat_id=${data.Data.CommonCourseCatalog.CategoryID || "-1"}`}
					>
						{data.Data.CommonCourseCatalog.CategoryName}
					</Link>
					<Icon icon="mingcute:right-line" className="h-4 w-4" />
				</li>
				<li>{data.Data.CommonCourseCatalog.Title}</li>
			</ul>
			<div className="flex flex-col overflow-auto px-[var(--margin-x)] sm:px-8 pb-8">
				<section className="card bg-white flex flex-col m-0 p-4 md:flex-row justify-between gap-5">
					<div className="flex flex-col md:p-6 lg:p-10 gap-0.5">
						<h2 className="text-base text-primary font-bold">
							{data.Data.CommonCourseCatalog.CategoryName}
						</h2>
						<h1 className="text-lg md:text-xl text-slate-800 mt-1">
							{data.Data.CommonCourseCatalog.Title}
						</h1>
						<div className="flex flex-col text-sm+ gap-3 mt-4">
							<div className="grid lg:grid-cols-2 md:gap-3 gap-5">
								<div className="flex items-center gap-2">
									<Icon icon="mingcute:book-2-line" className="w-4 h-4" />
									<span>Course ID : {data.Data.CommonCourseCatalog.CourseID}</span>
								</div>
								<div className="flex items-center gap-2">
									<Icon icon="mingcute:time-line" className="w-4 h-4" />
									<span>
										Last updated : <Timeago date={data.Data.CommonCourseCatalog.LastModifiedDate} />
									</span>
								</div>
							</div>
							<div className="grid lg:grid-cols-2 md:gap-3 gap-5">
								<div className="flex items-center gap-2">
									<Icon icon="mingcute:chart-bar-line" className="w-4 h-4" />
									<span>{data.Data.CommonCourseCatalog.SkillLevel}</span>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3 md:gap-5 sm:mt-3">
								<button
									onClick={() =>
										navigate(
											user?.UserId
												? "/subscriptions?2"
												: "/auth/login?redirect_uri=/subscriptions?2"
										)
									}
									className="btn hover:bg-primary-focus rounded-md bg-primary font-medium text-white"
								>
									View Plan
								</button>
								{/* {user?.UserId && (
									<button className="btn hover:bg-primary-focus rounded-md bg-primary font-medium text-white gap-2">
										<Icon icon="mingcute:heart-line" className="w-5 h-5" />
										<span>Add to Favourite</span>
									</button>
								)} */}
							</div>
						</div>
					</div>
					<div className="flex items-center md:w-2/5">
						<a
							// href={`${PreprodUrl}iGETIT2/Api/${
							// 	data.Data[0].CourseID
							// }?PathID=-1&From=${encodeURIComponent(locationEndPoint)}&type=1&SessionID=${
							// 	user.SessionId
							// }`}
							target="_self"
							className="relative"
						>
							<img
								src="/assets/images/rectanglebg.svg"
								alt=""
								className="bg-white w-full p-2 shadow-xl rounded-lg border"
							/>
							{/* <div className="absolute inset-0 flex items-center justify-center rounded-xl">
								<Icon icon="mingcute:play-circle-fill" className="w-6 h-6 text-white" />
								<span className="ml-2 text-[#FFFFFF]">About the course</span>
							</div> */}
						</a>
					</div>
				</section>
				<section className="flex flex-col lg:flex-row gap-3 md:mt-5">
					<div className="flex-1 flex flex-col gap-5">
						<div className="card p-4 gap-3">
							<h3 className="text-lg text-slate-800">About the Course</h3>
							<p className="leading-normal">{data.Data.CommonCourseCatalog.Overview}</p>
						</div>
						<div className="card p-4 gap-3">
							<h3 className="text-lg text-slate-800">Prerequisites</h3>
							<p className="leading-normal">{data.Data.CommonCourseCatalog.Prerequisites}</p>
						</div>
						<div className="card p-4 gap-3">
							<h3 className="text-lg text-slate-800">Target Audience</h3>
							<p className="leading-normal">{data.Data.CommonCourseCatalog.IntendedAudience}</p>
						</div>
						<div className="card p-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg text-slate-800">Curriculum</h3>
								<button className="hidden text-sm text-primary flex items-center gap-2 rounded-md hover:bg-primary/70 hover:text-white px-4 py-2">
									<Icon icon="mingcute:download-2-line" className="w-3.5 h3.5" />
									<span>Download Contents</span>
								</button>
							</div>
							<div className="grid border my-2 divide-y">
								{_.keys(_.groupBy(data.Data.CommonCourseCatalogTOC, (car: any) => car.UnitTitle))?.map(
									(cur: any) => (
										<CurriculumItem
											key={cur}
											title={cur}
											content={
												_.groupBy(
													data.Data.CommonCourseCatalogTOC,
													(car: any) => car.UnitTitle
												)[cur]
											}
										/>
									)
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-3 w-full lg:w-1/4">
						<div className="card p-4 gap-3">
							<h3 className="text-lg text-slate-800">{data.Data.CommonCourseCatalog.CategoryName}</h3>
							<div className="grid grid-cols-1 divide-y">
								<div className="flex item-center justify-between p-3">
									<div className="flex items-center gap-2 text-sm+">
										<Icon icon="mingcute:time-line" className="w-5 h-5" />
										<span>Duration</span>
									</div>
									<span>{data.Data.CommonCourseCatalog.OnlineHours}h</span>
								</div>

								<div className="flex item-center justify-between p-3">
									<div className="flex items-center gap-2 text-sm+">
										<Icon icon="mingcute:book-5-line" className="w-5 h-5" />
										<span>Lessons</span>
									</div>
									<span>{data.Data.CommonCourseCatalog.TotalLessons}</span>
								</div>

								<div className="flex item-center justify-between p-3">
									<div className="flex items-center gap-2 text-sm+">
										<Icon icon="mingcute:star-line" className="w-5 h-5" />
										<span>Rating</span>
									</div>
									<span>{data.Data.CommonCourseCatalog.AverageRating}/5</span>
								</div>

								{/* {data.Data.CommonCourseCatalog.Filename && Exist && TrialUser.Result === 0 && (
									<div className="flex item-center justify-between p-3">
										<div className="flex items-center gap-2 text-sm+">
											<Icon icon="mingcute:folder-line" className="w-5 h-5" />
											<span>Resource</span>
										</div>
										<button
											className="text-medium text-primary"
											onClick={() => downloadZip(imageUrl + data.Data.CommonCourseCatalog.Filename)}
											disabled={!Exist}
										>
											Download
										</button>
									</div>
								)} */}
								<div className="text-center pt-5 pb-3">
									<button
										onClick={() =>
											navigate(
												user?.UserId
													? "/subscriptions?2"
													: "/auth/login?redirect_uri=/subscriptions?2"
											)
										}
										className="btn hover:bg-primary-focus rounded-md bg-primary font-medium text-white"
									>
										View Plan
									</button>
								</div>
							</div>
						</div>
						<div className="hidden flex flex-col gap-3 w-full">
							<div className="card p-4 gap-3">
								<h3 className="text-lg text-slate-800">Related Courses</h3>
								<div className="flex flex-col gap-2">
									<div
										title="AutoCAD Electrical 2022 Productivity Tools"
										className="flex items-center gap-2"
									>
										<div className="avatar w-16 h-12">
											<img
												className="rounded-md"
												src="/assets/images/sample_learn.png"
												alt="sd"
											/>
										</div>
										<div className="block text-base px-2">
											<p className="text-sm+ text-slate-600 font-medium line-clamp-1">
												AutoCAD Electrical 2022 Productivity Tools
											</p>
											<span className="text-sm rounded-md">10 lessons</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

export default CatalogDetails;
