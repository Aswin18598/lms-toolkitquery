import { Icon } from "@iconify/react";
import { dispatch, useAppSelector } from "~/config/store";
import { HandleFilterClear, HandleFilterContentType, HandleFilterSubCategory, HandleFilterSubTopic } from "../store";

interface IProps {
	SearchTableDataCount: number;
}

function FilterSelectionHeader({ SearchTableDataCount }: IProps) {
	const { FilterContentType, FilterSubTopic, FilterSubCategory } = useAppSelector(
		(state: any) => state.searchReducer
	);
	return (
		<div className="flex flex-col gap-4 items-start font-normal">
			<h1 className="font-medium">
				We found <span className="font-bold">{SearchTableDataCount}</span> results available for you
			</h1>
			<div className="flex gap-2 flex-wrap text-xs+">
				{FilterContentType !== 0 && (
					<div className="flex flex-row items-center gap-2 justify-between bg-slate-150 rounded-full px-4 py-1">
						<h1>
							Content type:{" "}
							<span className="font-bold">{FilterContentType === 1 ? "Course" : "Document"}</span>
						</h1>
						<button onClick={() => dispatch(HandleFilterContentType(FilterContentType))}>
							<Icon className="w-4 h-4" icon="material-symbols:close-rounded" />
						</button>
					</div>
				)}
				{FilterSubCategory !== "" && (
					<div className="flex flex-row items-center gap-2 justify-between bg-slate-150 rounded-full px-3 py-1">
						<h1>
							Category: <span className="font-bold">{FilterSubCategory}</span>
						</h1>
						<button onClick={() => dispatch(HandleFilterSubCategory(FilterSubCategory))}>
							<Icon className="w-4 h-4" icon="material-symbols:close-rounded" />
						</button>
					</div>
				)}
				{FilterSubTopic !== "" && (
					<div className="flex flex-row items-center gap-2 justify-between bg-slate-150 rounded-full px-3 py-1">
						<h1>
							Topics: <span className="font-bold">{FilterSubTopic}</span>
						</h1>
						<button onClick={() => dispatch(HandleFilterSubTopic(FilterSubTopic))}>
							<Icon className="w-4 h-4" icon="material-symbols:close-rounded" />
						</button>
					</div>
				)}
				{(FilterContentType !== 0 || FilterSubCategory !== "" || FilterSubTopic !== "") && (
					<button className="flex items-center text-sm+" onClick={() => dispatch(HandleFilterClear(""))}>
						<span className="underline">Clear all</span>
					</button>
				)}
			</div>
		</div>
	);
}

export default FilterSelectionHeader;
