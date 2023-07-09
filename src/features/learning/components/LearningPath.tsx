import { useEffect, useState } from "react";
import Progress from "./Progress";
import SearchBar from "./SearchBar";
import LearningPathTable from "./LearningPathTable";
import { setSelectedPageSize, setSelectedStatus, useGetMyLearningPathQuery } from "~/features/learning/store";
import { getLoggedUser } from "~/helpers/auth";
import { dispatch, useAppSelector } from "~/config/store";
import { Icon } from "@iconify/react";

function LearningPath() {
	const { UserId } = getLoggedUser();
	const { PageNumber, PageSize, Status, SearchText } = useAppSelector((state: any) => state.learningReducer);
	const [loaderer, setLoaderer] = useState<boolean>(false);
	const [statusID, setStatusID] = useState<number>(0);
	const { Favorites } = useAppSelector((state: any) => state.headersandmenuReducer);

	const { isLoading, refetch } = useGetMyLearningPathQuery(
		{
			UserID: UserId,
			PageNumber: PageNumber,
			PageSize: PageSize,
			Status: Status,
			SearchText: SearchText
		},
		{ skip: PageSize === 12 }
	);

	useEffect(() => {
		dispatch(setSelectedPageSize(10));
		dispatch(setSelectedStatus(statusID));
	}, [statusID]);

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 500);
	}, [PageNumber, PageSize, statusID, SearchText]);

	useEffect(() => {
		setLoaderer(isLoading);
	}, [isLoading]);

	useEffect(() => {
		setTimeout(() => {
			if (!isLoading) refetch();
		}, 500);
	}, [Favorites]);

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="w-full sm:w-[40%] md:w-[30%]">
					<SearchBar setLoader={setLoaderer} isLearningPath />
				</div>
				<div className="flex gap-4 w-full sm:w-[45%] md:w-[50%] lg:w-[30%]">
					<a
						href={
							"mailto:?subject=Learning%20path&body=Hi,%0D%0A%0D%0A I am sharing the below Learning Path to you.%0D%0A%0D%0A" +
							window.location.href +
							"%0D%0A%0D%0ARegards,%0D%0ATeam iGETIT"
						}
						target="_self"
						className="btn flex w-[50%] sm:w-[30%] cursor-pointer text-sm bg-white gap-2 border border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 focus:bg-white focus:shadow-lg focus:shadow-slate-200/50 active:bg-white dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-white dark:hover:shadow-navy-450/50 dark:focus:bg-white dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
					>
						<Icon icon="mingcute:mail-send-line" className="w-[16px] h-[16px]" />
						<span>Share</span>
					</a>
					<Progress setStatusID={setStatusID} statusID={statusID} setLoader={setLoaderer} optionChoice />
				</div>
			</div>
			<LearningPathTable loader={loaderer} setLoader={setLoaderer} refetch={refetch} />
		</>
	);
}

export default LearningPath;
