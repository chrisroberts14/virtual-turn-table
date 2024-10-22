"""Music related endpoints."""

import requests
from fastapi import APIRouter

from bff.api_models import PlaySong, APIException, Album, Song

music_router = APIRouter()


@music_router.get("/album_details/")
def get_album_details(spotify_access_token: str, album_uri: str) -> Album:
    """
    Gets the album details given a specific uri.

    :param spotify_access_token:
    :param album_uri:
    :return:
    """
    if not album_uri.startswith("spotify:album:"):
        raise APIException(400, "Album URI must start with 'spotify:album:'")
    endpoint = f"https://api.spotify.com/v1/albums/{album_uri.split(':')[2]}"
    headers = {"Authorization": f"Bearer {spotify_access_token}"}
    response = requests.get(endpoint, headers=headers, timeout=5)
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
            )
            for track in data["tracks"]["items"]
        ],
    )


@music_router.post("/play_track/")
def play_track(data: PlaySong):
    """
    Play a track on the user's device.

    :param data:
    :return:
    """
    if data.device_id is None or data.device_id == "":
        raise APIException(400, "No device id provided.")
    endpoint = f"https://api.spotify.com/v1/me/player/play?device_id={data.device_id}"
    headers = {
        "Authorization": f"Bearer {data.spotify_access_token}",
        "Content-Type": "application/json",
    }
    data = {"uris": [data.track_uri]}

    response = requests.put(endpoint, headers=headers, json=data, timeout=5)
    if response.status_code != 204:
        raise APIException(500, "Failed to play track.")

    return {"message": "Track played successfully.", "status": "success"}
