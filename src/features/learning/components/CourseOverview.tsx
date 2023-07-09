import { Icon } from "@iconify/react";

interface Iprops {
	SpecificDetails: any;
	MasterCourses: any;
}
export default function CourseOverview({ SpecificDetails, MasterCourses }: Iprops) {
	return (
		<div>
			<div className="bg-white rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">About the Course</div>
				<p className="text-base">{SpecificDetails.Overview}</p>
			</div>
			<div className="bg-white rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">Prerequesities</div>
				<div className="flex items-center">
					<span className="mr-2">
						<Icon icon="material-symbols:check-small-rounded" width="18" height="18" color="#1268B3" />
					</span>
					<span className="p-1 text-base">{SpecificDetails.Prerequisites}</span>
				</div>
			</div>
			<div className="bg-white rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">Target Audience</div>
				<div className="flex items-center">
					<span className="mr-2">
						<Icon icon="ph:arrow-right-bold" width="16" height="16" color="#1268B3" />
					</span>
					<span className="p-1 text-base">{SpecificDetails.IntendedAudience}</span>
				</div>
			</div>
		</div>
	);
}
