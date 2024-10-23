"""API models for the image_to_album service."""

from pydantic import BaseModel


class APIException(Exception):
    """API Exception class."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class Song(BaseModel):
    """Song model."""

    title: str
    artists: list[str]
    uri: str
    album_uri: str
    duration_ms: int


class Album(BaseModel):
    """Album model."""

    title: str
    artists: list[str]
    image_url: str
    album_uri: str
    tracks_url: str
    songs: list[Song]
