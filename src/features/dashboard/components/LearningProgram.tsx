import React from "react";
import Linkedinlogo from "/linkedin.png";
import Techvarsitylogo from "/MicrosoftTeams-image2.png";
import Nasscomlogo from "/nasscom.jpg";
import { getLoggedUser } from "~/helpers/auth";
import { useGetGetLinkedinAccessQuery } from "../store/query";
const LearningProgram = () => {
	const { UserId } = getLoggedUser();
	const access = useGetGetLinkedinAccessQuery(UserId).data;
	return (
		<div className={`col-span-12 w-full`}>
			<div className="flex items-center space-x-4 py-5 lg:py-6">
				<h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Learning Program</h2>
			</div>
			<div className="h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 bg-white rounded-lg border border-gray-100 px-4 py-4 gap-4 sm:gap-5 lg:gap-6">
				{Number(access) == 1 && (
					<div className="border border-slate-130 rounded-lg px-2 py-2">
						<a className="flex justify-center flex-col" href="https://lnkd.in/eSS2zrAm">
							<img
								src={Linkedinlogo}
								alt="linkedin"
								className="aspect-square h-[200px] object-contain"
							></img>
							<br></br>
							<h1 className="text-center line-clamp-1"> Linkedin Learning </h1>
						</a>
					</div>
				)}
				<div className="border border-slate-130 rounded-lg px-2 py-2">
					<a
						className="flex justify-center flex-col"
						href="https://tatatechnologies.sharepoint.com/sites/Techvarsity/SitePages/Techvarsity.aspx"
					>
						<img
							src={Techvarsitylogo}
							alt="Techvarsity"
							className="aspect-square h-[200px] object-contain"
						></img>
						<br></br>
						<h1 className="text-center line-clamp-1"> Techvarsity Learning </h1>
					</a>
				</div>
				<div className="border border-slate-130 rounded-lg px-2 py-2">
					<a className="flex justify-center flex-col" href="https://nasscom.in/#login-btn">
						<img src={Nasscomlogo} alt="Nasscom" className="aspect-square h-[200px] object-contain"></img>
						<br></br>
						<h1 className="text-center line-clamp-1"> Nasscom Learning </h1>
					</a>
				</div>
			</div>
		</div>
	);
};

export default LearningProgram;
