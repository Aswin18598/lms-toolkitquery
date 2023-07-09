import { Icon } from "@iconify/react";
import React, { useMemo } from "react";
import createDirectLine from "botframework-webchat/lib/createDirectLine";
import ReactWebChat from "botframework-webchat";
import { Resizable } from "re-resizable";
import { getLoggedUser } from "~/helpers/auth";
interface ICustomChatboxProps {
	show?: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomChatBot: React.FC<ICustomChatboxProps> = ({ setShow }) => {
	const secretKey = import.meta.env.VITE_CHATBOT_TOKEN;
	const directLine = useMemo(() => createDirectLine({ secret: secretKey }), []);
	const currentUser = getLoggedUser();
	return (
		<div className="absolute right-6 bottom-16 z-50">
			<Resizable
				defaultSize={{
					width: "25vw",
					height: "calc(90vh - 65px)"
				}}
				enable={{ right: false, top: true, topLeft: true, left: true }}
				maxHeight={"80vh"}
				minHeight={"65px"}
				maxWidth={"90vw"}
				className={"min-w-[70vw] sm:min-w-[20vw]"}
			>
				<main className="w-full h-full overflow-hidden rounded-lg z-50 shadow-light">
					<header className="h-[80px] flex items-center bg-white font-normal w-full justify-between px-4">
						<div className="flex space-x-3 items-center">
							<div className="flex items-end justify-center bg-slate-200 w-12 h-12 rounded-[50%]">
								<img
									alt={"profile"}
									className={"w-10 h-10 rounded-[50%] object-cover"}
									src={"/profile.png"}
								/>
							</div>
							<div>
								<p className="text-lg font-semibold text-black/80">Cosmos</p>
								<p className="text-xs">AI powered chatbot</p>
							</div>
						</div>
						<div className="flex space-x-4">
							<button
								className="close-btn bg-none border-none outline-none cursor-pointer font-[1rem] opacity-70 hover:opacity-100"
								onClick={() => setShow(false)}
							>
								<Icon icon={"material-symbols:close-rounded"} className={"text-xl"} />
							</button>
						</div>
					</header>
					<ReactWebChat
						directLine={directLine}
						locale={"en-Us"}
						userID={currentUser?.UserId}
						username={currentUser?.Email}
						styleOptions={{
							accent: "#348FFC",
							typingAnimationHeight: 20,
							typingAnimationWidth: 100,
							backgroundColor: "#EAEEF3",
							bubbleFromUserTextColor: "#fff",
							bubbleFromUserBackground: "#1268B3",
							bubbleFromUserBorderRadius: 5,
							bubbleBorderRadius: 5,
							suggestedActionBorderColor: "#348FFC",
							suggestedActionBackgroundColor: "#348FFC",
							suggestedActionTextColor: "#fff",
							suggestedActionBorderRadius: 5,
							avatarSize: 30,
							paddingRegular: 15,
							rootHeight: "calc(80vh-80px)",
							rootWidth: "100%",
							hideScrollToEndButton: false,
							sendBoxHeight: "60px",
							hideUploadButton: true,
							scrollToEndButtonBehavior: "unread",
							sendBoxButtonColorOnHover: "#1268B3",
							sendBoxButtonColor: "#1268B3"
						}}
						className={"h-[calc(80vh-80px)]"}
					/>
				</main>
			</Resizable>
		</div>
	);
};

export default CustomChatBot;
