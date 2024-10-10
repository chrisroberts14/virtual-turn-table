"""Config for api."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings model."""

    app_name: str = "bff"
    vite_spotify_client_id: str = ""
    vite_spotify_redirect_uri: str = ""
    model_config = SettingsConfigDict(env_file=Path(__file__).parent / ".env")
