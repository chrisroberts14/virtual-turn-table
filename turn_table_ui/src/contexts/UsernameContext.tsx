import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context allows components to access the username

interface UsernameContextType {
	username: string | null;
	setUsername: Dispatch<SetStateAction<string | null>>;
}

export const UsernameContext = createContext<UsernameContextType | undefined>(
	undefined,
);

export const useUsername = () => {
	const context = useContext(UsernameContext);
	if (context === undefined) {
		throw new Error("useUsername must be used within a UsernameProvider");
	}
	return context;
};
