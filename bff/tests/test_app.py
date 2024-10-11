"""Tests for the bff api."""

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
            mock_response_data = "spotify:album:4EVnJfjXZjbyb8f2XvIVc2"
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        return mock_response

    mocker.patch("requests.post", side_effect=mock_request)
    with open(Path(__file__).parent / "data/mock_image.jpg", "rb") as file:
        response = client.post("/image_to_uri/", files={"file": file})
    assert response.status_code == 200
    assert response.json() == "spotify:album:4EVnJfjXZjbyb8f2XvIVc2"


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

        :param url:
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
        mock_response_data = Album(
            title="test_name",
            artists=["test_artist"],
            image_url="test_url",
        )
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
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
    assert response.json() == {"detail": "Invalid album URI"}
