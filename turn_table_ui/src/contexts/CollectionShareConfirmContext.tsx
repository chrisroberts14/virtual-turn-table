// Context for sharing collections

import type Notification from "@/interfaces/Notification.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

interface CollectionShareConfirmContextType {
	socket: WebSocket | null;
	setSocket: (socket: WebSocket | null) => void;
	notifications: Notification[];
	setNotifications: Dispatch<SetStateAction<Notification[]>>;
	isCollectionShareModalOpen: boolean;
	setIsCollectionShareModalOpen: (isCollectionShareModalOpen: boolean) => void;
}

export const CollectionShareConfirmContext = createContext<
	CollectionShareConfirmContextType | undefined
>(undefined);

export const useCollectionShareConfirm = () => {
	const context = useContext(CollectionShareConfirmContext);
	if (context === undefined) {
		throw new Error(
			"useCollectionShareConfirm must be used within a CollectionShareConfirmProvider",
		);
	}
	return context;
};
