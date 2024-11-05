import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context for navigation useful for components that are a part of the navbar

interface NavigationContextType {
	isSignedIn: boolean;
	setIsSignedIn: Dispatch<SetStateAction<boolean>>;
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const NavigationContext = createContext<
	NavigationContextType | undefined
>(undefined);

export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (context === undefined) {
		throw new Error("useNavigation must be used within a NavigationProvider");
	}
	return context;
};
