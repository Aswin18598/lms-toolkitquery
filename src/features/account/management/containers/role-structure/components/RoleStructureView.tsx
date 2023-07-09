import { toJpeg } from "html-to-image";
import { kebabCase } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { ReactFlow, useReactFlow } from "reactflow";
import { Modal } from "~/components";
import { nodeTypes } from "./RoleNode";

function RoleStructureView({
	roleStructure,
	title,
	viewToggle,
	isView,
	onNodesChange,
	onEdgesChange,
	onConnectStart,
	onConnectEnd,
	onConnect,
	setRfInstance
}: any) {
	const reactFlowWrapper: any = useRef(null);
	const { setViewport } = useReactFlow();
	const download = useCallback(() => {
		const filter = (node: HTMLElement) => {
			const exclusionClasses = ["noprint", "react-flow__panel"];
			return !exclusionClasses.some(classname => node.classList?.contains(classname));
		};
		if (reactFlowWrapper.current === null) {
			return;
		}

		toJpeg(reactFlowWrapper.current, {
			filter,
			style: {
				transform: "translate(0, 0) scale(1)"
			}
		}).then(dataUrl => {
			const a = document.createElement("a");
			a.setAttribute("download", `${kebabCase(title)}.jpg`);
			a.setAttribute("href", dataUrl);
			a.click();
		});
	}, [title]);
	useEffect(() => {
		if (isView && roleStructure?.nodes?.length > 10) {
			setTimeout(() => {
				setViewport({ x: 0, y: 150, zoom: 0.3 }, { duration: 800 });
			}, 300);
		}
	}, [isView, roleStructure?.nodes?.length]);

	return (
		<>
			<button className="download-btn" onClick={viewToggle}>
				<span>Download Preview</span>
			</button>
			{isView && (
				<Modal
					action={
						<button onClick={download} className="download-btn text-primary text-sm+">
							Download
						</button>
					}
					className="max-w-7xl h-[100%]"
					onCancel={viewToggle}
					title={`${title} Role Structure`}
				>
					{roleStructure && (
						<ReactFlow
							ref={reactFlowWrapper}
							fitView
							defaultViewport={roleStructure.viewPort}
							nodeTypes={nodeTypes}
							nodes={roleStructure.nodes}
							edges={roleStructure.edges}
							onNodesChange={() => undefined}
							onEdgesChange={() => undefined}
							onConnectStart={onConnectStart}
							onConnectEnd={onConnectEnd}
							onConnect={onConnect}
							onInit={setRfInstance}
							className="bg-white w-full h-full rounded-b-lg"
							minZoom={0.1}
						/>
					)}
				</Modal>
			)}
		</>
	);
}

export default RoleStructureView;
