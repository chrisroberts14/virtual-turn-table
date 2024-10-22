import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

interface NavigationContextType {
	isSignedIn: boolean;
	setIsSignedIn: Dispatch<SetStateAction<boolean>>;
	nextPage: string;
	setNextPage: Dispatch<SetStateAction<string>>;
	disableTabChange: boolean;
	setDisableTabChange: Dispatch<SetStateAction<boolean>>;
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
