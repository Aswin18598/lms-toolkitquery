import { ApexOptions } from "apexcharts";
import _ from "lodash";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Spinner } from "~/components/spinner";
import { useGetAuthorLoginMonthsQuery } from "../store";

const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function LoginMonthChart() {
	const [LoginCount, setLoginCount] = useState<any[]>([]);
	const loginmonths = useGetAuthorLoginMonthsQuery("");
	const [maxCount, setMaxCount] = useState<number>(0);

	const monthsOrder = _.times(12, (i: number) => {
		const today = new Date();
		const d = new Date(today.getFullYear(), today.getMonth() - (i + 1), 1);
		return monthsList[d.getMonth()];
	}).reverse();

	useEffect(() => {
		if (loginmonths.data?.Data.length > 0) {
			let array: any[] = [];
			loginmonths.data?.Data.map((_i: any) => array.push(_i.LoginNum));
			setLoginCount(array);
			const maxCount = Math.max(...array);
			const initialNum = (Math.max(...array) + "").split("")[0];
			const SetCount =
				+initialNum <= 8
					? `${+initialNum + 1}`.padEnd(`${maxCount}`.length, "0")
					: `${+initialNum + 1}`.padEnd(`${maxCount}`.length + 1, "0");
			setMaxCount(+SetCount);
		}
	}, [loginmonths]);

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
			categories: monthsOrder,
			labels: {
				style: {
					colors: "rgba(2, 10, 18, 0.54)",
					fontSize: "12",
					fontWeight: 400
				}
			}
		},
		colors: ["#26A69A"],
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
			max: maxCount,
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
				name: "login-count",
				data: LoginCount
			}
		]
	};
	return (
		<div className="col-span-12 lg:col-span-6 h-full">
			<div className="flex items-center space-x-4 py-4 md:py-5 lg:py-6 h-1/6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
					{"Logins by month in past year"}
				</h2>
			</div>
			<div className="col-span-12 lg:col-span-6 bg-white rounded-lg border border-gray-200 min-h-[100px] h-5/6 px-2">
				{loginmonths.isFetching && (
					<div className="flex items-center justify-center w-full h-full">
						<Spinner />
					</div>
				)}
				{!loginmonths.isFetching && loginmonths.data?.Data.length > 0 ? (
					<ReactApexChart options={data.options} series={data.series} type="area" height={"280px"} />
				) : (
					!loginmonths.isFetching && (
						<div className="flex justify-center items-center w-full h-full">
							<p className="text-sm font-dmsans text-[#020A12]/60">
								{"No Login Month detail exists for current User"}
							</p>
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default LoginMonthChart;
