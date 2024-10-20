"""Fixtures for testing."""

from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient

from bff import app


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:  # pylint: disable=redefined-outer-name
    """
    Fixture for the test client.

    :return:
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def mock_image():
    """Fixture for the mock image."""
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as f:
        yield f
