"""User API endpoints."""

import json
from typing import Annotated

import requests
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette.status import HTTP_201_CREATED

from bff.api_models import (
    User,
    APIException,
    UserIn,
    GetUsersOut,
    Notification,
)
from bff.auth import verify_token
from bff.config import get_settings, Settings
from bff.websocket import manager

user_router = APIRouter()


@user_router.get("/get_user_info")
async def get_user_info(
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload: dict = Depends(verify_token),
) -> User:
    """
    Get user data from spotify returning only the necessary data.

    :param auth_payload:
    :param settings:
    :return:
    """
    spotify_access_token = auth_payload["user"]["spotify_access_token"]
    endpoint = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}

    response = requests.get(endpoint, headers=headers, timeout=20)
    if response.status_code != 200:
        raise APIException(401, "Invalid access token please re-authenticate.")
    spotify_data = response.json()
    username = spotify_data["display_name"]

    endpoint = f"{settings.user_data_address}/user/is_collection_public/{username}"
    collection_public = requests.get(endpoint, timeout=20)
    # The 404 implies the user could not be found so they may just not be in the database yet
    # So don't raise an exception just set it to the default of false
    if collection_public.status_code == 404:
        collection_public = False
    elif collection_public.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    else:
        collection_public = collection_public.json()

    return User(
        id=spotify_data["id"],
        display_name=username,
        image_url=spotify_data["images"][0]["url"],
        is_collection_public=collection_public,
    )


@user_router.post("/create_user")
async def create_user(
    user: UserIn, settings: Annotated[Settings, Depends(get_settings)]
):
    """
    Create a user in the database.

    :param settings:
    :param user:
    :return:
    """
    endpoint = f"{settings.user_data_address}/user/create_user"
    response = requests.post(endpoint, json=user.model_dump(), timeout=20)
    result = response.json()
    if response.status_code != 201:
        raise APIException(400, "Failed to create user")
    return JSONResponse(content=result, status_code=201)


@user_router.post("/add_album", status_code=HTTP_201_CREATED)
async def add_album(
    album_uri: str,
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload: dict = Depends(verify_token),
):
    """
    Add an album to a user's collection.

    Creates the album if it doesn't already exist

    :param auth_payload:
    :param album_uri:
    :param settings:
    :return:
    """
    user_id = auth_payload["user"]["username"]
    # Create the album if it doesn't exist
    endpoint = f"{settings.user_data_address}/user/create_album/{album_uri}"
    response = requests.post(endpoint, timeout=20)
    if response.status_code != 201:
        raise APIException(400, "Failed to create or find album.")
    # Create the link between the user and the album
    endpoint = f"{settings.user_data_address}/user/add_album_link"
    response = requests.post(
        endpoint, json={"album_uri": album_uri, "user_id": user_id}, timeout=20
    )
    if response.status_code != 201:
        raise APIException(400, "Failed to add album link.")
    await manager.send_message(json.dumps({"message": "Album added"}), user_id)


@user_router.get("/get_user_albums/{user_id}")
async def get_users_albums(
    user_id: str,
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload: dict = Depends(verify_token),
) -> list[str]:
    """
    Get all albums for a user.

    :param auth_payload:
    :param settings:
    :param user_id:
    :return:
    """
    current_user = auth_payload["user"]["username"]
    if current_user != user_id:
        # Check the user has permission to view the collection
        # Either public or shared
        endpoint = f"{settings.user_data_address}/user/is_collection_public/{user_id}"
        response_is_collection_public = requests.get(endpoint, timeout=20)
        if response_is_collection_public.status_code != 200:
            raise APIException(400, "Failed to access user data.")
        # Check if it is shared with the user
        endpoint = (
            f"{settings.user_data_address}/social/get_shared_collections/{current_user}"
        )
        response = requests.get(endpoint, timeout=20)
        if response.status_code != 200:
            raise APIException(400, "Failed to get shared collections")
        shared_collections = response.json()
        if (
            user_id not in shared_collections
            and not response_is_collection_public.json()
        ):
            raise APIException(403, "User collection is private.")

    endpoint = f"{settings.user_data_address}/user/{user_id}/albums"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    data = response.json()
    return [album["album_uri"] for album in data]


@user_router.get("/search")
async def get_users_by_search(
    query: str,
    settings: Annotated[Settings, Depends(get_settings)],
) -> list[GetUsersOut]:
    """
    Get all users by search.

    :param query:
    :param settings:
    :return:
    """
    endpoint = f"{settings.user_data_address}/user/search"
    response = requests.get(endpoint, params={"query": query}, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    return response.json()


@user_router.get("/get_notifications")
async def get_notifications(
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload: dict = Depends(verify_token),
) -> list[Notification]:
    """
    Get all notifications for a user.

    :param auth_payload:
    :param settings:
    :return:
    """
    username = auth_payload["user"]["username"]
    endpoint = f"{settings.user_data_address}/user/notifications/{username}"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    return response.json()


@user_router.get("/is_collection_public/{username}")
async def is_collection_public(
    username: str, settings: Annotated[Settings, Depends(get_settings)]
) -> bool:
    """
    Check if a user's collection is public.

    :param settings:
    :param username:
    :return:
    """
    endpoint = f"{settings.user_data_address}/user/is_collection_public/{username}"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    return response.json()


@user_router.delete("/")
async def delete_user(
    settings: Annotated[Settings, Depends(get_settings)],
    auth_payload: dict = Depends(verify_token),
):
    """
    Delete a user from the database.

    :param settings:
    :param auth_payload:
    :return:
    """
    username = auth_payload["user"]["username"]
    endpoint = f"{settings.user_data_address}/user/{username}"
    response = requests.delete(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to delete user.")
    return JSONResponse(status_code=200, content={"success": True})
