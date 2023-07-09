import { Icon } from "@iconify/react";
interface Iprops {
	handleClear: any;
}
const FilterFeedBack = ({ handleClear }: Iprops) => {
	return (
		<>
			<div className="flex flex-nowrap w-full h-12 justify-between items-center py-4">
				{/* <div className="flex flex-nowrap w-full h-12 justify-between items-center">
					<h1 className="text-[#020A12] font-bold text-sm+">Training Session List</h1>
				</div>
				<div>
				<select
					placeholder="Category"
					className="form-select text-sm rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
				>
					<option value={-1}>{"Category (All)"}</option>
				</select>
				</div>
				<div className="flex flex-nowrap w-full h-12 justify-between items-center">
					<h1 className="text-[#020A12] font-bold text-sm+">
						Thank You Sathiya for your participation in the Training session on Date
					</h1>
				</div>
				<div className="flex flex-wrap w-full gap-2 items-center justify-between">
					<img className="h-40 my-auto" src="/assets/images/Tiger_images/tiger-super.png" alt={"empty"} />
				</div> */}
				<h1 className="text-[#020A12] font-bold text-sm+">Training Session List</h1>
				<button onClick={handleClear}>
					<Icon icon="ic:round-close" className="w-6 h-6" />
				</button>
			</div>
			<select
				placeholder="Category"
				className="form-select text-sm rounded-lg border border-slate-300 bg-white px-2 pr-6 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
			>
				<option value={-1}>{"Category (All)"}</option>
			</select>

			<h1 className="text-[#020A12] font-bold text-sm+">
				Thank You Sathiya for your participation in the Training session on Date
			</h1>
			<img className="h-40 my-auto" src="/assets/images/Tiger_images/tiger-super.png" alt={"empty"} />
		</>
	);
};

export default FilterFeedBack;
