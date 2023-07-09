import { useDispatch } from "react-redux";
import { setSelectedPageSize, setSelectedSearchText } from "../store";

const FilterSectionSkillLevel = ["Basic", "Intermediate", "Advanced"];

interface IProps {
	setSkillIDAndShow: any;
	selectedSkillID: number;
}

function FilterSectionSkill({ setSkillIDAndShow, selectedSkillID }: IProps) {
	const dispatch = useDispatch();

	const handleChange = (e: any) => {
		dispatch(setSelectedSearchText(""));
		setSkillIDAndShow(e.target.value);
		dispatch(setSelectedPageSize(12));
	};

	return (
		<select
			className="form-select text-sm w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
			onChange={handleChange}
			value={selectedSkillID}
		>
			<option key={"skill-1"} value={-1}>
				Skill Level (All)
			</option>
			{FilterSectionSkillLevel?.map((skill: string, index: number) => {
				return (
					<option key={index} value={index + 1}>
						{skill}
					</option>
				);
			})}
		</select>
	);
}

export default FilterSectionSkill;
