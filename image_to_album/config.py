"""Config for api."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings model."""

    app_name: str = "image_to_album"
    spotify_client_id: str = os.getenv("SPOTIFY_CLIENT_ID")
    spotify_client_secret: str = os.getenv("SPOTIFY_CLIENT_SECRET")
    google_cloud_credentials: dict = {
        "type": "service_account",
        "project_id": os.getenv("GOOGLE_PROJECT_ID"),
        "private_key_id": os.getenv("GOOGLE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv("GOOGLE_CLIENT_X509_CERT_URL"),
        "universe_domain": "googleapis.com",
    }
