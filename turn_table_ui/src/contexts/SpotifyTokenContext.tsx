import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context for the Spotify token
// Allows different components to use the token in API calls

interface SpotfyTokenContextType {
	token: string | null;
	setToken: Dispatch<SetStateAction<string | null>>;
}

export const SpotifyTokenContext = createContext<
	SpotfyTokenContextType | undefined
>(undefined);

export const useSpotifyToken = () => {
	const context = useContext(SpotifyTokenContext);
	if (context === undefined) {
		throw new Error(
			"useSpotifyToken must be used within a SpotifyTokenProvider",
		);
	}
	return context;
};
