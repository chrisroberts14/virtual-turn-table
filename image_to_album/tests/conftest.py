"""Fixtures for testing."""

import json
from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient

from image_to_album import app


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:  # pylint: disable=redefined-outer-name
    """
    Fixture for the test client.

    :return:
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def mock_spotify_search_data():
    """Fixture for the mock spotify search."""
    with open(
        Path(__file__).parent / "mock_api_data/mock_spotify_search_data.json",
        "r",
        encoding="utf-8",
    ) as f:
        return json.load(f)


@pytest.fixture(scope="session")
def mock_image_search_data():
    """Fixture for the mock image search data."""
    with open(
        Path(__file__).parent / "mock_api_data/mock_image_search_data.json",
        "r",
        encoding="utf-8",
    ) as f:
        yield json.load(f)


@pytest.fixture(scope="session")
def mock_image():
    """Fixture for the mock image."""
    with open(Path(__file__).parent / "mock_api_data/mock_image.jpg", "rb") as f:
        yield f


@pytest.fixture(scope="session")
def mock_album_data():
    """Fixture for the mock album data."""
    with open(
        Path(__file__).parent / "mock_api_data/mock_album_data.json",
        "r",
        encoding="utf-8",
    ) as f:
        return json.load(f)
