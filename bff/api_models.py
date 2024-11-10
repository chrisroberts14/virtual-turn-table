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
    image_url: str
    is_collection_public: bool = False


class UserIn(BaseModel):
    """User model to be stored in the database."""

    username: str
    image_url: str


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


class Collection(BaseModel):
    """Model for a collection of albums for a user."""

    user_id: str
    albums: list[Album]


class ShareCollectionIn(BaseModel):
    """Model for sharing a collection."""

    sharer: str
    receiver: str


class GetUsersOut(BaseModel):
    """Model for getting users."""

    username: str
    image_url: str
