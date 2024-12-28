import type Album from "@/interfaces/Album.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

interface CollectionContext {
	albums: Album[] | undefined;
	setAlbums: Dispatch<SetStateAction<Album[]>>;
	isCollectionOpen: boolean;
	setIsCollectionOpen: (value: boolean) => void;
	username: string | null;
}

export const CollectionContext = createContext<CollectionContext | undefined>(
	undefined,
);

export const useCollection = () => {
	const context = useContext(CollectionContext);
	if (context === undefined) {
		throw new Error("useCollection must be used within a CollectionProvider");
	}
	return context;
};
