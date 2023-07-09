import { BaseQueryResult } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dispatch, useAppSelector } from "~/config/store";
import { setHeaderSelect, setPostSize, setRenderedAPIData, useGetCourseForumQuery } from "../store";
import DiscussionForumComments from "./DiscussionForumComments";

const PostingHeader = ["All Posts", "My Posts"];
const PostingHeaderSelect = [
	{ name: "All", key: -1 },
	{ name: "No Reply", key: 0 },
	{ name: "Replied", key: 1 }
];

const DiscussionForumPosting = () => {
	const location = useLocation();
	const { DiscussionSearchText, RenderedAPIData, HeaderSelect, PostSize } = useAppSelector(
		(state: any) => state.learningReducer
	);
	const CourseID = +location.search?.split("&")[2];
	const [selectedSearchType, setSelectedSearchType] = useState<number>(0);
	const [selectedCatalog, setSelectedCatalog] = useState<string>(PostingHeader[0]);
	const [CourseForumData, setCourseForumData] = useState<any>({});
	const courseForumData: BaseQueryResult<any> = useGetCourseForumQuery({
		CourseID: CourseID,
		SearchType: selectedSearchType === 0 ? "ALL" : "MINE",
		SearchText: DiscussionSearchText,
		ResponseFilter: HeaderSelect,
		PageSize: PostSize
	});

	useEffect(() => {
		if (courseForumData.data?.Data) {
			setCourseForumData(courseForumData.data?.Data);
		} else {
			setCourseForumData([]);
		}
	}, [courseForumData]);

	useEffect(() => {
		courseForumData.refetch();
	}, [DiscussionSearchText, selectedSearchType, HeaderSelect, PostSize]);

	useEffect(() => {
		if ((!!RenderedAPIData?.data || RenderedAPIData?.isUninitialized) && !RenderedAPIData?.isLoading) {
			courseForumData.refetch();
			dispatch(setRenderedAPIData({}));
		}
	}, [RenderedAPIData]);

	useEffect(() => {
		dispatch(setPostSize(10));
		courseForumData.refetch();
	}, [courseForumData.isLoading]);

	return (
		<>
			<div className="flex flex-wrap justify-between gap-4 w-full  mt-8">
				<div className="flex flex-wrap gap-4 tabs-list p-2">
					{PostingHeader.map((menu: any, index: number) => (
						<button
							key={menu}
							onClick={() => {
								setSelectedCatalog(menu);
								setSelectedSearchType(index);
							}}
							className={classNames("btn shrink-0 px-3 rounded-full py-2 text-sm font-medium", {
								"bg-primary/10 shadow text-primary": selectedCatalog === menu
							})}
						>
							{menu === PostingHeader[0]
								? menu + " (" + (CourseForumData.TotalReplyCount || 0) + ")"
								: menu + " (" + (CourseForumData.MyReplyCount || 0) + ")"}
						</button>
					))}
				</div>
				<div className="w-[20%]">
					<select
						value={HeaderSelect}
						onChange={(e: any) => dispatch(setHeaderSelect(e.target.value))}
						className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
					>
						{PostingHeaderSelect.map((GridOption: any, index: number) => {
							return (
								<option key={GridOption.key} value={GridOption.key}>
									{GridOption.name}
								</option>
							);
						})}
					</select>
				</div>
			</div>
			<DiscussionForumComments
				Comments={CourseForumData?.Posting}
				isLoading={courseForumData.isFetching}
				TotalCount={CourseForumData.TotalReplyCount}
			/>
		</>
	);
};

export default DiscussionForumPosting;
