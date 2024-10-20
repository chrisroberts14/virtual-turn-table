"""Module creating the bff."""

import base64
from functools import lru_cache
from typing import Annotated

import requests
from fastapi import FastAPI, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from bff.api_models import User, Album, Song, PlaySong, ImagePayload, APIException
from bff.config import Settings

app = FastAPI()


@lru_cache
def get_settings():
    """
    Get the settings.

    :return:
    """
    return Settings()


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.middleware("http")
async def custom_error_handling_middleware(request: Request, call_next):
    """
    Custom error handling middleware.

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


@app.post("/image_to_album/")
def image_to_album(
    img: ImagePayload, settings: Annotated[Settings, Depends(get_settings)]
) -> Album:
    """
    Take an image and return the best guess of the spotify URI.

    :param img:
    :param settings:
    :return:
    """
    image_data = base64.b64decode(img.image.split(",")[1])

    endpoint = f"{settings.image_to_album_address}imgs/reverse_image_search/"
    files = {"file": ("placeholder.jpg", image_data)}

    # Get best results for image search
    response = requests.post(endpoint, files=files, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Image search failed please try again.")

    # Get the URI
    endpoint = f"{settings.image_to_album_address}album/get_album/?image_name={response.json()}"
    response = requests.post(endpoint, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Album search failed please try again.")

    return Album(**response.json())


@app.get("/get_user_info/")
def get_user_info(spotify_access_token: str) -> User:
    """
    Get user data from spotify returning only the necessary data.

    :param spotify_access_token:
    :return:
    """
    endpoint = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}

    response = requests.get(endpoint, headers=headers, timeout=5)
    if response.status_code != 200:
        raise APIException(401, "Invalid access token please re-authenticate.")
    data = response.json()

    return User(
        id=data["id"],
        display_name=data["display_name"],
        email=data["email"],
        image_url=data["images"][0]["url"],
    )


@app.get("/album_details/")
def get_album_details(spotify_access_token: str, album_uri: str) -> Album:
    """
    Gets the album details given a specific uri.

    :param spotify_access_token:
    :param album_uri:
    :return:
    """
    if not album_uri.startswith("spotify:album:"):
        raise APIException(400, "Album URI must start with 'spotify:album:'")
    endpoint = f"https://api.spotify.com/v1/albums/{album_uri.split(':')[2]}"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Failed to get album details.")
    data = response.json()

    return Album(
        title=data["name"],
        artists=[artist["name"] for artist in data["artists"]],
        image_url=data["images"][0]["url"],
        album_uri=data["uri"],
        tracks_url=data["tracks"]["href"],
        songs=[
            Song(
                title=track["name"],
                artists=[artist["name"] for artist in track["artists"]],
                uri=track["uri"],
                album_uri=data["uri"],
            )
            for track in data["tracks"]["items"]
        ],
    )


@app.post("/play_track/")
def play_track(data: PlaySong):
    """
    Play a track on the user's device.

    :param data:
    :return:
    """
    endpoint = f"https://api.spotify.com/v1/me/player/play?device_id={data.device_id}"
    headers = {
        "Authorization": f"Bearer {data.spotify_access_token}",
        "Content-Type": "application/json",
    }
    data = {"uris": [data.track_uri]}

    response = requests.put(endpoint, headers=headers, json=data, timeout=5)
    if response.status_code != 204:
        raise APIException(500, "Failed to play track.")

    return {"message": "Track played successfully.", "status": "success"}
