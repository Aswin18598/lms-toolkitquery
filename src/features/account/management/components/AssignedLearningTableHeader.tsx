function AssignedLearningTableHeader() {
	return (
		<thead>
			<tr className="bg-table-header">
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					#
				</th>
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					PATH ID
				</th>
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					LEARNING PATH NAME
				</th>
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					COURSES
				</th>
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					ASSESSMENTS
				</th>
				<th className=" whitespace-nowrap text-sm+  px-4 py-3 font-semibold uppercase text-slate-500 lg:px-5">
					ACTION
				</th>
			</tr>
		</thead>
	);
}

export default AssignedLearningTableHeader;
