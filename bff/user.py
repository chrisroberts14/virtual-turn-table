"""User API endpoints."""

from typing import Annotated

import requests
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from bff.api_models import User, APIException, UserIn
from bff.config import get_settings, Settings

user_router = APIRouter()


@user_router.get("/get_user_info/")
def get_user_info(spotify_access_token: str) -> User:
    """
    Get user data from spotify returning only the necessary data.

    :param spotify_access_token:
    :return:
    """
    endpoint = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}

    response = requests.get(endpoint, headers=headers, timeout=5)
    if response.status_code != 200:
        raise APIException(401, "Invalid access token please re-authenticate.")
    data = response.json()

    return User(
        id=data["id"],
        display_name=data["display_name"],
        email=data["email"],
        image_url=data["images"][0]["url"],
    )


@user_router.post("/create_user/")
def create_user(user: UserIn, settings: Annotated[Settings, Depends(get_settings)]):
    """
    Create a user in the database.

    :param settings:
    :param user:
    :return:
    """
    endpoint = f"{settings.user_data_address}user/"
    response = requests.post(endpoint, json=user.model_dump(), timeout=5)
    result = response.json()
    if response.status_code != 201:
        raise APIException(500, "Failed to access user data.")
    return JSONResponse(content=result, status_code=201)
