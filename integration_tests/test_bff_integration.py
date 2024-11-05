"""Integration tests for the BFF service."""

import requests


def test_status_code_200():
    """First integration test."""
    response = requests.get("http://localhost:8000/health", timeout=5)
    assert response.status_code == 200
