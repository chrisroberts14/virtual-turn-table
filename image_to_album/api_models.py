"""API models for the image_to_album service."""

from pydantic import BaseModel


# pylint: disable=duplicate-code
class Album(BaseModel):  #
    """Album model."""

    title: str
    artists: list[str]
    image_url: str
    album_uri: str
    tracks_url: str
