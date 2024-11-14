import { BFFWebSocket } from "@/api_calls/BFFEndpoints";
import GetNotifications from "@/api_calls/GetNotifications";
import CollectionShareModal from "@/components/CollectionShareModal";
import { CollectionShareConfirmContext } from "@/contexts/CollectionShareConfirmContext";
import { useUsername } from "@/contexts/UsernameContext";
import type Notification from "@/interfaces/Notification";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";

const CollectionShareNotify = () => {
	const [isCollectionShareModalOpen, setIsCollectionShareModalOpen] =
		useState<boolean>(false);
	const { username } = useUsername();
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		if (username && !socket) {
			setSocket(new WebSocket(`${BFFWebSocket}/${username}`));
		}
		if (username) {
			GetNotifications(username).then((data: Notification[]) => {
				setNotifications(data);
			});
		}
		return () => {
			socket?.close();
		};
	}, [username, socket]);

	useEffect(() => {
		if (socket !== null) {
			socket.onmessage = (event) => {
				if (event.data.id !== undefined) {
					setNotifications([
						...notifications,
						JSON.parse(event.data) as Notification,
					]);
				}
				if (event.data.success) {
					// Show a success message
					console.log("Success!");
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
