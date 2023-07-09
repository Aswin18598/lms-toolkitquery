import { Icon } from "@iconify/react";
import { Handle, Position } from "reactflow";

const RoleNode = (props: any) => {
	const { data } = props;
	return (
		<section
			className={`${
				data?.style?.backgroundColor ? `bg-[${data?.style?.backgroundColor}]` : "bg-[#D3E5F9]"
			} w-64 rounded-md`}
		>
			<header
				className={`flex ${
					data?.style?.textColor ? `text-[${data?.style?.textColor}]` : "text-primary"
				} py-2 px-4 rounded-t-md relative`}
			>
				<div className="flex-1 flex flex-col justify-center">
					<span className="text-sm font-medium text-center tracking-wide">{data.role.RoleName}</span>
					<div className="gap-2 hidden">
						<Icon icon="mingcute:briefcase-line" className="w-3 h-3" />
						<p className="text-xs">{data.role.TotalExpMonths} Month</p>
					</div>
				</div>
			</header>

			{!data.isRoot && <Handle type="target" position={Position.Bottom} className="w-16 !bg-gray-500" />}
			<Handle type="source" position={Position.Top} className="w-16 !bg-gray-500" />
		</section>
	);
};

export const nodeTypes = {
	RoleNode
};
