import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Spinner } from "~/components/spinner";
import { useGetTopUsersQuery } from "../store";

function CourseTimeChart() {
	const [NameList, setNameList] = useState<any[]>([]);
	const [SeriesList, setSeriesList] = useState<any[]>([]);
	const TopUsersData = useGetTopUsersQuery("");

	useEffect(() => {
		let names: string[] = [];
		let series: number[] = [];
		if (TopUsersData.data?.Data?.length > 0) {
			TopUsersData.data?.Data.map((user: any) => {
				names.push(user.ShortName);
				series.push(user.TotalTime);
			});
		}
		setNameList(names);
		setSeriesList(series);
	}, [TopUsersData]);

	const chartOptions: ApexOptions = {
		colors: ["#18B3B0"],
		chart: {
			id: "bar",
			zoom: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		dataLabels: {
			enabled: false
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				barHeight: "100%",
				columnWidth: "20%"
			}
		},
		legend: {
			show: false
		},
		xaxis: {
			categories: NameList,
			labels: {
				hideOverlappingLabels: false
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			tooltip: {
				enabled: false
			}
		},
		grid: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		yaxis: {
			show: true,
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
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
				name: "course time",
				data: SeriesList
			}
		]
	};

	return (
		<div className="col-span-12 lg:col-span-6 h-full">
			<div className="flex items-center space-x-4 py-4 md:py-5 lg:py-6 h-1/6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
					{"Most course time in past year"}
				</h2>
			</div>
			<div className="col-span-12 lg:col-span-6 bg-white rounded-lg border border-gray-200 min-h-[100px] h-5/6 px-2">
				{TopUsersData.isFetching && (
					<div className="flex items-center justify-center w-full h-full">
						<Spinner />
					</div>
				)}
				{!TopUsersData.isFetching && TopUsersData.data?.Data?.length > 0 ? (
					<ReactApexChart options={data.options} series={data.series} type="bar" height={"280px"} />
				) : (
					!TopUsersData.isFetching && (
						<div className="flex justify-center items-center w-full h-full">
							<p className="text-sm font-dmsans text-[#020A12]/60">
								{"No course time detail exists for current User"}
							</p>
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default CourseTimeChart;
