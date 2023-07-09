import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Icon } from "@iconify/react";
import { useGetPopularRolesQuery, useGetPopularRolesGraphQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";
import { Spinner } from "~/components/spinner";

interface IProps {
	type?: string;
	userId?: string;
}

const iconColor = ["#EE6002", "#6200EE", "#26A69A"];
const chartOptions: ApexOptions = {
	chart: {
		id: "basic-bar",
		zoom: {
			enabled: false
		},
		toolbar: {
			show: false
		}
	},
	xaxis: {
		categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		labels: {
			style: {
				colors: "rgba(2, 10, 18, 0.54)",
				fontSize: "12",
				fontWeight: 400
			}
		}
	},
	colors: ["#EE6002", "#6200EE", "#26A69A"],
	dataLabels: {
		enabled: false
	},
	legend: {
		show: false
	},
	markers: {
		size: 0
	},
	stroke: {
		show: true,
		curve: "straight",
		width: 2
	},
	fill: {
		type: "gradient",
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.7,
			opacityTo: 0.9,
			stops: [0, 75]
		}
	},

	yaxis: {
		min: 0,
		max: 100,
		tickAmount: 4,
		logBase: 10,
		labels: {
			style: {
				colors: "rgba(2, 10, 18, 0.54)",
				fontSize: "12",
				fontWeight: 400
			}
		}
	}
};
const data = {
	options: chartOptions,

	series: [
		{
			name: "series-1",
			data: [48, 46, 60, 65, 78, 60, 78, 85, 60, 55, 80, 95]
		},
		{
			name: "series-2",
			data: [52, 80, 12, 36, 12, 44, 38, 34, 31, 12, 39, 40]
		},
		{
			name: "series-3",
			data: [12, 22, 12, 16, 22, 14, 28, 14, 11, 12, 19, 20]
		}
	]
};

const RoleSection = ({ type, userId }: IProps) => {
	const { isLoading } = useGetPopularRolesQuery(userId);
	useGetPopularRolesGraphQuery(userId);
	const { popularRoles } = useAppSelector((state: any) => state.dashboard);
	const { popularRolesQuery } = useAppSelector((state: any) => state.dashboard);
	function getGraphSize(): string {
		if (type === "basic") {
			return " lg:col-span-8";
		}
		return " lg:col-span-8";
	}

	return (
		<div className={`col-span-12 ${getGraphSize()}`}>
			<div className="flex items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Popular Roles</h2>
			</div>
			<div className=" h-4/5 grid-cols-12 grid bg-white rounded-lg border border-gray-200 px-6 py-[26px]">
				<div className="col-span-12 sm:col-span-4">
					<div className="border border-slate-150 rounded-lg   px-4 py-4">
						{isLoading && <Spinner />}
						{!isLoading &&
							popularRoles.slice(0, 3).map((item: any, index: number) => (
								<div className="flex mb-4 last:mb-0" key={index}>
									<Icon
										icon="carbon:user-multiple"
										color={iconColor[index]}
										className="self-start mr-[5px] mt-1"
									/>
									<div>
										<div className="text-lg font-medium text-slate-700 line-clamp-1">
											<span>{item.TotalPercentage}%</span>
											<span className="ml-1">({item.TotalCount})</span>
										</div>
										<div className="text-xs+ text-slate-400 dark:text-navy-300mt-[3px]">
											{item.PopularRoleName}
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
				<div className="col-span-12 sm:col-span-8">
					<Chart options={data.options} series={data.series} type="area" height={"200px"} />
				</div>
			</div>
		</div>
	);
};

export default RoleSection;
