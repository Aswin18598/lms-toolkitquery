import parse from "html-react-parser";

import Timeago from "react-timeago";

type Props = {
	title: string;
	views: string;
	authorImage: string;
	authorName: string;
	timeAgo: string;
};

function Card({ title, views, authorImage, authorName, timeAgo }: Props) {
	const authorVid = authorImage.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace('height="315"', 'height="142"');
	return (
		<div className="card min-h-[280px] rounded-xl bg-white border overflow-hidden">
			<div className="w-full h-[142px] flex items-center justify-center">{parse(authorVid)}</div>
			<div className="p-4">
				<h3 className="text-sm font-semibold text-black leading-6 mb-3 line-clamp-1">{title}</h3>
				<p className="mb-5 text-[#6A7681]">{views} views</p>
				<div className="flex flex-wrap flex-row justify-between items-center gap-4">
					<div className="flex items-center">
						<div className="avatar h-8 w-8">
							<div className="is-initial rounded-full bg-[#048BCE] text-sm uppercase text-white">
								{authorName.charAt(0)}
							</div>
						</div>
						<p className="ml-3 text-[#6A7681]">{authorName}</p>
					</div>
					<p className="text-[#6A7681]">
						<Timeago date={timeAgo} />
					</p>
				</div>
			</div>
		</div>
	);
}

export default Card;
