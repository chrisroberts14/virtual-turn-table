"""Module for all endpoints in the image_to_album API."""

import base64
import logging
from functools import lru_cache
from typing import Annotated

import requests
from fastapi import APIRouter, UploadFile, Depends

from image_to_album.api_models import Album, Song, APIException
from image_to_album.config import Settings

logger = logging.getLogger(__name__)


imgs_router = APIRouter()
album_router = APIRouter()


@lru_cache
def get_settings():
    """
    Get the settings.

    :return:
    """
    return Settings()


@imgs_router.post("/reverse_image_search/")
async def reverse_image_search(
    file: UploadFile, settings: Annotated[Settings, Depends(get_settings)]
):
    """
    Upload an image to the API.

    Then do the reverse image search
    :param settings:
    :param file:
    :return A list of the top 5 image names from the reverse image search:
    """
    logger.info(settings.model_dump())
    logger.info("Received image: %s", file.filename)
    if not (
        file.filename.endswith(".jpg")
        or file.filename.endswith(".png")
        or file.filename.endswith(".jpeg")
    ):
        raise APIException(400, "Invalid file type. Please upload a jpg or png.")

    endpoint = "https://api.bing.microsoft.com/v7.0/images/visualsearch"

    headers = {"Ocp-Apim-Subscription-Key": settings.bing_api_key}

    # This contains the image data
    files = {"image": ("placeholder.jpg", file.file)}

    try:
        # Call the Bing Visual Search API
        response = requests.post(endpoint, headers=headers, files=files, timeout=5)
        if response.status_code != 200:
            raise APIException(500, "Image search failed please try again.")

        results = response.json()

        # Extract the image names from the response
        for tag in results.get("tags", []):
            for action in tag.get("actions", []):
                if action["actionType"] == "BestRepresentativeQuery":
                    best_guess = action["displayName"]
                    return best_guess

    except requests.exceptions.RequestException as e:
        logger.error("Error with API: %s", e)
        raise APIException(500, "Error with API") from e


@album_router.post("/get_album/")
async def get_album(
    image_name: str, settings: Annotated[Settings, Depends(get_settings)]
) -> Album:
    """
    Get the spotify URIs for the album(s).

    :param settings:
    :param image_name: Search term.
    :return: URI for the first result in the search term
    """
    logger.info("Received image name: %s", image_name)

    auth_url = "https://accounts.spotify.com/api/token"

    # Encode client_id and client_secret to base64 for Authorization header
    auth_str = f"{settings.spotify_client_id}:{settings.spotify_client_secret}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {"Authorization": f"Basic {b64_auth_str}"}

    data = {"grant_type": "client_credentials"}

    response = requests.post(auth_url, headers=headers, data=data, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Failed to get the access token")
    response_data = response.json()

    search_url = "https://api.spotify.com/v1/search"

    headers = {"Authorization": f"Bearer {response_data['access_token']}"}

    logger.info("Image name: %s", image_name)

    params = {
        "q": image_name,  # The search query
        "type": "album",  # The type can be album, artist, track, etc.
        "limit": 1,  # The number of items to return
    }
    response = requests.get(search_url, headers=headers, params=params, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Failed to get the album details")

    # Get the album details
    data = response.json()
    if len(data["albums"]["items"]) == 0:
        raise APIException(404, "No album found.")
    first_album_link = response.json()["albums"]["items"][0]["href"]
    album_response = requests.get(first_album_link, headers=headers, timeout=5)
    if album_response.status_code != 200:
        raise APIException(500, "Failed to get the album details")

    response_json = response.json()

    return Album(
        title=response_json["albums"]["items"][0]["name"],
        artists=[
            artist["name"] for artist in response_json["albums"]["items"][0]["artists"]
        ],
        image_url=response_json["albums"]["items"][0]["images"][0]["url"],
        album_uri=response_json["albums"]["items"][0]["uri"],
        tracks_url=response_json["albums"]["items"][0]["href"],
        songs=[
            Song(
                title=track["name"],
                artists=[artist["name"] for artist in track["artists"]],
                uri=track["uri"],
                album_uri=response_json["albums"]["items"][0]["uri"],
            )
            for track in album_response.json()["tracks"]["items"]
        ],
    )
