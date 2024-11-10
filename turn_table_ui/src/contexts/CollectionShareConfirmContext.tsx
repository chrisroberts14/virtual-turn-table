// Context for sharing collections

import type Sharer from "@/interfaces/Sharer.tsx";
import { createContext, useContext } from "react";

interface CollectionShareConfirmContextType {
	socket: WebSocket | null;
	setSocket: (socket: WebSocket | null) => void;
	sharers: Sharer[];
	setSharers: (sharers: Sharer[]) => void;
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
