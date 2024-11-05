"""Pytest configuration file for integration tests."""

from pathlib import Path

import pytest
import requests


def is_responsive(url):
    """
    Check if the URL is responsive.

    :param url:
    :return:
    """
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return True
    except requests.exceptions.ConnectionError:
        return False
    return False


@pytest.fixture(scope="session")
def docker_compose_file():
    """Get the docker-compose.yml absolute path."""
    return Path(Path(__file__).parent.parent, "compose.yaml")


@pytest.fixture(scope="session", autouse=True)
def http_service(docker_ip, docker_services):
    """Ensure that "some service" is up and responsive."""
    port = docker_services.port_for("bff", 8000)
    url = f"http://{docker_ip}:{port}/health"
    docker_services.wait_until_responsive(
        timeout=30.0, pause=0.1, check=lambda: is_responsive(url)
    )
    return url
