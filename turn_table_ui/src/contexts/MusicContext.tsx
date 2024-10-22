import type Album from "@/interfaces/Album.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

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
