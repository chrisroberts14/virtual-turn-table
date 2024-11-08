"""Models for the user data API."""

from pydantic import BaseModel


class APIException(Exception):
    """API Exception class."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class Album(BaseModel):
    """Album model."""

    # We only store the uri of the album we can then pull it later
    album_uri: str


class User(BaseModel):
    """User model."""

    username: str
    albums: list[Album] = []


class AlbumUserLinkIn(BaseModel):
    """Model for the album user link."""

    album_uri: str
    user_id: str


class ShareCollectionIn(BaseModel):
    """Model for sharing a collection."""

    sharer: str
    receiver: str


class UserSearchOut(BaseModel):
    """Model for output of search for users."""

    username: str
