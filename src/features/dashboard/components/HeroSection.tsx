import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "~/helpers/auth";
const HeroSection = () => {
	const { FirstName } = getLoggedUser();
	const navigate = useNavigate();

	return (
		<div className="relative flex  w-full flex-col break-words rounded-lg  bg-gradient-to-l from-pink-300 to-indigo-400   shadow-soft print:border px-7 sm:px-5; mt-8">
			<div className=" flex h-auto items-center justify-between">
				<div className="flex flex-col my-7">
					<h2 className="font-bold tracking-wide text-white line-clamp-1 dark:text-navy-100 lg:text-xl">
						Welcome, {FirstName}
					</h2>
					<div className="mt-2 text-xs text-white max-w-2xl lg:text-sm">
						<span className="font-bold">Profile completion - 60%</span>{" "}
						<span className="font-thin">
							- Complete your profile to access all the features, and preferences based recommendations
						</span>
					</div>
					<div className="mt-6 text-xs lg:text-sm">
						<button
							className="flex items-center justify-center font-semibold rounded-lg text-[#8A8EF5] bg-white px-4 py-3"
							onClick={() => navigate("/account/update/personal")}
						>
							Go to profile
							<Icon icon="akar-icons:arrow-right" className="ml-2.5" />
						</button>
					</div>
				</div>
				<div className="mt-6 self-start mr-24 hidden lg:block relative right-0">
					<div className="w-48 font-bold badge rounded-[244px] px-8 py-4 text-base bg-white ">
						Hi, I’m Cosmos
					</div>
				</div>
			</div>
			<div className="absolute right-3 bottom-0 hidden lg:block">
				<img src="/tiger-pointing.png" alt="tiger" />
			</div>
		</div>
	);
};

export default HeroSection;
