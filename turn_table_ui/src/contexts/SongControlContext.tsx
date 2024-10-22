import type Song from "@/interfaces/Song.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

interface SongControlContextType {
	isPaused: boolean;
	setIsPaused: Dispatch<SetStateAction<boolean>>;
	currentSong: Song | null;
	setCurrentSong: Dispatch<SetStateAction<Song | null>>;
	deviceId: string;
	setDeviceId: Dispatch<SetStateAction<string>>;
	player: SpotifyPlayer | null;
	setPlayer: Dispatch<SetStateAction<SpotifyPlayer | null>>;
	trackPosition: number;
	setTrackPosition: Dispatch<SetStateAction<number>>;
	trackDuration: number;
	setTrackDuration: Dispatch<SetStateAction<number>>;
	nextSong: Song | null;
	setNextSong: Dispatch<SetStateAction<Song | null>>;
}

export const SongControlContext = createContext<
	SongControlContextType | undefined
>(undefined);

export const useSongControl = () => {
	const context = useContext(SongControlContext);
	if (context === undefined) {
		throw new Error("useSongControl must be used within a SongControlProvider");
	}
	return context;
};
