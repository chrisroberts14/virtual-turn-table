"""Authentication module for BFF."""

import os
from datetime import datetime, timedelta, UTC

import jwt
import requests
from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from bff.api_models import APIException

auth_router = APIRouter()
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(user_data: dict) -> str:
    """
    Create an access token.

    :param user_data:
    :return:
    """
    expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"user": user_data, "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify the token.

    :param credentials:
    :return:
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError as exc:
        raise APIException(401, "Could not validate credentials.") from exc


@auth_router.post("/token")
def get_token(spotify_access_token: str) -> dict:
    """
    Get an access token.

    :param spotify_access_token:
    :return:
    """
    # Validate the spotify token by calling the spotify api with it
    endpoint = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}

    response = requests.get(endpoint, headers=headers, timeout=20)
    if response.status_code != 200:
        raise APIException(401, "Invalid access token.")

    username = response.json()["display_name"]
    token = create_access_token(
        {"username": username, "spotify_access_token": spotify_access_token}
    )

    return {"access_token": token}
