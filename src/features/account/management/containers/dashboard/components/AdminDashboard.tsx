import { Icon } from "@iconify/react";
import { Spinner1 } from "~/components/spinner";
import { useGetUserScoreCardsQuery } from "../store";

const AdminDashboard = () => {
	const { isLoading, data } = useGetUserScoreCardsQuery("");
	const AdminDashboardDetails = data?.Data;
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						ACTIVE USERS
					</p>
					<div className="mt-4 mr-4 w-10 h-10 bg-[#E3F2FB] rounded-lg">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#0A4B94]" icon="mingcute:group-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AdminDashboardDetails?.ActiveUsers || 0}
						</p>
					)}
					<Icon className="mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:group-line" />
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						INACTIVE USERS
					</p>
					<div className="mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:group-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AdminDashboardDetails?.InactiveUsers || 0}
						</p>
					)}
					<Icon className="mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:group-line" />
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						ACTIVE SUBSCRIPTIONS
					</p>
					<div className="mt-4 mr-4 w-10 h-10 bg-[#E6F7E9] rounded-lg">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#4FC666]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							{AdminDashboardDetails?.ActiveSubscription || 0}
						</p>
					)}
					<Icon
						className="mt-6 h-16 w-16 text-[#E8EAEE]"
						icon="mingcute:book-3-line"
						width="16"
						height="16"
					/>
				</div>
			</div>
			<div className="rounded-lg bg-white pl-6 border border-gray-200">
				<div className="flex justify-between">
					<p className="mt-7 text-lg font-medium tracking-wide text-slate-700 line-clamp-2 h-12">
						EXPIRED SUBSCRIPTIONS
					</p>
					<div className="mt-4 mr-4 w-10 h-10 bg-[#FAEBEE] rounded-lg">
						<Icon className="mt-2 ml-2 h-6 w-6 text-[#D85C57]" icon="mingcute:book-3-line" />
					</div>
				</div>
				<div className="flex justify-between">
					{isLoading && <Spinner1 />}
					{!isLoading && (
						<p className="mt-6 mb-4 text-2xl font-dmsans font-bold text-[#020A12]">
							<span className="text-xl">{AdminDashboardDetails?.InactiveSubscription || 0}</span>
						</p>
					)}
					<Icon className="mt-6 h-16 w-16 text-[#E8EAEE]" icon="mingcute:book-3-line" />
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
