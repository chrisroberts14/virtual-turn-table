"""Fixtures for testing."""

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
