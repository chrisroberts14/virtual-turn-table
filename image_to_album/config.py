"""Config for api."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings model."""

    app_name: str = "image_to_album"
    spotify_client_id: str = os.getenv("SPOTIFY_CLIENT_ID")
    spotify_client_secret: str = os.getenv("SPOTIFY_CLIENT_SECRET")
    bing_api_key: str = os.getenv("BING_API_KEY")
