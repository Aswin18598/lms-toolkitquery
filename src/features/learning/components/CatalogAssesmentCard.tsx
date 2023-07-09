import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import { navigateLink } from "~/config/api/links";
import { useAppSelector } from "~/config/store";
import { RedirectLinkAssesment } from "~/helpers/RedirectLink";
import {
	setSelectedCatagoryID,
	setSelectedAssesments,
	useGetFilterAssesmentsQuery,
	setCourseDataToEmpty,
	setAssesmentsDataToEmpty
} from "../store";
import Pagination from "./Pagination";
import { checkIsB2B, getLoggedUser } from "~/helpers/auth";

interface IProps {
	setLoader: any;
	loader: boolean;
}

const CatalogAssesmentCard = ({ loader, setLoader }: IProps) => {
	const location = useLocation();
	const locationEndPoint: any =
		location.pathname.replace("/", "") + location.search.replace("?", "%3F").replaceAll("&", "%26");
	const {
		Assesments,
		AssesmentsMessage,
		CourseCatagoryID,
		SubCatagoryID,
		SearchText,
		CategoryLists,
		CategoryList,
		TypeID,
		PageNumber,
		PageSize
	} = useAppSelector((state: any) => state.learningReducer);
	const [categoryID, setCategoryID] = useState<number>(CourseCatagoryID);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { refetch, isFetching } = useGetFilterAssesmentsQuery(
		{
			SubcategoryID: SubCatagoryID,
			CategoryID: categoryID,
			PageNumber: PageNumber,
			PageSize: PageSize,
			SearchText: SearchText.length > 0 ? SearchText : -1
		},
		{ skip: categoryID === 0 && categoryID === undefined }
	);

	useEffect(() => {
		setLoader(true);
		refetch();
	}, []);

	useEffect(() => {
		setCategoryID(CourseCatagoryID);
	}, [CourseCatagoryID]);

	useEffect(() => {
		if (location?.state?.CategoryID && TypeID !== 2) {
			setCategoryID(location.state.CategoryID);
			dispatch(setSelectedCatagoryID(location.state.CatagoryID));
		} else if (CategoryLists.length > 0) {
			setCategoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID);
			dispatch(setSelectedCatagoryID((checkIsB2B() ? CategoryList : CategoryLists)[0]?.CategoryID));
		} else {
			setCategoryID(-1);
			dispatch(setSelectedCatagoryID(-1));
		}
	}, [CategoryLists, CategoryList]);

	const specificAssessment = (assessment: any) => {
		navigate(navigateLink.CatalogAssesmentdetail + "&" + assessment.AssessmentID);
	};

	useEffect(() => {
		if (SearchText !== "") {
			const assesmentDatas = Assesments?.Assessments?.filter((Assessment: any) => {
				return Assessment.Title.toLowerCase().includes(SearchText.toLowerCase());
			});
			dispatch(setSelectedAssesments(assesmentDatas));
		} else {
			setLoader(true);
			refetch();
		}
	}, [SearchText]);

	useEffect(() => {
		setLoader(true);
		setTimeout(() => {
			dispatch(setCourseDataToEmpty([]));
			dispatch(setAssesmentsDataToEmpty([]));
			refetch();
		}, 500);
	}, [CourseCatagoryID, SubCatagoryID, TypeID, PageSize, PageNumber, SearchText]);

	const AssesmentCard = () => {
		return Assesments?.Assessments?.map((Assessment: any, index: number) => {
			return (
				<div
					key={Assessment?.AssessmentID}
					className={`bg-white min-w-[260px] border border-gray-200  pt-4 px-4 rounded-2xl keen-slider__slide number-slide${index}`}
				>
					<div className="w-full flex justify-between items-center h-12 mb-3.5">
						<div className="cursor-pointer w-12 h-full rounded-lg border">
							<Icon icon="mingcute:paper-line" width="24" height="24" className="cursor-pointer m-2.5" />
						</div>
					</div>
					<button
						className="flex flex-col items-start"
						title="View Detail"
						onClick={() => specificAssessment(Assessment)}
					>
						<div className="flex items-center space-x-1">
							<p className="text-lg rounded-lg mb-2 px-1.5 text-left font-medium text-slate-700 line-clamp-1 bg-[#E2F5FF80] text-[#1268B3]">
								{Assessment?.CategoryName}
							</p>
						</div>
						<div className="flex items-center space-x-1">
							<p className="text-xs+ space-x-2 font-bold text-left text-[#020A12]/54">
								{Assessment?.Title}
							</p>
						</div>
					</button>

					<div className="flex justify-between">
						<div className="flex items-center text-xs+ text-[#020A12]/54 font-normal font-dmsans my-4">
							<span className=" line-clamp-1">{Assessment?.NumberOfQuestions} Questions</span>{" "}
							<span className="border rounded-full w-1.5 h-1.5 mx-2 bg-[#C7CFD761]"></span>
							<span className="ml-0 line-clamp-1">
								{Assessment?.TimeLimitMinutes === 0
									? "No Time Limit"
									: Assessment?.TimeLimitMinutes + " Minutes"}
							</span>
						</div>
						<button
							onClick={() =>
								window.location.replace(
									RedirectLinkAssesment(Assessment.AssessmentID, locationEndPoint)
								)
							}
							title="Start Assessment"
						>
							<img src="/assets/images/launch.svg" width="20" height="20" />
						</button>
					</div>
				</div>
			);
		});
	};

	useEffect(() => {
		setLoader(!!!AssesmentCard || isFetching);
	}, [Assesments]);

	return (
		<>
			{loader && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!loader &&
				(Assesments?.Assessments?.length > 0 && !!AssesmentCard ? (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 justify-items-stretch  lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-8">
							<AssesmentCard />
						</div>
						<Pagination PaginationData={Assesments} count={12} />
					</>
				) : (
					<div className="flex flex-col text-center items-center mx-auto py-12">
						{AssesmentsMessage.toLowerCase().includes("success") || AssesmentsMessage === "" ? (
							<></>
						) : !AssesmentsMessage.toLowerCase().includes("fail") ? (
							<>
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt={AssesmentsMessage}
								/>
								<p className="text-xs+ text-[#020A12]/60">{AssesmentsMessage}</p>
							</>
						) : (
							<>
								<img
									className="h-40 my-auto"
									src="assets/images/Tiger_images/tiger-logoutX400.png"
									alt={"No records found"}
								/>
								<p className="text-xs+ text-[#020A12]/60">{"No records found"}</p>
							</>
						)}
					</div>
				))}
		</>
	);
};

export default CatalogAssesmentCard;
