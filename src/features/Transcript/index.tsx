import { useState } from "react";
import { Page } from "~/components";
import { Spinner } from "~/components/spinner";
import { getLoggedUser } from "~/helpers/auth";
import { useGetFilterCoursesInitialQuery } from "../learning/store";
import AssessmentHistory from "./components/AssessmentHistory";
import CourseHistory from "./components/CourseHistory";
import TranscriptCard from "./components/TranscriptCard";
import { useGetTranscriptUserDetailsQuery } from "./store";

const transcriptMenu = ["Course History", "Assessment History"];

function Transcript() {
	const { UserId } = getLoggedUser();
	const { isFetching } = useGetTranscriptUserDetailsQuery(UserId);
	useGetFilterCoursesInitialQuery({
		TopicID: -1,
		CatagoryID: -1,
		SubCategoryID: -1,
		SkillLevelID: -1,
		Rating: -1,
		SearchText: -1
	});
	const [selectedCatalog, setSelectedCatalog] = useState(transcriptMenu[0]);

	return (
		<>
			{isFetching && (
				<div className="mx-auto my-52">
					<Spinner />
				</div>
			)}
			{!isFetching && (
				<Page title="Transcript">
					<>
						<TranscriptCard />
						<div className="rounded-lg bg-slate-150 flex px-[6px] w-fit mt-8">
							{transcriptMenu.map((menu: any) => (
								<button
									key={menu}
									onClick={() => {
										setSelectedCatalog(menu);
									}}
									className={`px-[10px] py-[7px] mr-3 text-slate-500 rounded-lg text-[14px] font-bold my-1 ${
										selectedCatalog === menu && "bg-white p-4"
									}`}
								>
									{menu}
								</button>
							))}
						</div>
						<div className="w-full mt-8">
							{selectedCatalog === transcriptMenu[0] ? <CourseHistory /> : <AssessmentHistory />}
						</div>
					</>
				</Page>
			)}
		</>
	);
}

export default Transcript;
