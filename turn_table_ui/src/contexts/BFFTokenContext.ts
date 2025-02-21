import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context for the BFF token
// Very similar to the SpotifyTokenContext

interface BFFTokenContextType {
	BFFToken: string | null;
	setBFFToken: Dispatch<SetStateAction<string | null>>;
}

export const BFFTokenContext = createContext<BFFTokenContextType | undefined>(
	undefined,
);

export const useBFFToken = () => {
	const context = useContext(BFFTokenContext);
	if (context === undefined) {
		throw new Error("useBFFToken must be used within a BFFTokenProvider");
	}
	return context;
};
