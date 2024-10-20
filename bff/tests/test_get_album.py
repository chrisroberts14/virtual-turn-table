"""Test the get_album_details endpoint."""

from bff import Album


class TestGetAlbum:
    """Tests for the get_album_details endpoint."""

    def test_get_album_details(self, client, mocker):
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
            params={
                "spotify_access_token": "test_token",
                "album_uri": "spotify:album:uri",
            },
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

    def test_get_album_bad_uri(self, client):
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

    def test_get_album_failed_search(self, client, mocker):
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
            params={
                "spotify_access_token": "test_token",
                "album_uri": "spotify:album:uri",
            },
        )
        assert response.status_code == 500
        assert response.json() == {
            "message": "Failed to get album details.",
            "status": "error",
        }
