"""Websocket connection manager."""

from fastapi.websockets import WebSocket


class ConnectionManager:
    """Websocket connection manager."""

    def __init__(self):
        """Initialize the connection manager."""
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, username: str):
        """
        Connect to the websocket.

        :param websocket:
        :param username:
        :return:
        """
        await websocket.accept()
        if username not in self.active_connections:
            self.active_connections[username] = []
        self.active_connections[username].append(websocket)

    def disconnect(self, websocket: WebSocket, username: str):
        """
        Disconnect from the websocket.

        :param websocket:
        :param username:
        :return:
        """
        self.active_connections[username].remove(websocket)

    async def send_message(self, message: str, username: str):
        """
        Send a message to the websocket.

        :param message:
        :param username:
        :return:
        """
        if username in self.active_connections:
            for connection in self.active_connections[username]:
                await connection.send_text(message)


manager = ConnectionManager()
