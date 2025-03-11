"""Fixtures for testing."""

from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient

from bff import app
from bff.social import get_albums
from bff.auth import verify_token


pytestmark = pytest.mark.anyio


@pytest.fixture
def anyio_backend():
    """
    Fixture for the anyio backend.

    :return:
    """
    return "asyncio"


def override_verify_token():
    """Override the verify token function."""
    return {"user": {"username": "test_client", "spotify_access_token": "test_token"}}


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:  # pylint: disable=redefined-outer-name
    """
    Fixture for the test client with authentication.

    :return:
    """
    app.dependency_overrides[verify_token] = override_verify_token
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def mock_image():
    """Fixture for the mock image."""
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as f:
        yield f


@pytest.fixture(scope="function", autouse=True)
def clear_cache():
    """Fixture for clearing the cache."""
    get_albums.cache_clear()
    yield
    get_albums.cache_clear()


@pytest.fixture(scope="function")
def websocket_client(client):  # pylint: disable=redefined-outer-name
    """Fixture for the websocket client."""
    with client.websocket_connect("/ws/test_user") as websocket:
        yield websocket
