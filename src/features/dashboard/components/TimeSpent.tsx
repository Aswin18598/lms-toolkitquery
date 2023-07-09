import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetTimeSpentQuery, useGetTimeSpentGraphQuery } from "~/features/dashboard/store";
import { useAppSelector } from "~/config/store";

interface IProps {
	userId?: string;
}

const TimeSpent = ({ userId }: IProps) => {
	useGetTimeSpentQuery(userId);
	useGetTimeSpentGraphQuery(userId);
	const { timeSpent } = useAppSelector((state: any) => state.dashboard);
	const { timeSpentGraph } = useAppSelector((state: any) => state.dashboard);
	const [WeekDaysName, setWeekDaysName] = useState<any>([]);
	const [WeekDaysData, setWeekDaysData] = useState<any>([]);
	useEffect(() => {
		if (timeSpentGraph.length > 0 && timeSpentGraph[0].WeekDaysName) {
			setWeekDaysName(JSON.parse(timeSpentGraph[0].WeekDaysName));
		}
		if (timeSpentGraph.length > 0 && timeSpentGraph[0].WeekDayData) {
			setWeekDaysData(JSON.parse(timeSpentGraph[0].WeekDayData));
		}
	}, [timeSpentGraph]);

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
			categories: WeekDaysName,
			labels: {
				style: {
					colors: "rgba(2, 10, 18, 0.54)",
					fontSize: "12",
					fontWeight: 400
				}
			}
		},
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
			max: 20,
			tickAmount: 4,
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
				data: WeekDaysData
			}
		]
	};

	function showPercentage(value: number): string {
		if (Math.sign(value) === 1) {
			return "bg-[#E6F7E9] text-[#4FC666]";
		} else if (Math.sign(value) === -1) {
			return "bg-[#FAEBEE] text-[#D85C57]";
		}
		return "";
	}

	function showIcon(value: number): string {
		if (Math.sign(value) === 1) {
			return "#E6F7E9";
		} else if (Math.sign(value) === -1) {
			return "#FAEBEE  -rotate-180";
		}
		return "";
	}

	return (
		<>
			<div className="col-span-12 lg:col-span-9 w-full">
				<div className="flex items-center space-x-4 py-5 lg:py-6">
					<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Time Spent</h2>
				</div>
				<div className="bg-white p-6 border border-gray-200 grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
					<div className="rounded-lg border border-gray-200 bg-white col-span-12">
						<Chart options={data.options} series={data.series} type="area" height={"200px"} />
					</div>

					<div className="col-span-12 mt-2">
						<div className="grid md:grid-cols-4 grid-cols-2 gap-6">
							<div className="rounded-lg border border-gray-200 bg-white p-3">
								<div className="flex justify-between">
									<div>
										<p className="text-2xl font-dmsans font-bold text-[#020A12] line-clamp-1">
											<span className="text-xl">
												{timeSpent.TimeSpent && timeSpent.TimeSpent.split(" ")[0]}{" "}
											</span>
											<span className="text-lg">
												{timeSpent.TimeSpent && timeSpent.TimeSpent.split(" ")[1]}
											</span>
										</p>
										<p className="mt-2 text-base line-clamp-2 h-12">Time Spent</p>
									</div>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg hidden lg:block">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="mt-2 ml-2 h-6 w-6 text-[#D85C57]"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
								<div className="mt-4 flex text-left">
									<button
										className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors text-xs+ space-x-2 ${showPercentage(
											timeSpent.TotalTimePercentage
										)}`}
									>
										{Math.abs(timeSpent.TotalTimePercentage)}%
									</button>
								</div>
							</div>
							<div className="rounded-lg border border-gray-200 bg-white p-3">
								<div className="flex justify-between">
									<div>
										<p className="text-2xl font-dmsans font-bold text-[#020A12]">
											{timeSpent.CompletedAssessments}
										</p>
										<p className="mt-2 text-base line-clamp-2 h-12">Assessments Completed</p>
									</div>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg hidden lg:block">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="mt-2 ml-2 h-6 w-6 text-[#FAA41A]"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />
											<line x1="9" y1="7" x2="13" y2="7" />{" "}
											<line x1="9" y1="11" x2="13" y2="11" />
										</svg>
									</div>
								</div>
								<div className="mt-4 flex text-left">
									<button
										className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors text-xs+ space-x-2 ${showPercentage(
											timeSpent.TotalAssessmentPercentage
										)}`}
									>
										<Icon
											icon="fluent:triangle-12-filled"
											className={`${showIcon(timeSpent.TotalAssessmentPercentage)}`}
										/>
										<p className="ml-1">{Math.abs(timeSpent.TotalAssessmentPercentage)}%</p>
									</button>
								</div>
							</div>
							<div className="rounded-lg bg-white border border-gray-200 p-3">
								<div className="flex justify-between">
									<div>
										<p className="text-2xl font-dmsans font-bold text-[#020A12]">
											{timeSpent.CompletedCourses}
										</p>
										<p className="mt-2 text-base line-clamp-2 h-12">Course Completed</p>
									</div>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg hidden lg:block">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="mt-2 ml-2 h-6 w-6 text-[#4FC666]"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
										</svg>
									</div>
								</div>
								<div className="mt-4 flex text-left">
									<button
										className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors text-xs+ space-x-2 ${showPercentage(
											timeSpent.TotalCoursePercentage
										)}`}
									>
										{Math.abs(timeSpent.TotalCoursePercentage)}%
									</button>
								</div>
							</div>
							<div className="rounded-lg bg-white border border-gray-200 p-3">
								<div className="flex justify-between">
									<div>
										<div className="flex">
											<p className="text-2xl font-dmsans font-bold text-[#020A12]">
												{timeSpent.PerformanceLevel}
											</p>
											{Math.floor(timeSpent.TotalPerformanceLevelPercentage) !== 0 && (
												<Icon
													icon="bi:arrow-up"
													className={`text-sm ${showIcon(
														timeSpent.TotalPerformanceLevelPercentage
													)}`}
												/>
											)}
										</div>
										<p className="mt-2 text-base line-clamp-2 h-12">Performance Level</p>
									</div>
									<div className="flex items-center justify-center w-10 h-10 rounded-lg hidden lg:block">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="mt-2 ml-2 h-6 w-6 text-[#0A4B94]"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="4" y1="4" x2="4" y2="20" />
											<line x1="4" y1="20" x2="20" y2="20" />
											<polyline points="4 17 9 11 13 15 21 7" />
											<polyline points="14 7 21 7 21 14" />
										</svg>
									</div>
								</div>
								<div className="mt-4 flex text-left">
									<button
										className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-3 leading-tight transition-colors text-xs+ space-x-2 ${showPercentage(
											timeSpent.TotalPerformanceLevelPercentage
										)}`}
									>
										{Math.abs(timeSpent.TotalPerformanceLevelPercentage)}%
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default TimeSpent;
