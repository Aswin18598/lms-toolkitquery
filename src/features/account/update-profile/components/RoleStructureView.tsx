import classNames from "classnames";
import { toPng } from "html-to-image";
import { kebabCase } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToggle } from "react-use";
import { ReactFlow } from "reactflow";
import { Modal } from "~/components";
import { Spinner } from "~/components/spinner";
import { nodeTypes } from "./RoleNode";
import Select from "react-select";
import { useLazyGetRoleLearningPathQuery } from "../../management/containers/role-structure/store";
import { Icon } from "@iconify/react";

export const nodes: any = [
	{
		id: "1",
		type: "input",
		data: {
			label: "Input Node"
		},
		position: { x: 250, y: 0 }
	},
	{
		id: "2",
		data: {
			label: "Default Node"
		},
		position: { x: 100, y: 100 }
	},
	{
		id: "3",
		type: "output",
		data: {
			label: "Output Node"
		},
		position: { x: 400, y: 100 }
	},
	{
		id: "4",
		type: "custom",
		position: { x: 100, y: 200 },
		data: {
			selects: {
				"handle-0": "smoothstep",
				"handle-1": "smoothstep"
			}
		}
	}
];

export const edges = [
	{ id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
	{ id: "e1-3", source: "1", target: "3", animated: true },
	{
		id: "e4-5",
		source: "4",
		target: "5",
		type: "smoothstep",
		sourceHandle: "handle-0",
		data: {
			selectIndex: 0
		}
	},
	{
		id: "e4-6",
		source: "4",
		target: "6",
		type: "smoothstep",
		sourceHandle: "handle-1",
		data: {
			selectIndex: 1
		}
	}
];

function RoleStructureView({ isTargetRole, roleStructure, title, source, target }: any) {
	const [isModelShow, ToggleModelShow] = useToggle(false);
	const [roles, setRoles] = useState<any>(undefined);
	const [Data, setData] = useState<any>({});
	const reactFlowWrapper: any = useRef(null);
	const [isView, viewToggle] = useToggle(false);
	const [getLearningPath, learningPathOption] = useLazyGetRoleLearningPathQuery();

	useEffect(() => {
		getLearningPath({ Mode: 1 });
	}, []);

	const download = useCallback(() => {
		const filter = (node: HTMLElement) => {
			const exclusionClasses = ["noprint", "react-flow__panel"];
			return !exclusionClasses.some(classname => node.classList?.contains(classname));
		};
		if (reactFlowWrapper.current === null) {
			return;
		}

		toPng(reactFlowWrapper.current, { filter }).then(dataUrl => {
			const a = document.createElement("a");
			a.setAttribute("download", `${kebabCase(title)}.jpg`);
			a.setAttribute("href", dataUrl);
			a.click();
		});
	}, [title]);

	useEffect(() => {
		if (isTargetRole) {
			const tempNodes = roleStructure.nodes.map((node: any) => {
				if (node?.data?.role?.ID === source || node?.data?.role?.ID === target)
					return {
						...node,
						data: { ...node?.data, style: { backgroundColor: "#1268B3", textColor: "#ffffff" } }
					};
				return node;
			});
			setRoles({ ...roleStructure, nodes: tempNodes });
		} else setRoles(roleStructure);
	}, [roleStructure, isTargetRole, source, target]);

	const handleNodeClick = (e: any, node: any) => {
		ToggleModelShow();
		setData(node?.data);
	};

	return (
		<>
			<button
				className={classNames("badge px-2 py-1 rounded text-xs bg-primary/10 font-medium text-primary", {
					"bg-info/10 text-info": isTargetRole
				})}
				onClick={viewToggle}
			>
				<span>{`View ${isTargetRole ? "Target" : ""} Role Structure`}</span>
			</button>
			{isView && (
				<Modal
					action={
						<button onClick={download} className="download-btn text-primary text-sm+">
							Download
						</button>
					}
					className="max-w-7xl h-[80%]"
					onCancel={viewToggle}
					title="Current Role Structure"
				>
					{roles && (
						<ReactFlow
							ref={reactFlowWrapper}
							fitView
							aria-valuemin={roles.viewport}
							nodeTypes={nodeTypes}
							nodes={roles.nodes}
							edges={roles.edges}
							className="bg-white w-full h-full"
							minZoom={0.1}
							onNodeClick={handleNodeClick}
						/>
					)}
				</Modal>
			)}
			{isModelShow && (
				<Modal
					title={`Selected Role`}
					onCancel={ToggleModelShow}
					position="right"
					className="noprint rounded-none rounded-l-lg max-w-2xl h-full relative"
				>
					<div className="flex flex-col p-5 gap-4">
						<div className="flex flex-col gap-1">
							<label className="block space-y-2">
								<span className="text-sm+">Role</span>
								<Select
									maxMenuHeight={150}
									menuPosition="fixed"
									isLoading={roles.isLoading}
									options={roles.data?.Data?.RolesListData}
									getOptionLabel={(option: any) => option.RoleName}
									getOptionValue={(option: any) => option.ID}
									className="mt-1.5"
									value={Data?.role || ""}
									isDisabled
								/>
							</label>
						</div>
						<label className="flex flex-col">
							<span>Role Reference ID</span>
							<input
								className="form-input w-auto rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
								type="text"
								placeholder="Role Reference ID"
								defaultValue={Data?.role_reference_id || ""}
								disabled
							/>
						</label>
						<div className="block">
							<span className="text-sm+">Competency</span>
							<div className="flex flex-col bg-gray-100 rounded-md">
								<div className="flex px-2 bg-gray-200 rounded-t-md">
									<span className="py-2 flex-1 text-sm+">Competency Type</span>
									<span className="py-2 flex-1 text-sm+">Competency Name</span>
									<span className="py-2 flex-1 text-sm+">Level</span>
									<span className="py-2 flex-1 text-sm+">Details</span>
									<span className="w-8"></span>
								</div>
								<div className="flex flex-col gap-2">
									{Data?.skills?.map((item: any, index: number) => (
										<div key={item.id} className="flex gap-2 px-2 items-center justify-center">
											<input
												className="form-input w-1/4 rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
												type="text"
												value={item?.competencyType?.CompetencyTypeName || ""}
												disabled
											/>
											<input
												className="form-input w-1/4 rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
												type="text"
												value={item?.competency?.Name || ""}
												disabled
											/>
											<input
												className="form-input w-1/4 rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
												type="text"
												value={item?.competencyLevel?.Name || ""}
												disabled
											/>
											<input
												className="form-input w-1/4 rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
												type="text"
												placeholder="details"
												value={item?.details || ""}
												disabled
											/>
										</div>
									))}
								</div>
								<button className="flex items-center justify-center p-2 bg-gray-200 rounded-b-md">
									<Icon icon="mingcute:close-line" className="rotate-45" />
								</button>
							</div>
						</div>
						<label className="flex flex-col gap-2">
							<span className="text-sm+">Learning path</span>
							{learningPathOption.data?.Data?.length === 0 && <span>-</span>}
							{learningPathOption.data?.Data?.length !== 0 && (
								<Select
									className="flex-1"
									maxMenuHeight={150}
									menuPosition="fixed"
									isMulti
									options={learningPathOption.data?.Data}
									getOptionLabel={(option: any) => option.LearningPathName}
									getOptionValue={(option: any) => option.PathID}
									isLoading={learningPathOption.isLoading}
									defaultValue={Data?.learning_path || []}
									isDisabled
								/>
							)}
						</label>
					</div>
				</Modal>
			)}
		</>
	);
}

export default RoleStructureView;
