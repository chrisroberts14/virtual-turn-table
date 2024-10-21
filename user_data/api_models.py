"""Models for the user data API."""

from pydantic import BaseModel


class APIException(Exception):
    """API Exception class."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class User(BaseModel):
    """User model."""

    username: str
    email: str


class Album(BaseModel):
    """Album model."""

    # We only store the uri of the album we can then pull it later
    album_uri: str
