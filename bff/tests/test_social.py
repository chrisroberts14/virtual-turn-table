"""Test social router."""

import json

import pytest


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
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
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
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
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
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get public collections",
            "status": "error",
        }


class TestGetSharedCollections:
    """Test the get shared collections' endpoint."""

    endpoint = "/social/get_shared_collections/test_user"

    def test_get_shared_collections(self, client, mocker):
        """Test getting shared collections."""

        def mock_request(url: str, **__):
            """
            Mock the request.

            :return:
            """
            mock_response_data = NotImplemented
            if url.endswith("/get_shared_collections/test_client"):
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
            self.endpoint,
            params={"offset": 0, "limit": 1},
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

    def test_get_shared_collections_empty_albums(self, client, mocker):
        """Test getting shared collections."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response_data = [{"username": "test_user", "albums": []}]
            mock_response = mocker.Mock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
        )
        result = response.json()
        assert response.status_code == 200
        assert result == [{"user_id": "test_user", "albums": []}]

    def test_get_shared_collections_failed_user_data(self, client, mocker):
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
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get shared collections",
            "status": "error",
        }

    def test_get_shared_collections_bad_spotify(self, client, mocker):
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
            if url.endswith("/get_shared_collections/test_client"):
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
            self.endpoint,
            params={"spotify_access_token": "test_token", "offset": 0, "limit": 1},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get album data",
            "status": "error",
        }


class TestShareCollection:
    """Test the share collection endpoint."""

    endpoint = "/social/share_collection"

    def test_share_collection(self, client, mocker, websocket_client):
        """Test sharing a collection."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 201
            mock_response.json.return_value = {"message": "Collection shared"}
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, params={"receiver": "test_user"})
        assert response.status_code == 200
        assert websocket_client.receive_text() == '{"message": "Collection shared"}'

    def test_share_collection_failed(self, client, mocker):
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

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, params={"receiver": "test_user2"})
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to share collection",
            "status": "error",
        }


class TestToggleCollectionPublic:
    """Test the toggle public collection endpoint."""

    endpoint = "/social/toggle_collection_public"

    def test_share_collection(self, client, mocker):
        """Test sharing a collection."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.put", side_effect=mock_request)
        response = client.put(self.endpoint)
        assert response.status_code == 200

    def test_share_collection_failed(self, client, mocker):
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

        mocker.patch("requests.put", side_effect=mock_request)
        response = client.put(self.endpoint)
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to toggle collection public",
            "status": "error",
        }


class TestWebsocketEndpoint:
    """Test the websocket endpoint."""

    @pytest.mark.parametrize("accepted", ["true", "false"])
    def test_receive_message(self, mocker, websocket_client, accepted):
        """Test receiving a message."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            return mock_response

        data = {"accepted": accepted, "notification_id": "test"}
        mocker.patch("requests.put", side_effect=mock_request)
        websocket_client.send_text(json.dumps(data))
        assert json.loads(websocket_client.receive_text()) == {"success": True}

    @pytest.mark.parametrize("accepted", ["true", "false"])
    def test_receive_message_bad_request(self, mocker, websocket_client, accepted):
        """Test receiving a message."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 400
            return mock_response

        data = {"accepted": accepted, "notification_id": "test"}
        mocker.patch("requests.put", side_effect=mock_request)
        websocket_client.send_text(json.dumps(data))
        assert json.loads(websocket_client.receive_text()) == {"success": False}
