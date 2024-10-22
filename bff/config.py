"""Config for api."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings model."""

    app_name: str = "bff"
    spotify_client_id: str = os.getenv("SPOTIFY_CLIENT_ID")
    spotify_redirect_uri: str = os.getenv("SPOTIFY_REDIRECT_URI")
    image_to_album_address: str = os.getenv("IMAGE_TO_ALBUM_ADDRESS")
    user_data_address: str = os.getenv("USER_DATA_ADDRESS")
