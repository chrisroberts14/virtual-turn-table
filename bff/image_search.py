"""Image search endpoints."""

import base64
from typing import Annotated
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from fastapi import APIRouter, Depends

from bff.api_models import Album, ImagePayload, APIException, ImageToAlbumResponse
from bff.config import get_settings, Settings

image_search_router = APIRouter()


@image_search_router.post("/image_to_album/")
def image_to_album(
    img: ImagePayload, settings: Annotated[Settings, Depends(get_settings)]
) -> ImageToAlbumResponse:
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
    response = requests.post(endpoint, files=files, timeout=20)
    if response.status_code != 200:
        raise APIException(500, "Image search failed please try again.")
    data = response.json()
    # Get the URI
    endpoint = f"{settings.image_to_album_address}/album/get_album/?image_name={data['best_guess']}"
    best_guess_album = requests.post(endpoint, timeout=20)

    top_10_results = []
    with ThreadPoolExecutor() as executor:
        futures = []
        for result in data["top_10_results"]:
            endpoint = f"{settings.image_to_album_address}/album/get_album/?image_name={result}"
            futures.append(executor.submit(requests.post, endpoint, timeout=20))
        for future in as_completed(futures):
            response = future.result()
            if response.status_code != 200 or best_guess_album.status_code != 200:
                raise APIException(500, "Album search failed please try again.")
            top_10_results.append(Album(**response.json()))

    return ImageToAlbumResponse(
        best_guess=Album(**best_guess_album.json()), top_10_results=top_10_results
    )
