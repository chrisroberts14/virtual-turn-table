import type Album from "@/interfaces/Album.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context to allow components to interact with the album selection

interface AlbumSelectionContext {
	hoveredAlbum: Album | null;
	setHoveredAlbum: Dispatch<SetStateAction<Album | null>>;
	albums: Album[];
	setAlbums: Dispatch<SetStateAction<Album[]>>;
}

export const AlbumSelectionContext = createContext<
	AlbumSelectionContext | undefined
>(undefined);

export const useAlbumSelection = () => {
	const context = useContext(AlbumSelectionContext);
	if (context === undefined) {
		throw new Error(
			"useAlbumSelection must be used within an AlbumSelectionProvider",
		);
	}
	return context;
};
