"""Image search endpoints."""

import base64
from typing import Annotated

import requests
from fastapi import APIRouter, Depends

from bff.api_models import Album, ImagePayload, APIException
from bff.config import get_settings, Settings

image_search_router = APIRouter()


@image_search_router.post("/image_to_album/")
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

    endpoint = f"{settings.image_to_album_address}/imgs/reverse_image_search/"
    files = {"file": ("placeholder.jpg", image_data)}

    # Get best results for image search
    response = requests.post(endpoint, files=files, timeout=10)
    if response.status_code != 200:
        raise APIException(500, "Image search failed please try again.")

    # Get the URI
    endpoint = f"{settings.image_to_album_address}/album/get_album/?image_name={response.json()}"
    response = requests.post(endpoint, timeout=5)
    if response.status_code != 200:
        raise APIException(500, "Album search failed please try again.")

    return Album(**response.json())
