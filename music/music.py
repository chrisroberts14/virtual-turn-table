"""Music endpoints."""

import logging
import base64

import requests
from fastapi import APIRouter


logger = logging.getLogger(__name__)


music_router = APIRouter()


@music_router.post("/get_album/")
async def get_album(search_string):
    """
    Search spotify for a given string and return the album.

    :param search_string:
    :return:
    """
    logger.info("Searching for album: %s ", search_string)
    client_id = ""
    client_secret = ""

    auth_url = "https://accounts.spotify.com/api/token"

    # Encode client_id and client_secret to base64 for Authorization header
    auth_str = f"{client_id}:{client_secret}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {"Authorization": f"Basic {b64_auth_str}"}

    data = {"grant_type": "client_credentials"}

    response = requests.post(auth_url, headers=headers, data=data, timeout=5)
    response_data = response.json()

    search_url = "https://api.spotify.com/v1/search"

    headers = {"Authorization": f'Bearer {response_data['access_token']}'}

    params = {
        "q": search_string,  # The search query
        "type": "album",  # The type can be album, artist, track, etc.
        "limit": 1,  # The number of items to return
    }

    response = requests.get(search_url, headers=headers, params=params, timeout=5)
    return response.json()
