"""Music related endpoints."""

import requests
from fastapi import APIRouter
from fastapi.params import Depends

from bff.api_models import PlaySong, APIException, Album, Song
from bff.auth import verify_token

music_router = APIRouter()


@music_router.get("/album_details")
async def get_album_details(album_id: str, auth_payload=Depends(verify_token)) -> Album:
    """
    Gets the album details given a specific uri.

    :param auth_payload:
    :param album_id:
    :return:
    """
    spotify_access_token = auth_payload["spotify_access_token"]
    endpoint = f"https://api.spotify.com/v1/albums/{album_id}"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=20)
    if response.status_code != 200:
        raise APIException(500, "Failed to get album details.")
    data = response.json()

    return Album(
        title=data["name"],
        artists=[artist["name"] for artist in data["artists"]],
        image_url=data["images"][0]["url"],
        album_uri=data["uri"],
        tracks_url=data["tracks"]["href"],
        songs=[
            Song(
                title=track["name"],
                artists=[artist["name"] for artist in track["artists"]],
                uri=track["uri"],
                album_uri=data["uri"],
                duration_ms=track["duration_ms"],
            )
            for track in data["tracks"]["items"]
        ],
    )


@music_router.post("/play_track/")
async def play_track(song_data: PlaySong, auth_payload=Depends(verify_token)) -> dict:
    """
    Play a track on the user's device.

    :param song_data:
    :param auth_payload:
    :return:
    """
    spotify_access_token = auth_payload["spotify_access_token"]
    if song_data.device_id is None or song_data.device_id == "":
        raise APIException(400, "No device id provided.")
    endpoint = (
        f"https://api.spotify.com/v1/me/player/play?device_id={song_data.device_id}"
    )
    headers = {
        "Authorization": f"Bearer {spotify_access_token}",
        "Content-Type": "application/json",
    }
    data = {"uris": [song_data.track_uri]}

    response = requests.put(endpoint, headers=headers, json=data, timeout=20)
    if response.status_code != 204:
        raise APIException(500, "Failed to play track.")

    return {"message": "Track played successfully.", "status": "success"}
