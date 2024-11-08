"""User API endpoints."""

from typing import Annotated

import requests
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette.status import HTTP_201_CREATED

from bff.api_models import User, APIException, UserIn, AlbumUserLinkIn, GetUsersOut
from bff.config import get_settings, Settings

user_router = APIRouter()


@user_router.get("/get_user_info")
def get_user_info(
    spotify_access_token: str, settings: Annotated[Settings, Depends(get_settings)]
) -> User:
    """
    Get user data from spotify returning only the necessary data.

    :param settings:
    :param spotify_access_token:
    :return:
    """
    endpoint = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}

    response = requests.get(endpoint, headers=headers, timeout=20)
    if response.status_code != 200:
        raise APIException(401, "Invalid access token please re-authenticate.")
    spotify_data = response.json()
    username = spotify_data["display_name"]

    endpoint = f"{settings.user_data_address}/user/is_collection_public/{username}"
    is_collection_public = requests.get(endpoint, timeout=20)
    # The 404 implies the user could not be found so they may just not be in the database yet
    # So don't raise an exception just set it to the default of false
    if is_collection_public.status_code == 404:
        is_collection_public = False
    elif is_collection_public.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    else:
        is_collection_public = is_collection_public.json()

    return User(
        id=spotify_data["id"],
        display_name=username,
        image_url=spotify_data["images"][0]["url"],
        is_collection_public=is_collection_public,
    )


@user_router.post("/create_user")
def create_user(user: UserIn, settings: Annotated[Settings, Depends(get_settings)]):
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
def add_album(
    data_in: AlbumUserLinkIn, settings: Annotated[Settings, Depends(get_settings)]
):
    """
    Add an album to a user's collection.

    Creates the album if it doesn't already exist

    :param settings:
    :param data_in:
    :return:
    """
    # Create the album if it doesn't exist
    endpoint = f"{settings.user_data_address}/user/create_album/{data_in.album_uri}"
    response = requests.post(endpoint, timeout=20)
    if response.status_code != 201:
        raise APIException(400, "Failed to create or find album.")
    # Create the link between the user and the album
    endpoint = f"{settings.user_data_address}/user/add_album_link"
    response = requests.post(endpoint, json=data_in.model_dump(), timeout=20)
    if response.status_code != 201:
        raise APIException(400, "Failed to add album link.")


@user_router.get("/get_user_albums/{user_name}")
def get_users_albums(
    user_name: str, settings: Annotated[Settings, Depends(get_settings)]
) -> list[str]:
    """
    Get all albums for a user.

    :param settings:
    :param user_name:
    :return:
    """
    endpoint = f"{settings.user_data_address}/user/{user_name}/albums"
    response = requests.get(endpoint, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    data = response.json()
    return [album["album_uri"] for album in data]


@user_router.get("/search")
def get_users_by_search(
    query: str,
    spotify_access_token: str,
    settings: Annotated[Settings, Depends(get_settings)],
) -> list[GetUsersOut]:
    """
    Get all users by search.

    :param spotify_access_token:
    :param query:
    :param settings:
    :return:
    """
    endpoint = f"{settings.user_data_address}/user/search"
    response = requests.get(endpoint, params={"query": query}, timeout=20)
    if response.status_code != 200:
        raise APIException(400, "Failed to access user data.")
    # The response now has a list of users
    # Now get their images from spotify
    user_out_data = []
    users = response.json()
    for user in users:
        endpoint = f"https://api.spotify.com/v1/users/{user['username']}"
        headers = {"Authorization": f"Bearer {spotify_access_token}"}
        response = requests.get(endpoint, headers=headers, timeout=20)
        if response.status_code != 200:
            user["image_url"] = ""
        else:
            result = response.json()
            if len(result["images"]) == 0:
                user["image_url"] = ""
            else:
                user["image_url"] = result["images"][0]["url"]
        user_out_data.append(GetUsersOut(**user))
    # Now return the users with their images
    return user_out_data
