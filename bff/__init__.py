"""Module creating the bff."""

from functools import lru_cache
from typing import Annotated

import requests
from fastapi import FastAPI, UploadFile, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from bff.api_models import User, Album, Song
from bff.config import Settings

app = FastAPI()


@lru_cache
def get_settings():
    """
    Get the settings.

    :return:
    """
    return Settings()


# pylint: disable=duplicate-code
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


@app.post("/image_to_uri/")
def image_to_uri(
    file: UploadFile, settings: Annotated[Settings, Depends(get_settings)]
) -> str:
    """
    Take an image and return the best guess of the spotify URI.

    :param settings:
    :param file:
    :return:
    """
    print(settings.image_to_album_address)
    endpoint = f"{settings.image_to_album_address}imgs/reverse_image_search/"
    files = {"file": ("placeholder.jpg", file.file)}

    # Get best results for image search
    response = requests.post(endpoint, files=files, timeout=5)
    response.raise_for_status()

    # Get the URI
    endpoint = (
        f"{settings.image_to_album_address}album/get_uri/?image_name={response.json()}"
    )
    response = requests.post(endpoint, timeout=5)
    response.raise_for_status()
    return response.json()


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
    response.raise_for_status()
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
        raise HTTPException(status_code=400, detail="Invalid album URI")
    endpoint = f"https://api.spotify.com/v1/albums/{album_uri.split(':')[2]}"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=5)
    response.raise_for_status()
    data = response.json()

    return Album(
        title=data["name"],
        artists=[artist["name"] for artist in data["artists"]],
        image_url=data["images"][0]["url"],
        album_uri=data["uri"],
        tracks_url=data["tracks"]["href"],
    )


@app.post("/play_track/")
def play_track(track_uri: str, spotify_access_token: str, device_id: str):
    """
    Play a track on the user's device.

    :param device_id:
    :param track_uri:
    :param spotify_access_token:
    :return:
    """
    endpoint = f"https://api.spotify.com/v1/me/player/play?device_id={device_id}"
    headers = {
        "Authorization": f"Bearer {spotify_access_token}",
        "Content-Type": "application/json",
    }
    data = {"uris": [track_uri]}

    response = requests.put(endpoint, headers=headers, json=data, timeout=5)
    response.raise_for_status()


@app.get("/get_songs_in_album/")
def get_songs_in_album(album_uri: str, spotify_access_token: str) -> list[Song]:
    """
    Get the songs on the album.

    :param album_uri:
    :param spotify_access_token:
    :return:
    """
    endpoint = f"https://api.spotify.com/v1/albums/{album_uri.split(':')[2]}/tracks"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=5)
    response.raise_for_status()

    full_result_url = response.json()["href"]
    full_result = requests.get(full_result_url, headers=headers, timeout=5)
    full_result.raise_for_status()

    result = full_result.json()

    return [
        Song(
            album_uri=album_uri,
            title=track["name"],
            artists=[artist["name"] for artist in track["artists"]],
            uri=track["uri"],
        )
        for track in result["items"]
    ]
