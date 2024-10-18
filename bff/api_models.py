"""API models for the bff."""

from pydantic import BaseModel


class User(BaseModel):
    """User model."""

    id: str
    display_name: str
    email: str
    image_url: str


class Album(BaseModel):  #
    """Album model."""

    title: str
    artists: list[str]
    image_url: str
    album_uri: str
    tracks_url: str


class Song(BaseModel):
    """Song model."""

    title: str
    artists: list[str]
    uri: str
    album_uri: str


class PlaySong(BaseModel):
    """Play song model."""

    track_uri: str
    device_id: str
    spotify_access_token: str
