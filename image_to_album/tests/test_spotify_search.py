"""Test the spotify search endpoint."""

import json
from pathlib import Path


class TestSpotifySearch:
    """Tests for the spotify search endpoint."""

    def test_spotify_search(
        self, client, mocker, mock_spotify_search_data, mock_album_data
    ):
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
            elif url.startswith("https://api.spotify.com/v1/albums"):
                mock_response_data = mock_album_data
            else:
                mock_response_data = mock_spotify_search_data
            mock_response = mocker.Mock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        mocker.patch("requests.get", side_effect=mock_request)

        response = client.post("/album/get_album/", params={"image_name": "test"})
        assert response.status_code == 200

    def test_spotify_search_bad_response_token(self, client, mocker):
        """
        Test get album endpoint with a bad response for token.

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
            mock_response.json.return_value = {"access_token": "test_token"}
            mock_response.status_code = 500
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)

        response = client.post("/album/get_album/", params={"image_name": "test"})
        assert response.status_code == 500
        assert response.json() == {
            "message": "Failed to get the access token",
            "status": "error",
        }

    def test_spotify_search_bad_search(self, client, mocker):
        """
        Test get album endpoint with a bad response for search.

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
            mock_response = mocker.Mock()
            if "https://accounts.spotify.com/api/token" == url:
                mock_response.json.return_value = {"access_token": "test_token"}
                mock_response.status_code = 200
            else:
                mock_response.json.return_value = {}
                mock_response.status_code = 500
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        mocker.patch("requests.get", side_effect=mock_request)

        response = client.post("/album/get_album/", params={"image_name": "test"})
        assert response.status_code == 500
        assert response.json() == {
            "message": "Failed to get the album details",
            "status": "error",
        }

    def test_spotify_search_bad_album_get(self, client, mocker):
        """
        Test get album endpoint with a bad response for album get.

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
            mock_response = mocker.Mock()
            if "https://accounts.spotify.com/api/token" == url:
                mock_response.json.return_value = {"access_token": "test_token"}
                mock_response.status_code = 200
            elif url.startswith("https://api.spotify.com/v1/search"):
                with open(
                    Path(__file__).parent
                    / "mock_api_data/mock_spotify_search_data.json",
                    "r",
                    encoding="utf-8",
                ) as f:
                    mock_response.json.return_value = json.load(f)
                    mock_response.status_code = 200
            else:
                mock_response.json.return_value = {}
                mock_response.status_code = 500
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        mocker.patch("requests.get", side_effect=mock_request)

        response = client.post("/album/get_album/", params={"image_name": "test"})
        assert response.status_code == 500
        assert response.json() == {
            "message": "Failed to get the album details",
            "status": "error",
        }

    def test_spotify_search_no_album(self, client, mocker):
        """
        Test get the album if none is found.

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
            mock_response = mocker.Mock()
            if "https://accounts.spotify.com/api/token" == url:
                mock_response.json.return_value = {"access_token": "test_token"}
                mock_response.status_code = 200
            elif url.startswith("https://api.spotify.com/v1/search"):
                mock_response.json.return_value = {"albums": {"items": []}}
                mock_response.status_code = 200

            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        mocker.patch("requests.get", side_effect=mock_request)

        response = client.post("/album/get_album/", params={"image_name": "test"})
        assert response.status_code == 404
        assert response.json() == {
            "message": "No album found.",
            "status": "error",
        }
