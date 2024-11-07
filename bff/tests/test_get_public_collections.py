"""Test cases for getting public collections."""


class TestGetPublicCollections:
    """Class to test getting public collections."""

    endpoint = "/social/get_public_collections"

    def test_get_public_collections_bad_spotify(self, client, mocker):
        """
        Test the response if the call to the spotify service fails.

        This covers if the token is bad

        :param client:
        :param mocker:
        :return:
        """

        def mock_request(url: str, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            if url.endswith("/get_public_collections"):
                mock_response_data = [
                    {"username": "test_user", "albums": ["test_album"]}
                ]
                mock_response.json.return_value = mock_response_data
                mock_response.status_code = 200
            elif url.startswith("https://api.spotify.com/v1/albums"):
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get album data",
            "status": "error",
        }

    def test_get_public_collections(self, client, mocker):
        """Test getting public collections."""

        def mock_request(url: str, **__):
            """
            Mock the request.

            :return:
            """
            mock_response_data = NotImplemented
            if url.endswith("/get_public_collections"):
                mock_response_data = [
                    {"username": "test_user", "albums": ["test_album"]}
                ]
            elif url.startswith("https://api.spotify.com/v1/albums"):
                mock_response_data = {
                    "albums": [
                        {
                            "name": "string",
                            "artists": [{"name": "string"}],
                            "images": [{"url": "string"}],
                            "id": "string",
                            "tracks": {
                                "href": "string",
                                "items": [
                                    {
                                        "name": "string",
                                        "artists": [{"name": "string"}],
                                        "uri": "string",
                                        "duration_ms": 0,
                                    }
                                ],
                            },
                        }
                    ]
                }
            mock_response = mocker.Mock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        result = response.json()
        assert response.status_code == 200
        assert result == [
            {
                "user_id": "test_user",
                "albums": [
                    {
                        "title": "string",
                        "artists": ["string"],
                        "image_url": "string",
                        "album_uri": "string",
                        "tracks_url": "string",
                        "songs": [
                            {
                                "title": "string",
                                "artists": ["string"],
                                "uri": "string",
                                "album_uri": "string",
                                "duration_ms": 0,
                            }
                        ],
                    }
                ],
            }
        ]

    def test_get_public_collections_failed_user_data(self, client, mocker):
        """
        Test the response if the call to the user_data service fails.

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
            mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get public collections",
            "status": "error",
        }
