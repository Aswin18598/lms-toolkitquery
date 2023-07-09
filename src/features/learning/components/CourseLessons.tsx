import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/spinner";
import { useAppSelector } from "~/config/store";
import { useGetCourseTableOfContentQuery } from "../store";
import { CSVLink } from "react-csv";
import { getLoggedUser } from "~/helpers/auth";
import { useLocation } from "react-router-dom";
import { RedirectLinkCourse } from "~/helpers/RedirectLink";
interface Iprops {
	SpecificDetails: any;
}
const CourseLessons = ({ SpecificDetails }: Iprops) => {
	const { UserId } = getLoggedUser();
	const { isLoading, data } = useGetCourseTableOfContentQuery({
		UserID: UserId,
		CourseID: SpecificDetails.CourseID,
		Percentage: 100
	});
	const { CourseTableOfContent } = useAppSelector((state: any) => state.learningReducer);
	const [selectedTab, setSelectedTab] = useState<Array<any>>([]);
	const [ContentTitle, setContentTitle] = useState<Array<any>>([]);
	const location = useLocation();
	const locationEndPoint = location.pathname.replace("/", "") + encodeURIComponent(location.search);
	useEffect(() => {
		const SelectedContent = CourseTableOfContent?.filter(
			(data: any, index: number, ContentArray: Array<any>) =>
				ContentArray?.findIndex((content: any) => content.UnitSeq === data.UnitSeq) === index
		);
		setContentTitle(SelectedContent);
	}, [CourseTableOfContent]);

	const handleSelectTab = (e: any, Title: string) => {
		let titleArray: Array<any> = [...selectedTab];
		if (!selectedTab?.includes(Title)) {
			titleArray.push(Title);
		} else {
			titleArray.splice(selectedTab.indexOf(Title), 1);
		}

		setSelectedTab(titleArray);
	};
	const headers = [
		{
			label: "UnitTitle",
			key: "UnitTitle"
		},
		{
			label: "UnitID",
			key: "UnitID"
		},
		{
			label: "UnitSeq",
			key: "UnitSeq"
		},
		{
			label: "DocSequence",
			key: "DocSequence"
		},
		{
			label: "DocTitle",
			key: "DocTitle"
		},
		{
			label: "Page",
			key: "Page"
		},
		{
			label: "IteDocIDmID",
			key: "IteDocIDmID"
		},
		{
			label: "Type",
			key: "Type"
		},
		{
			label: "ShowPage",
			key: "ShowPage"
		},
		{
			label: "Template",
			key: "Template"
		},
		{
			label: "TrackID",
			key: "TrackID"
		},
		{
			label: "BookmarkID",
			key: "BookmarkID"
		}
	];
	const CSVdatas = {
		filename: "curriculum.csv",
		headers: headers,
		data: CourseTableOfContent
	};

	return (
		<div>
			<div className="bg-white border rounded-lg mt-6 p-8">
				<div className="flex items-center justify-between">
					<div className="font-bold text-xl text-[#020A12] mb-5">Curriculum</div>
					{data?.Data?.length > 0 && (
						<div className="flex items-center justify-center font-bold text-xl text-[#020A12] mb-5">
							<span className="mr-1">
								<Icon icon="material-symbols:download-rounded" width="16" height="16" color="#1268B3" />
							</span>
							<CSVLink
								{...CSVdatas}
								className="text-xs font-bold text-[#1268B3] hover:font-normal cursor-pointer"
							>
								Download Contents
							</CSVLink>
						</div>
					)}
				</div>
				{isLoading && <Spinner />}
				{!isLoading &&
					(data?.Data?.length > 0 ? (
						ContentTitle?.map((FilterTitle: any, index: number) => {
							return (
								<div className="border">
									<div
										className="col-span-12 overflow-x-auto bg-white p-4"
										onClick={event => handleSelectTab(event, FilterTitle)}
									>
										<div className="flex text-left justify-between ">
											<p className="flex  items-center cursor-pointer ml-2 text-sm font-dmsans text-[#020A12]/60">
												<span className="mr-2">
													<Icon
														icon={`${
															selectedTab.includes(FilterTitle)
																? "tabler:minus"
																: "ic:round-plus"
														}`}
														width="16"
														height="16"
														color="#1268B3"
														key={"arrow" + index}
													/>
												</span>

												<span className="text-base font-bold text-[#1268B3]">
													{FilterTitle.UnitTitle}
												</span>
											</p>
											<p className="flex ml-2 text-xs font-dmsans justify-center text-[#020A12]/60">
												<span className="mr-2">
													{
														CourseTableOfContent?.filter(
															(data: any) => data.UnitSeq === FilterTitle.UnitSeq
														).length
													}{" "}
													Lessons
												</span>
												{/* <span className="mr-2 mt-2">
												<Icon icon="ion:ellipse" width="4" height="4" />
											</span>
											<span>1hr 00m</span> */}
											</p>
										</div>
									</div>

									{selectedTab?.includes(FilterTitle) && (
										<>
											{CourseTableOfContent?.filter(
												(data: any) => data.UnitSeq === FilterTitle.UnitSeq
											).map((subData: any) => {
												return (
													<>
														<div className="col-span-12 overflow-x-auto bg-[#F8F8F8] p-4">
															<div className="flex text-left justify-between ">
																<p className="flex justify-center items-center ml-2 text-sm font-dmsans text-[#020A12]">
																	<Icon
																		className={`mr-2 ${
																			subData?.VisitNum === 1
																				? "text-[#06792a]"
																				: "text-[#020A12]"
																		} `}
																		icon="mingcute:notebook-line"
																		width="16"
																		height="16"
																	/>
																	<span
																		title="Lanch Course"
																		className="text-sm cursor-pointer"
																		onClick={() => {
																			window.location.replace(
																				RedirectLinkCourse(
																					SpecificDetails.CourseID,
																					locationEndPoint
																				)
																			);
																		}}
																	>
																		{subData.DocTitle}
																	</span>
																</p>
															</div>
														</div>
													</>
												);
											})}
										</>
									)}
								</div>
							);
						})
					) : (
						<div className="flex flex-col text-center items-center mx-auto py-20">
							<img
								className="h-40 my-auto"
								src="assets/images/Tiger_images/tiger-logoutX400.png"
								alt={"No data found"}
							/>
							<p className="text-xs+ text-[#020A12]/60">No Lessons available for the selected criteria</p>
						</div>
					))}
			</div>
		</div>
	);
};
export default CourseLessons;
