"""Endpoints in the BFF related to social features."""

import json
from functools import lru_cache
from typing import Annotated

import requests
from fastapi import APIRouter, Depends

from bff.api_models import Collection, Album, Song, APIException
from bff.auth import verify_token
from bff.config import Settings, get_settings
from bff.websocket import manager

social_router = APIRouter()


@lru_cache(maxsize=128)
def get_albums(album_uris: tuple[str], spotify_access_token: str):
    """
    Helper function which caches previous calls.

    This is
    so we don't end up calling the spotify API multiple times for the same collection.

    :param spotify_access_token:
    :param album_uris:
    :return:
    """
    if not album_uris:
        return {"albums": []}
    album_uri_string = ",".join(album_uris)
    spotify_album_data_url = "https://api.spotify.com/v1/albums"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    result = requests.get(
        f"{spotify_album_data_url}?ids={album_uri_string}", headers=headers, timeout=20
    )
    if result.status_code != 200:
        raise APIException(400, "Failed to get album data")
    return result.json()


def convert_track_item_to_song(track_item: dict, album_uri: str) -> Song:
    """
    Convert a track item to a Song object.

    :param album_uri:
    :param track_item:
    :return:
    """
    return Song(
        title=track_item["name"],
        artists=[artist["name"] for artist in track_item["artists"]],
        uri=track_item["uri"],
        album_uri=album_uri,
        duration_ms=track_item["duration_ms"],
    )


def convert_album_response_to_albums(
    response: dict, spotify_access_token: str
) -> list[Album]:
    """
    Convert the album response from the user_data service to a list of Album objects.

    :param response:
    :param spotify_access_token:
    :return:
    """
    return [
        Album(
            title=album["name"],
            artists=[artist["name"] for artist in album["artists"]],
            image_url=album["images"][0]["url"],
            album_uri=album["id"],
            tracks_url=album["tracks"]["href"],
            songs=[
                convert_track_item_to_song(track, album["id"])
                for track in album["tracks"]["items"]
            ],
        )
        for album in get_albums(tuple(response["albums"]), spotify_access_token)[
            "albums"
        ]
    ]


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
        albums=convert_album_response_to_albums(response, spotify_access_token),
    )


@social_router.get("/get_public_collections")
async def get_public_collections(
    offset: int,
    limit: int,
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload=Depends(verify_token),
) -> list[Collection]:
    """
    Get all public collections.

    :param offset:
    :param limit:
    :param settings:
    :param auth_payload:
    """
    spotify_access_token = auth_payload["user"]["spotify_access_token"]
    endpoint = f"{settings.user_data_address}/social/get_public_collections"
    response = requests.get(
        endpoint, timeout=20, params={"offset": offset, "count": limit}
    )
    if response.status_code != 200:
        raise APIException(400, "Failed to get public collections")
    return [
        convert_response_to_collection(spotify_access_token, user)
        for user in response.json()
    ]


@social_router.get("/get_shared_collections/{username}")
async def get_shared_collections(
    offset: int,
    limit: int,
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload=Depends(verify_token),
) -> list[Collection]:
    """
    Get all collections shared with a user.

    :param offset:
    :param limit:
    :param settings:
    :param auth_payload:
    :return:
    """
    spotify_access_token = auth_payload["user"]["spotify_access_token"]
    username = auth_payload["user"]["username"]
    endpoint = f"{settings.user_data_address}/social/get_shared_collections/{username}"
    response = requests.get(
        endpoint, timeout=20, params={"offset": offset, "count": limit}
    )
    if response.status_code != 200:
        raise APIException(400, "Failed to get shared collections")
    return [
        convert_response_to_collection(spotify_access_token, user)
        for user in response.json()
    ]


@social_router.post("/share_collection")
async def share_collection(
    receiver: str,
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload=Depends(verify_token),
) -> None:
    """
    Share a collection with another user.

    :param receiver:
    :param settings:
    :param auth_payload:
    :return:
    """
    sender = auth_payload["user"]["username"]
    endpoint = f"{settings.user_data_address}/social/share_collection"
    response = requests.post(
        endpoint, json={"sharer": sender, "receiver": receiver}, timeout=20
    )
    if response.status_code != 201:
        raise APIException(400, "Failed to share collection")
    if receiver in manager.active_connections:
        await manager.send_message(json.dumps(response.json()), receiver)


@social_router.put("/toggle_collection_public")
async def toggle_collection_public(
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload=Depends(verify_token),
) -> None:
    """
    Toggle if a user's collection is public.

    :param auth_payload:
    :param settings:
    :return:
    """
    username = auth_payload["user"]["username"]
    endpoint = (
        f"{settings.user_data_address}/social/toggle_collection_public/{username}"
    )
    response = requests.put(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to toggle collection public")
