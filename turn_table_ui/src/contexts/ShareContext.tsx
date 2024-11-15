// Context for sharing collections

import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

interface ShareContextType {
	shareInputValue: string;
	setShareInputValue: Dispatch<SetStateAction<string>>;
	isShareModalOpen: boolean;
	setIsShareModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const ShareContext = createContext<ShareContextType | undefined>(
	undefined,
);

export const useShare = () => {
	const context = useContext(ShareContext);
	if (context === undefined) {
		throw new Error("useShare must be used within a ShareProvider");
	}
	return context;
};
