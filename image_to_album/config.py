"""Config for api."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings model."""

    app_name: str = "image_to_album"
    vite_spotify_client_id: str = ""
    vite_spotify_client_secret: str = ""
    bing_api_key: str = ""
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env", extra="ignore"
    )
