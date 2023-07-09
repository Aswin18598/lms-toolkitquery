import React from "react";
import Typewriter from "typewriter-effect";
interface IChatbotOverLayProps {
	isHideText: boolean;
	setIsHideText: React.Dispatch<React.SetStateAction<boolean>>;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
function ChatbotOverLay(props: IChatbotOverLayProps) {
	const { isHideText, setIsHideText, setShow } = props;
	return (
		<div className="fixed sm:bottom-10 md:bottom-10 right-6 z-50 flex flex-col items-end">
			{!isHideText && (
				<div className="flex flex-col items-end justify-center absolute right-[50%] bottom-[100%]">
					<img
						className=""
						role={"button"}
						alt={"close-icon"}
						onClick={() => setIsHideText(true)}
						src={"https://igetitv2-cms-cdn.azureedge.net/wp-content/uploads/2023/02/close_circled.png"}
					/>
					<p className="p-2 whitespace-nowrap text-primary bg-white rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[30px] rounded-br-[5px] border-primary border border-1">
						<Typewriter
							options={{
								strings: "Ask Cosmos",
								autoStart: true,
								loop: true,
								deleteSpeed: 100,
								cursor: ""
							}}
						/>
					</p>
				</div>
			)}
			<img
				role={"button"}
				alt={"chat-icon"}
				onClick={() => setShow(true)}
				className={"w-[60px] h-[60px] md:w-[84px] md:h-[84px] rounded-[50%] z-50 object-cover"}
				src="https://igetitv2-cms-cdn.azureedge.net/wp-content/uploads/2023/02/chat-icon-2.png"
			/>
		</div>
	);
}

export default ChatbotOverLay;
