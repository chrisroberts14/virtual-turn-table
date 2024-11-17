"""Module creating the bff."""

import json
from typing import Annotated

import requests
from fastapi import FastAPI, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from bff.config import Settings, get_settings
from bff.music import music_router
from bff.social import social_router
from bff.user import user_router
from bff.image_search import image_search_router
from bff.api_models import APIException, WebSocketMessage
from bff.websocket import manager

app = FastAPI()
app.include_router(music_router, prefix="/music")
app.include_router(user_router, prefix="/user")
app.include_router(image_search_router, prefix="/image_search")
app.include_router(social_router, prefix="/social")


origins = [
    "http://localhost:5173",
    "https://virtual-turn-table-ui-791764533505.us-central1.run.app",
]

connections: dict[str, list[WebSocket]] = {}


# pylint: disable=too-few-public-methods
class CustomErrorMiddleware(BaseHTTPMiddleware):
    """Custom error handling middleware."""

    async def dispatch(self, request: Request, call_next):
        """
        Dispatch method for middleware.

        :param request:
        :param call_next:
        :return:
        """
        try:
            return await call_next(request)
        except APIException as ex:
            return JSONResponse(
                status_code=ex.status_code,
                content={"status": "error", "message": ex.message},
            )


app.add_middleware(CustomErrorMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def docs_redirect() -> RedirectResponse:
    """
    Redirect to the docs.

    :return:
    """
    return RedirectResponse(url="/docs")


@app.get("/health")
def check_health():
    """
    Endpoint to check health of the api for use with docker compose.

    :return:
    """
    return {"status": "alive"}


@app.websocket("/ws/{username}")
async def websocket_endpoint(
    websocket: WebSocket,
    username: str,
    settings: Annotated[Settings, Depends(get_settings)],
):
    """
    Websocket endpoint for the social service.

    :param settings:
    :param websocket:
    :param username:
    :return:
    """
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            response = WebSocketMessage(**json.loads(data))
            if response.accepted is True:
                response = requests.put(
                    f"{settings.user_data_address}/social/share_accept/{response.notification_id}",
                    timeout=20,
                )
                if response.status_code != 200:
                    await manager.send_message(json.dumps({"success": False}), username)
                else:
                    await manager.send_message(json.dumps({"success": True}), username)
            else:
                response = requests.put(
                    f"{settings.user_data_address}/social/share_reject/{response.notification_id}",
                    timeout=20,
                )
                if response.status_code != 200:
                    await manager.send_message(json.dumps({"success": False}), username)
                else:
                    await manager.send_message(json.dumps({"success": True}), username)

    except WebSocketDisconnect:
        manager.disconnect(websocket, username)
