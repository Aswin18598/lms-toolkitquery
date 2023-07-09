/* eslint-disable sonarjs/cognitive-complexity */
import { Modal } from "~/components";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, MarkerType } from "reactflow";
import Select from "react-select";
import { compact, filter, map } from "lodash";
import { useList, useMap, useToggle } from "react-use";

import {
	useAddEditStructureMutation,
	useGetCompetencyLevelQuery,
	useLazyGetCompetencyQuery,
	useGetCompetencyTypeQuery,
	useLazyGetRoleLearningPathQuery,
	useLazyGetStructureQuery
} from "./../store";
import { useGetAllRolesQuery } from "../../roles/store";
import { nodeTypes } from "./RoleNode";
import { getLoggedUser } from "~/helpers/auth";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "~/components/spinner";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import RoleStructureView from "./RoleStructureView";
interface UpsertSkillsType {
	id: string;
	competency: any;
	competencyType: any;
	competencyLevel: any;
	details: string;
}

const upsertPredicate = (a: UpsertSkillsType, b: UpsertSkillsType) => a.id === b.id;

function CreateOrEdit() {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [rfInstance, setRfInstance] = useState<any>(null);
	const [isAddNode, showAddNode] = useState<any>(false);
	const navigate = useNavigate();
	const [searchParam, setSearchParam] = useSearchParams();
	const [title, setTitle] = useState<string>("");
	const [isLoading, toggleLoading] = useToggle(false);
	const [isView, viewToggle] = useToggle(false);
	const [viewPort, setViewPort] = useState({ x: 0, y: 0, zoom: 0.8 });

	const [nodeData, { set, setAll, reset }] = useMap<{ role: any; role_reference_id: any; learning_path: any }>({
		role: "",
		role_reference_id: "",
		learning_path: []
	});
	const [skills, skill] = useList<any>([]);

	const roles = useGetAllRolesQuery({ Mode: 1, PageSize: 0 });
	const [getCompetency, competency] = useLazyGetCompetencyQuery();
	const competencyLevel = useGetCompetencyLevelQuery({ Mode: 1, PageSize: 0 });
	const [saveStructure, saveStructureOption] = useAddEditStructureMutation();
	const [getStructure, getStructureOption] = useLazyGetStructureQuery();
	const [getLearningPath, learningPathOption] = useLazyGetRoleLearningPathQuery();
	const competencyType = useGetCompetencyTypeQuery({ Mode: 1, PageSize: 0 });

	const reactFlowWrapper: any = useRef(null);
	const connectingNodeId: any = useRef(null);

	const { project, getEdges, getNodes } = useReactFlow();

	const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), [setEdges]);
	const onConnectStart = useCallback((_, { nodeId }) => (connectingNodeId.current = nodeId), []);
	const onConnectEnd = useCallback(
		event => {
			skill.reset();
			showAddNode({ event });
		},
		[project]
	);

	const saveRole = () => {
		if (nodeData?.role !== "") {
			if (!searchParam.has("node")) {
				const { event } = isAddNode;
				const targetIsPane = event?.target.classList.contains("react-flow__pane");
				const { top, left, width, height } = reactFlowWrapper.current.getBoundingClientRect();
				const id = `r_${nodes.length + 1}`;
				const newNode = {
					id,
					type: "RoleNode",
					data: {
						skills,
						...nodeData,
						onChange,
						onDelete,
						isRoot: isAddNode === "root"
					},
					// we are removing the half of the node width (75) to center the new node
					position: project({ x: width - left + 50, y: height - top })
				};

				if (targetIsPane) {
					newNode.position = project({ x: event.clientX - left + 50, y: event.clientY - top + 50 });
					setEdges(eds =>
						eds.concat({
							id,
							source: connectingNodeId.current,
							target: id,
							type: "smoothstep",
							markerEnd: {
								type: MarkerType.ArrowClosed
							}
						})
					);
				} else {
					console.log("targetIsPane nofound");
				}
				setNodes(nds => nds.concat(newNode));
			} else {
				const updatedNode: any = nodes.map((node: any) => {
					if (node.id === searchParam.get("node")) {
						return { ...node, data: { ...node.data, skills, ...nodeData } };
					}
					return node;
				});
				setNodes(updatedNode);
			}
			reset();
			skill.reset();
			showAddNode(false);
		}
	};

	const onChange = (event: any, node: any) => showAddNode({ event, node });

	const onDelete = (node: any) => {
		const removedEdges = compact(
			map(getEdges(), edge => {
				if (edge.source === node.id || edge.id === node.id) return edge.id;
			})
		);
		// console.log("removedEdges", removedEdges);
		const updatedNodes = filter(getNodes(), node => !removedEdges.includes(node.id));
		const updatedEdges = filter(getEdges(), edge => !removedEdges.includes(edge.id));
		// console.log("updatedNodes", updatedNodes);
		// console.log("updatedEdges", updatedEdges);
		setNodes(updatedNodes);
		setEdges(updatedEdges);
	};

	const onSave = useCallback(async () => {
		const { UserId } = getLoggedUser();
		const structure: any = {
			Name: title,
			ResponseJSON: JSON.stringify(rfInstance.toObject()),
			UserID: Number(UserId),
			PathCount: 1,
			IsPublic: 0,
			RoleCompetencyLevelMapData: [],
			RoleStructureLevelMapData: [],
			RoleCompetencyLPMapData: []
		};
		if (searchParam.get("edit")) {
			structure.ID = searchParam.get("edit");
		}
		if (rfInstance) {
			await saveStructure(structure)
				.unwrap()
				.then(() => navigate("/account/management/role-structure"))
				.catch((e: any) => toast.error(e.data.Message));
		}
	}, [rfInstance, title]);

	useEffect(() => {
		getLearningPath({ Mode: 1 });
		if (searchParam.get("edit")) {
			toggleLoading();
			getStructure(searchParam.get("edit"))
				.unwrap()
				.then(resp => {
					const structure = JSON.parse(resp.Data?.ResponseJSON || null);
					setAll({
						role: "",
						role_reference_id: "",
						learning_path: []
					});
					skill.set([{ id: "1", competency: "", competencyType: "", competencyLevel: "", details: "" }]);
					setViewPort(structure.viewport);
					setTitle(resp.Data?.Name || "");
					setEdges(structure.edges);
					setNodes(
						structure.nodes.map((node: any) => {
							node.data = {
								...node.data,
								onChange,
								onDelete
							};
							return node;
						})
					);
				});
			toggleLoading();
		}

		if (searchParam.has("node")) {
			const selectedNode: any = nodes.find((node: any) => node.id === searchParam.get("node"));
			setAll({
				role: selectedNode?.data?.role,
				role_reference_id: selectedNode?.data?.role_reference_id,
				learning_path: selectedNode?.data?.learning_path
			});
			skill.set(selectedNode?.data?.skills || []);
		}
	}, [searchParam]);

	return (
		<>
			<div className="flex-1 flex flex-col h-full relative" ref={reactFlowWrapper}>
				{(saveStructureOption.isLoading || getStructureOption.isLoading) && (
					<div className="absolute inset-0 z-10 grid place-content-center bg-slate-100/80">
						<Spinner />
					</div>
				)}
				<div className="noprint save__controls flex flex-col sm:flex-row gap-4 items-center justify-between py-3 w-full">
					<div className="flex-1 flex items-center">
						<label className="block w-80">
							<input
								id="title"
								value={title}
								onChange={e => setTitle(e.target.value)}
								className={classNames(
									"form-input w-full rounded-lg bg-slate-100 px-3 py-2 ring-primary/50 placeholder:text-slate-400 focus:bg-slate-200 focus:none",
									{ "border-2 border-red-400": !title }
								)}
								placeholder="Untitled"
								type="text"
								autoFocus
							/>
						</label>
					</div>
					<div className="flex gap-3">
						{(!searchParam.has("edit") || nodes.length === 0) && getNodes().length === 0 && (
							<button
								onClick={() => showAddNode("root")}
								className="btn rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80"
							>
								Add Node {getNodes().length}
							</button>
						)}
						{nodes.length !== 0 && (
							<RoleStructureView
								title={title}
								roleStructure={{ viewport: viewPort, nodes: nodes, edges: edges }}
								viewToggle={viewToggle}
								isView={isView}
								onNodesChange={onNodesChange}
								onEdgesChange={onEdgesChange}
								onConnectStart={onConnectStart}
								onConnectEnd={onConnectEnd}
								onConnect={onConnect}
								onInit={setRfInstance}
							/>
						)}
						<Link
							className="btn space-x-2 rounded-full bg-white border font-medium hover:bg-primary/60 hover:text-white"
							to="/account/management/role-structure"
						>
							Cancel
						</Link>
						<button
							disabled={!title}
							className="btn space-x-2 rounded-full bg-primary font-medium text-white hover:bg-primary/90 focus:bg-primary-focus active:bg-primary-focus/90"
							onClick={onSave}
						>
							Save
						</button>
					</div>
				</div>
				{!isView && (
					<ReactFlow
						fitView
						defaultViewport={viewPort}
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnectStart={onConnectStart}
						onConnectEnd={onConnectEnd}
						onConnect={onConnect}
						onInit={setRfInstance}
						className="bg-white w-full"
					/>
				)}
			</div>
			{isAddNode && (
				<Modal
					title={`${!searchParam.has("node") ? "New" : "Update"} Role`}
					action={
						<div className="flex gap-2">
							<button
								onClick={() => {
									setSearchParam({ edit: searchParam.get("edit") || "" });
									showAddNode(false);
								}}
								className="btn rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80"
							>
								Cancel
							</button>
							<button
								onClick={() => saveRole()}
								className="btn rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90"
							>
								{searchParam.has("node") ? "Update" : "Apply"}
							</button>
						</div>
					}
					position="right"
					className="noprint rounded-none rounded-l-lg max-w-4xl h-full relative"
				>
					{isLoading && (
						<div className="absolute inset-0 z-10 grid place-content-center bg-slate-100/90">
							<Spinner />
						</div>
					)}
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
									value={nodeData?.role || ""}
									isDisabled={searchParam.has("node")}
									isOptionDisabled={option =>
										getNodes()
											.map(node => node.data?.role?.ID)
											.includes(option.ID)
									}
									onChange={option => {
										set("role", option);
									}}
								/>
							</label>
							{!nodeData?.role && (
								<span className="text-red-500 text-xs ml-2">This field is required</span>
							)}

							<p className="text-sm hidden">Experience: {nodeData?.role?.TotalExpMonths || 0} Months</p>
						</div>
						<div className="hidden border p-4 rounded-md space-y-2 text-sm+">
							<h6 className="text-black">Clone role details</h6>
							<p className="text-sm">
								The role you have selected is already there in the role structure, do you want to clone
								the role details
							</p>
							<div className="flex gap-4 text-sm">
								<button className="text-primary">Yes, Clone</button>
								<button>No</button>
							</div>
						</div>
						<label className="flex flex-col">
							<span>Role Reference ID</span>
							<input
								className="form-input w-auto rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
								type="text"
								placeholder="Role Reference ID"
								defaultValue={nodeData?.role_reference_id || ""}
								onChange={e => {
									set("role_reference_id", e.target.value);
								}}
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
									{skills.map((item: any, index) => (
										<div key={item.id} className="flex gap-2 px-2 items-center justify-center">
											<Select
												className="flex-1"
												maxMenuHeight={150}
												menuPosition="fixed"
												options={competencyType.data?.Data}
												getOptionLabel={(option: any) => option.CompetencyTypeName}
												getOptionValue={(option: any) => option.ID}
												isLoading={competencyType.isLoading}
												value={item?.competencyType || ""}
												onChange={option => {
													skill.upsert(upsertPredicate, {
														...item,
														competencyType: option
													});
													getCompetency({ Mode: 1, PageSize: 0, CompetencyType: option.ID });
												}}
											/>
											<Select
												className="flex-1"
												maxMenuHeight={150}
												menuPosition="fixed"
												options={competency.data?.Data?.CompetencyListData}
												getOptionLabel={(option: any) => option.Name}
												getOptionValue={(option: any) => option.Name}
												isLoading={competency.isLoading}
												value={item?.competency || ""}
												onChange={option => {
													skill.upsert(upsertPredicate, {
														...item,
														competency: option
													});
												}}
											/>
											<Select
												className="flex-1"
												maxMenuHeight={150}
												menuPosition="fixed"
												options={competencyLevel.data?.Data}
												getOptionLabel={(option: any) => option.CompetencyId}
												getOptionValue={(option: any) => option.CompetencyId}
												isLoading={competencyLevel.isLoading}
												value={item?.competencyLevel || ""}
												onChange={option =>
													skill.upsert(upsertPredicate, {
														...item,
														competencyLevel: option
													})
												}
											/>
											<input
												className="form-input w-auto rounded border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70"
												type="text"
												placeholder="details"
												defaultValue={item?.details || ""}
												onChange={e => {
													skill.upsert(upsertPredicate, {
														...item,
														details: e.target.value
													});
												}}
											/>
											<button
												className="w-8 flex items-center justify-center"
												onClick={() => skill.removeAt(index)}
											>
												<Icon icon="mingcute:close-line" />
											</button>
										</div>
									))}
								</div>
								<button
									className="flex items-center justify-center p-2 bg-gray-200 rounded-b-md"
									onClick={() =>
										skill.upsert(upsertPredicate, {
											id: (skills.length + 1).toString(),
											competency: "",
											competencyType: "",
											competencyLevel: "",
											details: ""
										})
									}
								>
									<Icon icon="mingcute:close-line" className="rotate-45" />
								</button>
							</div>
						</div>
						<label className="flex flex-col gap-2">
							<span className="text-sm+">Learning path</span>
							{learningPathOption.isLoading || (learningPathOption.isFetching && <Spinner />)}
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
									value={nodeData?.learning_path || ""}
									onChange={option => set("learning_path", option)}
								/>
							)}
						</label>
					</div>
				</Modal>
			)}
		</>
	);
}

export default CreateOrEdit;
