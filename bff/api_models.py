"""API models for the bff."""

from pydantic import BaseModel


class APIException(Exception):
    """API Exception class."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class User(BaseModel):
    """User model."""

    id: str
    display_name: str
    email: str
    image_url: str


class UserIn(BaseModel):
    """User model to be stored in the database."""

    username: str
    email: str


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


class PlaySong(BaseModel):
    """Play song model."""

    track_uri: str
    device_id: str
    spotify_access_token: str


class ImagePayload(BaseModel):
    """Model for the image payload."""

    image: str  # The image in base64 format


class AlbumUserLinkIn(BaseModel):
    """Model for the album user link."""

    album_uri: str
    user_id: str
