import { BFFWebSocket } from "@/api_calls/BFFEndpoints";
import GetNotifications from "@/api_calls/GetNotifications";
import CollectionShareModal from "@/components/CollectionShareModal";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { CollectionShareConfirmContext } from "@/contexts/CollectionShareConfirmContext";
import { useUsername } from "@/contexts/UsernameContext";
import type Notification from "@/interfaces/Notification";
import eventEmitter from "@/utils/EventEmitter";
import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";

const CollectionShareNotify = () => {
	const [isCollectionShareModalOpen, setIsCollectionShareModalOpen] =
		useState<boolean>(false);
	const { username } = useUsername();
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { BFFToken } = useBFFToken();

	useEffect(() => {
		if (username && !socket) {
			setSocket(new WebSocket(`${BFFWebSocket}/${username}`));
		}
		if (BFFToken) {
			GetNotifications(BFFToken).then((data: Notification[]) => {
				setNotifications(data);
			});
		}
		return () => {
			socket?.close();
		};
	}, [username, socket, BFFToken]);

	useEffect(() => {
		if (socket !== null) {
			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.id !== undefined) {
					setNotifications([...notifications, data as Notification]);
				}
				if (data.success) {
					// Create an event that will cause a refresh of the social page
					eventEmitter.emit("refresh-social");
				}
			};
		}
	}, [socket, notifications]);

	return (
		<CollectionShareConfirmContext.Provider
			value={{
				socket,
				setSocket,
				notifications,
				setNotifications,
				isCollectionShareModalOpen,
				setIsCollectionShareModalOpen,
			}}
		>
			{notifications.length > 0 && (
				<div className="fixed top-0 right-0 m-3 animate-appearance-in">
					<Tooltip
						placement="left"
						content="Someone's shared their collection with you!"
					>
						<div
							className="bg-green-500 text-white rounded-full w-10 h-10 flex justify-center items-center"
							onClick={() => setIsCollectionShareModalOpen(true)}
							onKeyDown={() => setIsCollectionShareModalOpen(true)}
							onKeyUp={() => setIsCollectionShareModalOpen(true)}
						>
							{notifications.length}
						</div>
					</Tooltip>
				</div>
			)}
			<CollectionShareModal />
		</CollectionShareConfirmContext.Provider>
	);
};

export default CollectionShareNotify;
