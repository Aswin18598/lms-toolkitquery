import { Icon } from "@iconify/react";
import Tippy from "@tippyjs/react";
import { Spinner } from "~/components/spinner";
import { IConditionalUsersForLearningPath } from "../@types";
interface IAssignedPathConditionalUsersTabContentTableProps {
	isConditionalUsersForLearningFetching: boolean;
	conditionalUsersForLearningPath: IConditionalUsersForLearningPath;
	text: string;
}
function AssignedPathConditionalUsersTabContentTable(props: IAssignedPathConditionalUsersTabContentTableProps) {
	const { isConditionalUsersForLearningFetching, conditionalUsersForLearningPath, text } = props;

	if (isConditionalUsersForLearningFetching)
		return (
			<div className="mx-auto my-12">
				<Spinner />
			</div>
		);
	if (!isConditionalUsersForLearningFetching && !conditionalUsersForLearningPath?.ConditionalUsers?.length)
		return (
			<div className="flex flex-col text-center items-center mx-auto py-12">
				<img
					className="h-40 my-auto"
					src={"/assets/images/Tiger_images/tiger-logoutX400.png"}
					alt={"No Records Found"}
				/>
				<p className="text-xs+ text-[#020A12]/60">{"No Records Found"}</p>
			</div>
		);
	return (
		<div className="is-scrollbar-hidden min-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-500">
			{/* {isLoading && (
				<section className="w-full z-50 h-full fixed bg-black/20 top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
					<Spinner />
				</section>
			)} */}
			<table className="w-full">
				<thead>
					<tr className="bg-table-header text-left">
						<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
							UserID
						</th>
						<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
							First Name
						</th>
						<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
							Last Name
						</th>
					</tr>
				</thead>
				<tbody className="bg-white">
					{conditionalUsersForLearningPath?.ConditionalUsers?.filter(u =>
						u.FirstName.toLowerCase().includes(text.toLowerCase())
					)?.map((cUser, i) => (
						<tr className="border-b-2 border-slate-200 last-of-type:border-none" key={i}>
							<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{cUser.UserID}</td>
							<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{cUser.FirstName}</td>
							<td className="text-sm+ font-dmsans text-[#020A12]/60 px-5 py-3">{cUser.LastName}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default AssignedPathConditionalUsersTabContentTable;
