import { getLoggedUser } from "~/helpers/auth";

interface Iprops {
	Status: any;
	setStatus: any;
}
const CourseToggle = ({ Status, setStatus }: Iprops) => {
	const user = getLoggedUser();

	return (
		<div className="flex flex-start gap-8 my-1.5">
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"All"}
					id={`All`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={-1}
					checked={Status === -1}
					onChange={event => setStatus(Number(event.target.value))}
				/>
				<label htmlFor={`All`} className="ml-5">
					All
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`All`}
				></label>
			</div>
			<div className={"relative flex items-center"}>
				<input
					type="radio"
					name={"ModifyByMe"}
					id={`ModifyByMe`}
					className="peer z-2 invisible absolute top-0 bottom-0 m-auto"
					value={user.UserId}
					checked={Status === user.UserId}
					onChange={event => setStatus(event.target.value)}
				/>
				<label htmlFor={`ModifyByMe`} className="ml-5">
					Only Modified by Me
				</label>
				<label
					className='z-1 absolute inline-block w-[14px] h-[14px] rounded-[50%] border top-0 bottom-0 m-auto cursor-pointer peer-checked:bg-primary peer-checked:border-primary after:content-[""] after:w-[7px] after:h-[4px] after:-rotate-45 after:absolute after:top-[25%] after:left-[25%] after:border-2 after:border-white after:border-t-0 after:border-r-0 after:opacity-0 peer-checked:after:opacity-100'
					htmlFor={`ModifyByMe`}
				></label>
			</div>
		</div>
	);
};

export default CourseToggle;
