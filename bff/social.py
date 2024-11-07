"""Social endpoints for the BFF."""

from functools import lru_cache
from typing import Annotated

import requests
from fastapi import APIRouter, Depends

from bff.api_models import Collection, Album, Song, APIException
from bff.config import Settings, get_settings
from bff.api_models import ShareCollectionIn

social_router = APIRouter()


@lru_cache(maxsize=128)
def get_albums(album_uris: tuple[str], spotify_access_token: str):
    """
    Helper function which caches previous calls so we don't end up.

    calling the spotify API multiple times for the same collection.

    :param spotify_access_token:
    :param album_uris:
    :return:
    """
    album_uri_string = ",".join(album_uris)
    spotify_album_data_url = "https://api.spotify.com/v1/albums"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    result = requests.get(
        f"{spotify_album_data_url}?ids={album_uri_string}", headers=headers, timeout=20
    )
    if result.status_code != 200:
        raise APIException(400, "Failed to get album data")
    return result.json()


def convert_response_to_collection(
    spotify_access_token: str, response: dict
) -> Collection:
    """
    Convert the response from the user_data service to a Collection object.

    :param spotify_access_token:
    :param response:
    :return:
    """
    return Collection(
        user_id=response["username"],
        albums=[
            Album(
                title=album["name"],
                artists=[artist["name"] for artist in album["artists"]],
                image_url=album["images"][0]["url"],
                album_uri=album["id"],
                tracks_url=album["tracks"]["href"],
                songs=[
                    Song(
                        title=track["name"],
                        artists=[artist["name"] for artist in track["artists"]],
                        uri=track["uri"],
                        album_uri=album["id"],
                        duration_ms=track["duration_ms"],
                    )
                    for track in album["tracks"]["items"]
                ],
            )
            for album in get_albums(tuple(response["albums"]), spotify_access_token)[
                "albums"
            ]
        ],
    )


@social_router.get("/get_public_collections")
def get_public_collections(
    spotify_access_token: str, settings: Annotated[Settings, Depends(get_settings)]
) -> list[Collection]:
    """Get all public collections."""
    endpoint = f"{settings.user_data_address}/social/get_public_collections"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to get public collections")
    result = response.json()
    # This returns a dictionary with the username and the albums in the following form
    # { "username": "user1", "albums": ["album1URI", "album2URI"] }
    # The max we can do in one call is 20
    # So need to make a call for each user to get the album data
    return [
        convert_response_to_collection(spotify_access_token, user) for user in result
    ]


@social_router.get("/get_shared_collections/{username}")
def get_shared_collections(
    username: str,
    spotify_access_token: str,
    settings: Annotated[Settings, Depends(get_settings)],
) -> list[Collection]:
    """
    Get all collections shared with a user.

    :param username:
    :param spotify_access_token:
    :param settings:
    :return:
    """
    endpoint = f"{settings.user_data_address}/social/get_shared_collections/{username}"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to get shared collections")
    result = response.json()
    return [
        convert_response_to_collection(spotify_access_token, user) for user in result
    ]


@social_router.post("/share_collection")
def share_collection(
    data: ShareCollectionIn, settings: Annotated[Settings, Depends(get_settings)]
):
    """
    Share a collection with another user.

    :param data:
    :param settings:
    :return:
    """
    endpoint = f"{settings.user_data_address}/social/share_collection"
    response = requests.post(endpoint, json=data.model_dump(), timeout=20)
    if response.status_code != 201:
        raise APIException(400, "Failed to share collection")


@social_router.put("/toggle_collection_public/{username}")
def toggle_collection_public(
    username: str, settings: Annotated[Settings, Depends(get_settings)]
):
    """
    Toggle if a user's collection is public.

    :param username:
    :param settings:
    :return:
    """
    endpoint = (
        f"{settings.user_data_address}/social/toggle_collection_public/{username}"
    )
    response = requests.put(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to toggle collection public")
