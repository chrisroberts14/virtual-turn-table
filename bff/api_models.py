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
