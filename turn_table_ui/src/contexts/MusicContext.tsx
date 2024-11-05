import type Album from "@/interfaces/Album.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Many components need to know the current album
// So use a context to store the current album
// Other music related data is in a different context

interface MusicContextType {
	currentAlbum: Album | null;
	setCurrentAlbum: Dispatch<SetStateAction<Album | null>>;
}

export const MusicContext = createContext<MusicContextType | undefined>(
	undefined,
);

export const useMusic = () => {
	const context = useContext(MusicContext);
	if (context === undefined) {
		throw new Error("useMusic must be used within a MusicProvider");
	}
	return context;
};
