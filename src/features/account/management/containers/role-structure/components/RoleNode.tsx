import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";
import { Handle, Position } from "reactflow";

const RoleNode = (props: any) => {
	const { data } = props;
	const [searchParam, setSearchParam] = useSearchParams();
	return (
		<section className="bg-[#D3E5F4] w-64 rounded-md">
			<header className="flex text-primary py-2 px-4 rounded-t-md relative">
				<div className="flex-1 flex flex-col justify-center">
					<span className="text-sm font-medium tracking-wide">{data.role.RoleName}</span>
					<div className="flex gap-2 hidden">
						<Icon icon="mingcute:briefcase-line" className="w-3 h-3" />
						<p className="text-xs">{data.role.TotalExpMonths} Month</p>
					</div>
				</div>
				<section className="text-grey-500 flex items-center">
					{!data.isRoot && (
						<button
							data-node-id={props.id}
							onClick={() => data.onDelete(props)}
							className="btn h-7 w-7 p-0 font-medium text-error hover:bg-error/20 focus:none active:bg-error/25"
						>
							<Icon icon="mingcute:delete-2-line" className="w-4 h-4" />
						</button>
					)}
					<button
						onClick={e => {
							console.log("action", searchParam);
							setSearchParam({ node: props.id });
							data.onChange(e, props);
						}}
						className="btn h-7 w-7 p-0 font-medium text-error hover:bg-error/20 focus:none active:bg-error/25"
					>
						<Icon icon="mingcute:pencil-line" className="w-4 h-4" />
					</button>
					<button
						onClick={e => {
							data.onChange(e, props);
						}}
						className="hidden btn h-7 w-7 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
					>
						<Icon icon="mingcute:add-circle-line" className="w-4 h-4" />
					</button>
				</section>
			</header>

			{!data.isRoot && <Handle type="target" position={Position.Bottom} className="w-16 !bg-gray-500" />}
			<Handle type="source" position={Position.Top} className="w-16 !bg-gray-500" />
			{/* <Handle type="target" position={Position.Left} style={{ background: "#555" }} /> */}

			{/* <Handle
				type="target"
				position={Position.Bottom}
				className="h-20 w-1 rounded-none !border-0 !bg-[#b1b1b7]"
			/>*/}
			{/* <Handle type="source" position={Position.Top} className="h-1 w-1 rounded-none !border-0 !bg-[#b1b1b7]" /> */}
		</section>
	);
};

export const nodeTypes = {
	RoleNode
};
