import { BFFWebSocket } from "@/api_calls/BFFEndpoints.tsx";
import CollectionShareModal from "@/components/CollectionShareModal.tsx";
import { CollectionShareConfirmContext } from "@/contexts/CollectionShareConfirmContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Sharer from "@/interfaces/Sharer.tsx";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";

const CollectionShareNotify = () => {
	const [isCollectionShareModalOpen, setIsCollectionShareModalOpen] =
		useState<boolean>(false);
	const { username } = useUsername();
	const [notificationCount, setNotificationCount] = useState(0);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [sharers, setSharers] = useState<Sharer[]>([]);

	useEffect(() => {
		if (username && !socket) {
			setSocket(new WebSocket(`${BFFWebSocket}/${username}`));
		}

		return () => {
			socket?.close();
		};
	}, [username, socket]);

	useEffect(() => {
		if (socket !== null) {
			socket.onmessage = (event) => {
				onNotification(event.data);
			};
		}
	}, [socket]);

	const onNotification = (eventData: string) => {
		setNotificationCount(notificationCount + 1);
		const data = JSON.parse(eventData);
		setSharers([...sharers, data as Sharer]);
	};

	return (
		<CollectionShareConfirmContext.Provider
			value={{
				socket,
				setSocket,
				sharers,
				setSharers,
				isCollectionShareModalOpen,
				setIsCollectionShareModalOpen,
			}}
		>
			{notificationCount > 0 && (
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
							{notificationCount}
						</div>
					</Tooltip>
				</div>
			)}
			<CollectionShareModal />
		</CollectionShareConfirmContext.Provider>
	);
};

export default CollectionShareNotify;
