import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";

interface ErrorContextType {
	error: string | null;
	showError: (message: string) => void;
	clearError: () => void;
}

interface ErrorProviderProps {
	children: ReactNode; // Specify the type for children
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = (): ErrorContextType => {
	const context = useContext(ErrorContext);
	if (!context) {
		throw new Error("Invalid use of error context");
	}
	return context;
};

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
	const [error, setError] = useState<string | null>(null);

	const showError = (message: string) => {
		setError(message);
		setTimeout(() => {
			setError(null);
		}, 5000);
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<ErrorContext.Provider value={{ error, showError, clearError }}>
			{children}
		</ErrorContext.Provider>
	);
};
