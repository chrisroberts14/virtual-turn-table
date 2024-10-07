"""Module for all endpoints in the image_to_album API."""

import base64
import logging
from functools import lru_cache
from typing import Annotated

import requests
from fastapi import APIRouter, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse

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
    logger.info(settings.dict())
    logger.info("Received image: %s", file.filename)
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid file type. Only JPEG and PNG are allowed."},
        )

    endpoint = "https://api.bing.microsoft.com/v7.0/images/visualsearch"

    headers = {
        "Ocp-Apim-Subscription-Key": settings.bing_api_key,
    }

    # This contains the image data
    files = {"image": ("placeholder.jpg", file.file)}

    try:
        # Call the Bing Visual Search API
        response = requests.post(endpoint, headers=headers, files=files, timeout=5)
        response.raise_for_status()

        results = response.json()

        # Extract the image names from the response
        for tag in results.get("tags", []):
            for action in tag.get("actions", []):
                if action["actionType"] == "VisualSearch":
                    top_5 = [i["name"] for i in action["data"]["value"][:5]]
                    logger.info("Top 5 image names: %s", top_5)
                    return top_5

    except requests.exceptions.RequestException as e:
        logger.error("Error with API: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@album_router.post("/get_uri/")
async def get_uri(
    settings: Annotated[Settings, Depends(get_settings)], image_names: list[str]
):
    """
    Get the spotify URIs for the album(s).

    :param settings:
    :param image_names: List of image names.
    :return: List of URIs.
    """
    logger.info("Received image names: %s", image_names)

    auth_url = "https://accounts.spotify.com/api/token"

    # Encode client_id and client_secret to base64 for Authorization header
    auth_str = f"{settings.spotify_client_id}:{settings.spotify_client_secret}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {"Authorization": f"Basic {b64_auth_str}"}

    data = {"grant_type": "client_credentials"}

    response = requests.post(auth_url, headers=headers, data=data, timeout=5)
    response_data = response.json()

    search_url = "https://api.spotify.com/v1/search"

    headers = {"Authorization": f'Bearer {response_data['access_token']}'}

    results = []
    for img in image_names:
        logger.info("Image name: %s", img)

        params = {
            "q": img,  # The search query
            "type": "album",  # The type can be album, artist, track, etc.
            "limit": 1,  # The number of items to return
        }

        results.append(
            requests.get(search_url, headers=headers, params=params, timeout=5).json()[
                "albums"
            ]["items"][0]["uri"]
        )

    return max(set(results), key=results.count)
