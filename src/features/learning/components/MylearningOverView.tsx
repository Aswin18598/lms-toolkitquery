import { Icon } from "@iconify/react";
interface Iprops {
	SpecificDetails: any;
}
const MylearningOverView = ({ SpecificDetails }: Iprops) => {
	return (
		<div>
			<div className="bg-white border rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">About the Course</div>
				<p className="text-base" style={{ whiteSpace: "pre-line" }}>
					{SpecificDetails.Overview === " " ? "Description of the course" : SpecificDetails.Overview}{" "}
				</p>
			</div>
			<div className="bg-white border rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">Prerequisites</div>
				{SpecificDetails.Prerequisites ? (
					<div className="flex items-center">
						<span>
							{SpecificDetails.Prerequisites !== "There are no course prerequisites." &&
							SpecificDetails.Prerequisites !== " " &&
							SpecificDetails.Prerequisites !== "None." &&
							SpecificDetails.Prerequisites !== "No prereqisites" ? (
								<Icon
									icon="material-symbols:check-small-rounded"
									width="18"
									height="18"
									color="#1268B3"
									className="mr-2"
								/>
							) : (
								""
							)}
						</span>
						<span className="p-1 text-base" style={{ whiteSpace: "pre-line" }}>
							{SpecificDetails.Prerequisites !== " "
								? SpecificDetails.Prerequisites?.split("•")
								: "There are no course prerequisites."}
						</span>
					</div>
				) : (
					<span>There are no course prerequisites.</span>
				)}
			</div>
			<div className="bg-white border rounded-lg mt-6 p-8">
				<div className="font-bold text-xl text-[#020A12] mb-5">Target Audience</div>
				{SpecificDetails.IntendedAudience ? (
					<div className="flex items-center">
						<span>
							{SpecificDetails.IntendedAudience !== " " || null || undefined ? (
								<Icon
									icon="ph:arrow-right-bold"
									width="16"
									height="16"
									color="#1268B3"
									className="mr-2"
								/>
							) : (
								""
							)}
						</span>
						<span className="p-1 text-base" style={{ whiteSpace: "pre-line" }}>
							{SpecificDetails.IntendedAudience !== " "
								? SpecificDetails.IntendedAudience
								: "This course is open to all audiences."}
						</span>
					</div>
				) : (
					<span>This course is open to all audiences.</span>
				)}
			</div>
		</div>
	);
};

export default MylearningOverView;
