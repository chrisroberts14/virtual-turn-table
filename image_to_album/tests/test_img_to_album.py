"""Tests for the image to album api."""

import json
from pathlib import Path

import requests


# pylint: disable=duplicate-code
def test_docs_redirect(client):
    """
    Test the redirect to the docs.

    :param client:
    :return:
    """
    response = client.get("/")
    assert response.status_code == 200
    assert str(response.url).endswith("/docs")


def test_check_health(client):
    """
    Test the health check endpoint.

    :param client:
    :return:
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "alive"}


def test_reverse_image_search(client, mocker):
    """
    Test the reverse image search endpoint.

    :param client:
    :return:
    """
    # Mock the response from the image search api
    mock_post = mocker.patch("requests.post")
    with open(
        Path(__file__).parent / "mock_api_data/mock_image_search_data.json",
        "r",
        encoding="utf-8",
    ) as f:
        mock_response_data = json.load(f)
    mock_response = mocker.Mock()
    mock_response.json.return_value = mock_response_data
    mock_post.return_value = mock_response

    with open(Path(__file__).parent / "mock_api_data/mock_image.jpg", "rb") as f:
        response = client.post(
            "/imgs/reverse_image_search/",
            files={
                "file": (
                    "test.jpg",
                    f,
                    "image/jpeg",
                )
            },
        )
    assert response.status_code == 200
    assert response.json() == "Arcade Fire We"


def test_bad_file_type(client):
    """
    Test the reverse image search endpoint with a bad file type.

    :param client:
    :return:
    """
    with open(
        Path(__file__).parent / "mock_api_data/mock_image_search_data.json", "rb"
    ) as f:
        response = client.post(
            "/imgs/reverse_image_search/",
            files={
                "file": (
                    "test.txt",
                    f,
                    "text/plain",
                )
            },
        )
    assert response.status_code == 400
    assert response.json() == {
        "message": "Invalid file type. Only JPEG and PNG are allowed."
    }


def test_api_timeout(client, mocker):
    """
    Test the reverse image search endpoint when the API fails.

    :param client:
    :param mocker:
    :return:
    """
    mocker.patch("requests.post", side_effect=requests.exceptions.ConnectionError)
    with open(Path(__file__).parent / "mock_api_data/mock_image.jpg", "rb") as f:
        response = client.post(
            "/imgs/reverse_image_search/",
            files={
                "file": (
                    "test.jpg",
                    f,
                    "image/jpeg",
                )
            },
        )
    assert response.status_code == 500


def test_api_error(client, mocker):
    """
    Test the reverse image search endpoint when the API fails.

    :param client:
    :param mocker:
    :return:
    """
    mocker.patch("requests.post", side_effect=requests.exceptions.RequestException)
    with open(Path(__file__).parent / "mock_api_data/mock_image.jpg", "rb") as f:
        response = client.post(
            "/imgs/reverse_image_search/",
            files={
                "file": (
                    "test.jpg",
                    f,
                    "image/jpeg",
                )
            },
        )
    assert response.status_code == 500


def test_spotify_search(client, mocker):
    """
    Test get uri endpoint.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(url, **_):
        """
        Mock the request.

        :param url:
        :return:
        """
        if "https://accounts.spotify.com/api/token" == url:
            mock_response_data = {"access_token": "test_token"}
        else:
            with open(
                Path(__file__).parent / "mock_api_data/mock_spotify_search_data.json",
                "r",
                encoding="utf-8",
            ) as f:
                mock_response_data = json.load(f)
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        return mock_response

    mocker.patch("requests.post", side_effect=mock_request)
    mocker.patch("requests.get", side_effect=mock_request)

    response = client.post("/album/get_uri/", params={"image_name": "test"})
    assert response.status_code == 200
