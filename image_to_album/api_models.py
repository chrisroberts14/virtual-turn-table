"""API models for the image_to_album service."""

from pydantic import BaseModel


# pylint: disable=duplicate-code
class Song(BaseModel):
    """Song model."""

    title: str
    artists: list[str]
    uri: str
    album_uri: str


class Album(BaseModel):
    """Album model."""

    title: str
    artists: list[str]
    image_url: str
    album_uri: str
    tracks_url: str
    songs: list[Song]
