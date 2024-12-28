import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";

interface SuccessContextType {
	success: string | null;
	showSuccess: (message: string) => void;
	clearSuccess: () => void;
}

interface SuccessProviderProps {
	children: ReactNode; // Specify the type for children
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const useSuccess = (): SuccessContextType => {
	const context = useContext(SuccessContext);
	if (!context) {
		throw new Error("Invalid use of success context");
	}
	return context;
};

export const SuccessProvider: React.FC<SuccessProviderProps> = ({
	children,
}) => {
	const [success, setSuccess] = useState<string | null>(null);

	const showSuccess = (message: string) => {
		setSuccess(message);
		setTimeout(() => {
			setSuccess(null);
		}, 5000);
	};

	const clearSuccess = () => {
		setSuccess(null);
	};

	return (
		<SuccessContext.Provider value={{ success, showSuccess, clearSuccess }}>
			{children}
		</SuccessContext.Provider>
	);
};
