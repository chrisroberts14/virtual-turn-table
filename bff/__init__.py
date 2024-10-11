"""Module creating the bff."""

from functools import lru_cache
from typing import Annotated

import requests
from fastapi import FastAPI, UploadFile, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from bff.api_models import User, Album
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
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
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
    endpoint = f"{settings.img_to_album_address}imgs/reverse_image_search/"
    files = {"file": ("placeholder.jpg", file.file)}

    # Get best results for image search
    response = requests.post(endpoint, files=files, timeout=5)
    response.raise_for_status()

    # Get the URI
    endpoint = f"{settings.img_to_album_address}album/get_uri/"
    response = requests.post(endpoint, json=response.json(), timeout=5)
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
    endpoint = f"https://api.spotify.com/v1/albums/{album_uri.split(":")[2]}"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=5)
    response.raise_for_status()

    return response.json()
