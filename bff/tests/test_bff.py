"""Tests for the bff api."""

import base64
from pathlib import Path

from bff import Album


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


def test_image_to_uri(client, mocker):
    """
    Test the get_uri endpoint.

    :param client:
    :return:
    """

    def mock_request(url: str, **_):
        """
        Mock the request.

        :param url:
        :return:
        """
        if url.endswith("/reverse_image_search/"):
            mock_response_data = "Arcade Fire We"
        else:
            mock_response_data = Album(
                title="We",
                artists=["Arcade Fire"],
                image_url="test_url",
                album_uri="spotify:album:4EVnJfjXZjbyb8f2XvIVc2",
                tracks_url="test_tracks_url",
                songs=[],
            ).model_dump()
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 200
        return mock_response

    mocker.patch("requests.post", side_effect=mock_request)
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as file:
        base_64_image = base64.b64encode(file.read()).decode("utf-8")

    response = client.post(
        "/image_to_album/", json={"image": f"data:image/jpeg;base64,{base_64_image}"}
    )
    assert response.status_code == 200
    assert (
        response.json()
        == Album(
            title="We",
            artists=["Arcade Fire"],
            image_url="test_url",
            album_uri="spotify:album:4EVnJfjXZjbyb8f2XvIVc2",
            tracks_url="test_tracks_url",
            songs=[],
        ).model_dump()
    )


def test_failed_image_search(client, mocker):
    """
    Test the image_to_uri endpoint where the image search fails.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response = mocker.Mock()
        mock_response.json.return_value = "Arcade Fire We"
        mock_response.status_code = 500
        return mock_response

    mocker.patch("requests.post", side_effect=mock_request)
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as file:
        base_64_image = base64.b64encode(file.read()).decode("utf-8")

    response = client.post(
        "/image_to_album/", json={"image": f"data:image/jpeg;base64,{base_64_image}"}
    )
    assert response.status_code == 500
    assert response.json() == {
        "message": "Image search failed please try again.",
        "status": "error",
    }


def test_failed_album_search(client, mocker):
    """
    Test the image_to_uri endpoint where the album search fails.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(url: str, **_):
        """
        Mock the request.

        :param url:
        :return:
        """
        if url.endswith("/reverse_image_search/"):
            mock_response_data = "Arcade Fire We"
            mock_response_code = 200
        else:
            mock_response_data = Album(
                title="We",
                artists=["Arcade Fire"],
                image_url="test_url",
                album_uri="spotify:album:4EVnJfjXZjbyb8f2XvIVc2",
                tracks_url="test_tracks_url",
                songs=[],
            ).model_dump()
            mock_response_code = 500
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = mock_response_code
        return mock_response

    mocker.patch("requests.post", side_effect=mock_request)
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as file:
        base_64_image = base64.b64encode(file.read()).decode("utf-8")

    response = client.post(
        "/image_to_album/", json={"image": f"data:image/jpeg;base64,{base_64_image}"}
    )
    assert response.status_code == 500
    assert response.json() == {
        "message": "Album search failed please try again.",
        "status": "error",
    }


def test_get_user_info(client, mocker):
    """
    Test the get_user_info endpoint.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response_data = {
            "display_name": "test_user",
            "email": "test_user",
            "id": "test_user",
            "images": [{"url": "test_user"}],
        }
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 200
        return mock_response

    mocker.patch("requests.get", side_effect=mock_request)
    response = client.get(
        "/get_user_info/", params={"spotify_access_token": "test_token"}
    )
    assert response.status_code == 200
    assert response.json() == {
        "display_name": "test_user",
        "email": "test_user",
        "id": "test_user",
        "image_url": "test_user",
    }


def test_user_info_bad_token(client, mocker):
    """
    Test the get_user_info endpoint with a bad token.

    :param client:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response_data = {
            "display_name": "test_user",
            "email": "test_user",
            "id": "test_user",
            "images": [{"url": "test_user"}],
        }
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 401
        return mock_response

    mocker.patch("requests.get", side_effect=mock_request)
    response = client.get(
        "/get_user_info/", params={"spotify_access_token": "bad_token"}
    )
    assert response.status_code == 401
    assert response.json() == {
        "message": "Invalid access token please re-authenticate.",
        "status": "error",
    }


def test_get_album_details(client, mocker):
    """
    Test the get_album_details endpoint.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response_data = {
            "name": "test_name",
            "artists": [{"name": "test_artist"}],
            "images": [{"url": "test_url"}],
            "uri": "test_uri",
            "tracks": {"href": "test_tracks_url", "items": []},
        }
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 200
        return mock_response

    mocker.patch("requests.get", side_effect=mock_request)
    response = client.get(
        "/album_details/",
        params={"spotify_access_token": "test_token", "album_uri": "spotify:album:uri"},
    )
    assert response.status_code == 200
    assert (
        response.json()
        == Album(
            title="test_name",
            artists=["test_artist"],
            image_url="test_url",
            album_uri="test_uri",
            tracks_url="test_tracks_url",
            songs=[],
        ).model_dump()
    )


def test_get_album_bad_uri(client):
    """
    Test the get_album_details endpoint with a bad uri.

    :param client:
    :return:
    """
    response = client.get(
        "/album_details/",
        params={"spotify_access_token": "test_token", "album_uri": "bad_uri"},
    )
    assert response.status_code == 400
    assert response.json() == {
        "message": "Album URI must start with 'spotify:album:'",
        "status": "error",
    }


def test_get_album_failed_search(client, mocker):
    """
    Test the get_album_details endpoint where the search fails.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response_data = {
            "name": "test_name",
            "artists": [{"name": "test_artist"}],
            "images": [{"url": "test_url"}],
            "uri": "test_uri",
            "tracks": {"href": "test_tracks_url", "items": []},
        }
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 500
        return mock_response

    mocker.patch("requests.get", side_effect=mock_request)
    response = client.get(
        "/album_details/",
        params={"spotify_access_token": "test_token", "album_uri": "spotify:album:uri"},
    )
    assert response.status_code == 500
    assert response.json() == {
        "message": "Failed to get album details.",
        "status": "error",
    }


def test_play_track(client, mocker):
    """
    Test the play_track endpoint.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response = mocker.Mock()
        mock_response.status_code = 204
        return mock_response

    mocker.patch("requests.put", side_effect=mock_request)
    response = client.post(
        "/play_track/",
        json={
            "track_uri": "test_uri",
            "device_id": "test_device_id",
            "spotify_access_token": "test_token",
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "message": "Track played successfully.",
        "status": "success",
    }


def test_play_track_fails(client, mocker):
    """
    Test the play_track endpoint where the request fails.

    :param client:
    :param mocker:
    :return:
    """

    def mock_request(_, **__):
        """
        Mock the request.

        :return:
        """
        mock_response = mocker.Mock()
        mock_response.status_code = 500
        return mock_response

    mocker.patch("requests.put", side_effect=mock_request)
    response = client.post(
        "/play_track/",
        json={
            "track_uri": "test_uri",
            "device_id": "test_device_id",
            "spotify_access_token": "test_token",
        },
    )
    assert response.status_code == 500
    assert response.json() == {"message": "Failed to play track.", "status": "error"}
