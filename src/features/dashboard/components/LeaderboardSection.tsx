import { Icon } from "@iconify/react";
import { useGetLeaderBoardQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";
import { Fragment } from "react";

interface IProps {
	type?: string;
	userId?: string;
}
const LeaderboardSection = ({ type, userId }: IProps) => {
	useGetLeaderBoardQuery(userId);
	const { leaderBoard, leaderBoardMessage } = useAppSelector((state: any) => state.dashboard);
	function showBorder(value: number): string {
		if (value >= 5) {
			return " last:border-white";
		}
		return "";
	}
	return (
		<div className="col-span-12 lg:col-span-4">
			<div className="flex items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Leaderboard</h2>
			</div>
			<div className="grid-cols-12 grid bg-white rounded-lg  border border-gray-200 lg:h-4/5">
				<div className="col-span-12">
					<table className="is-hoverable w-full text-left">
						<thead>
							<tr>
								<th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5   lg:px-5">
									Name
								</th>
								<th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
									Points
								</th>
							</tr>
						</thead>
						<tbody>
							{leaderBoard.length > 0 ? (
								leaderBoard.slice(0, 5).map((item: any, index: number) => (
									<Fragment key={item.index}>
										<tr
											key={index}
											className={`border-y border-transparent border-b-slate-200 ${showBorder(
												leaderBoard.length
											)} dark:border-b-navy-500`}
										>
											<td className="whitespace-nowrap px-4 py-2  last:py-2 sm:px-5">
												<div className="flex items-center">
													<div className="avatar h-8 w-8">
														<div className="is-initial rounded-full bg-[#048BCE] text-sm uppercase text-white">
															{item.FirstName.charAt(0)} {item.LastName.charAt(0)}
														</div>
													</div>
													<span
														className={`ml-3  font-bold uppercase text-xs+ ${
															item.FirstName === "You"
																? "text-primary "
																: "text-slate-500"
														}`}
													>
														{item.FirstName} {item.LastName}
													</span>
												</div>
											</td>
											<td className="whitespace-nowrap px-4 py-2 last:py-2 sm:px-5">
												<div className="flex items-center">
													<Icon
														icon="mingcute:copper-coin-line"
														color="rgba(250, 164, 26, 1)"
													/>
													<span className="ml-2 font-bold   text-xs+  ">{item.Points}</span>
												</div>
											</td>
										</tr>
									</Fragment>
								))
							) : (
								<Fragment>
									<tr>
										<td colSpan={2} className="whitespace-nowrap px-4 py-2 sm:px-5">
											<div className="flex justify-center">
												<p className="my-16 text-sm font-dmsans text-[#020A12]/60">
													{leaderBoardMessage}
												</p>
											</div>
										</td>
									</tr>
								</Fragment>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardSection;
