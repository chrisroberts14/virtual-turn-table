import { createContext, useContext } from "react";

interface WebSocketContextType {
	ws: WebSocket | null;
	setWs: (ws: WebSocket | null) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined,
);

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (context === undefined) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
