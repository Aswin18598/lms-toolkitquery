import { useToggle } from "react-use";
import CourseList from "./CourseList";
import AssessmentList from "./AssessmentList";
import classNames from "classnames";

function PlanLearningDetails() {
	const [on, toggle] = useToggle(true);
	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-lg font-semibold">What you will learn</h2>
			<div className="rounded-lg bg-slate-200 text-slate-600 flex px-1.5 py-1">
				<button
					onClick={() => toggle(!on)}
					className={classNames("btn shrink-0 px-3 py-1.5 font-medium", { "bg-white shadow": on })}
				>
					Courses
				</button>
				<button
					onClick={() => toggle(!on)}
					className={classNames("btn shrink-0 px-3 py-1.5 font-medium", { "bg-white shadow": !on })}
				>
					Assessments
				</button>
			</div>
			<div className="tab-content pt-4">{on ? <CourseList /> : <AssessmentList />}</div>
		</section>
	);
}

export default PlanLearningDetails;
