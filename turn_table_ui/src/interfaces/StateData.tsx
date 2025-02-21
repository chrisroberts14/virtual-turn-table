import type Album from "@/interfaces/Album.tsx";
import type Song from "@/interfaces/Song.tsx";

// Interface for the state data
// Provides helper methods for easy access to the state data in local storage

export interface StateData {
	bff_token?: string;
	spotify_token?: string;
	currentAlbum?: Album;
	currentPage?: number;
	currentSong?: Song;
	currentSongPosition?: number;
}

export const storeStateData = (newState: StateData) => {
	// Store the state in local storage except if the field is null or undefined don't overwrite the current value
	// To do this get the old data from local storage and merge it with the new data
	// Then store the merged data in local storage
	const oldState = getStateData();
	if (!oldState) {
		localStorage.setItem("virtual_turn_table_state", JSON.stringify(newState));
		return;
	}
	const mergedState = { ...oldState, ...newState };
	localStorage.setItem("virtual_turn_table_state", JSON.stringify(mergedState));
};

export const getStateData = (): StateData | null => {
	// Get the state from local storage
	const state = localStorage.getItem("virtual_turn_table_state");
	if (state) {
		return JSON.parse(state);
	}
	return null;
};

export const clearStateData = () => {
	// Clear the state from local storage
	localStorage.removeItem("virtual_turn_table_state");
};
