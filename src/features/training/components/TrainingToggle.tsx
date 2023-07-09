interface Iprops {
	Status: any;
	setStatus: any;
}
const TrainingToggle = ({ Status, setStatus }: Iprops) => {
	return (
		<div className="flex gap-8 my-1.5">
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"OnGoingType"}
					id={`OnGoing`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={"OnGoing"}
					checked={Status === "OnGoing"}
					onChange={event => setStatus(event.target.value)}
				/>
				<label htmlFor={`OnGoing`} className="ml-5">
					OnGoing
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`OnGoing`}
				></label>
			</div>
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"OnGoingType"}
					id={`Completed`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={"Completed"}
					checked={Status === "Completed"}
					onChange={event => setStatus(event.target.value)}
				/>
				<label htmlFor={`Completed`} className="ml-5">
					Completed
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`Completed`}
				></label>
			</div>
		</div>
	);
};

export default TrainingToggle;
