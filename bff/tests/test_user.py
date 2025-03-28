"""Test endpoints in the user router."""

from bff.api_models import AlbumUserLinkIn


class TestGetUser:
    """Test the get_user_info endpoint."""

    endpoint = "/user/get_user_info"

    def test_get_user_info(self, client, mocker):
        """
        Test the get_user_info endpoint.

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
            if url.endswith("/v1/me"):
                mock_response_data = {
                    "display_name": "test_user",
                    "id": "test_user",
                    "images": [{"url": "test_user"}],
                }
                mock_response.json.return_value = mock_response_data
                mock_response.status_code = 200
            else:
                mock_response.status_code = 200
                mock_response.json.return_value = True
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 200
        assert response.json() == {
            "display_name": "test_user",
            "id": "test_user",
            "image_url": "test_user",
            "is_collection_public": True,
        }

    def test_user_info_bad_token(self, client, mocker):
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
            self.endpoint, params={"spotify_access_token": "bad_token"}
        )
        assert response.status_code == 401
        assert response.json() == {
            "message": "Invalid access token please re-authenticate.",
            "status": "error",
        }

    def test_get_user_info_failed(self, client, mocker):
        """
        Test the response if the call to the user_data service fails.

        :param client:
        :param mocker:
        :return:
        """

        def mock_request(url, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            if url.endswith("/v1/me"):
                mock_response_data = {
                    "display_name": "test_user",
                    "id": "test_user",
                    "images": [{"url": "test_user"}],
                }
                mock_response.json.return_value = mock_response_data
                mock_response.status_code = 200
            else:
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }

    def test_get_user_not_in_db(self, client, mocker):
        """
        Test that if the user is not in the database the is_collection_public is False.

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
            if url.endswith("/v1/me"):
                mock_response_data = {
                    "display_name": "test_user",
                    "id": "test_user",
                    "images": [{"url": "test_user"}],
                }
                mock_response.json.return_value = mock_response_data
                mock_response.status_code = 200
            else:
                mock_response.status_code = 404
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint, params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 200
        assert response.json() == {
            "display_name": "test_user",
            "id": "test_user",
            "image_url": "test_user",
            "is_collection_public": False,
        }


class TestCreateUser:
    """Test the create_user endpoint."""

    endpoint = "/user/create_user"

    def test_create_user(self, client, mocker):
        """
        Test creating a user.

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
            mock_response.status_code = 201
            mock_response.json.return_value = {
                "username": "test_user",
                "image_url": "test_user",
            }
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(
            self.endpoint, json={"username": "test_user", "image_url": "test_user"}
        )
        assert response.status_code == 201

    def test_create_user_failed(self, client, mocker):
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
        response = client.post(
            self.endpoint, json={"username": "test_user", "image_url": "test_user"}
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to create user",
            "status": "error",
        }


class TestAddAlbum:
    """Test the add_album endpoint."""

    endpoint = "/user/add_album"
    data_in = AlbumUserLinkIn(album_uri="test_album", user_id="test_user")

    def test_add_album(self, client, mocker):
        """
        Test adding an album.

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
            mock_response.status_code = 201
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, params={"album_uri": "test_album"})
        assert response.status_code == 201

    def test_add_album_creation_failed(self, client, mocker):
        """
        Test the response if the call to the user_data service fails for creating the album.

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
            if "create_album" in url:
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, params={"album_uri": "test_album"})
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to create or find album.",
            "status": "error",
        }

    def test_add_album_link_failed(self, client, mocker):
        """
        Test the response if the call to the user_data service fails for linking the album.

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
            if "create_album" in url:
                mock_response.status_code = 201
            elif "add_album_link" in url:
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, params={"album_uri": "test_album"})
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to add album link.",
            "status": "error",
        }


class TestGetUserAlbums:
    """Test the /user/get_user_albums/{username} endpoint."""

    endpoint = "/user/get_user_albums/{}"

    def test_get_user_albums(self, client, mocker):
        """
        Test working call.

        :return:
        """

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = [{"album_uri": "test"}]
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(self.endpoint.format("test_client"))
        assert response.status_code == 200
        assert response.json() == ["test"]

    def test_get_user_albums_bad_request(self, client, mocker):
        """
        Test call where the user data service fails.

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
        response = client.get(self.endpoint.format("test_client"))
        assert response.status_code == 400

    def test_get_user_albums_collection_not_public_not_shared(self, client, mocker):
        """
        Test call where the user collection is not public.

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
            if "is_collection_public" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = False
            else:
                mock_response.status_code = 200
                mock_response.json.return_value = ["test"]
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(self.endpoint.format("test_user"))
        assert response.status_code == 403
        assert response.json() == {
            "message": "User collection is private.",
            "status": "error",
        }

    def test_get_user_albums_failed_public_collection_call(self, client, mocker):
        """
        Test call where the user collection is not public.

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
        response = client.get(self.endpoint.format("test_user"))
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }

    def test_get_user_albums_failed_get_shared_collections(self, client, mocker):
        """
        Test call where the user collection is not public.

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
            if "is_collection_public" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = True
            else:
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(self.endpoint.format("test_user"))
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to get shared collections",
            "status": "error",
        }


class TestGetUsersBySearch:
    """Test the /user/search endpoint."""

    endpoint = "/user/search"

    def test_get_users_by_search(self, client, mocker):
        """
        Test working call.

        :return:
        """

        def mock_request(url: str, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            if "/user/search" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = [
                    {"username": "test_user", "image_url": "test_user"}
                ]
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test"},
        )
        assert response.status_code == 200
        assert response.json() == [{"username": "test_user", "image_url": "test_user"}]

    def test_get_users_by_search_bad_request(self, client, mocker):
        """
        Test call where the user data service fails.

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
            mock_response.json.return_value = {"detail": "test"}
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test"},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }


class TestGetNotifications:
    """Test the /user/notifications endpoint."""

    endpoint = "/user/get_notifications"

    def test_get_notifications(self, client, mocker):
        """
        Test working call.

        :return:
        """

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = [
                {"id": "test", "sender_id": "test", "receiver_id": "test"}
            ]
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(self.endpoint)
        assert response.status_code == 200
        assert response.json() == [
            {"id": "test", "sender_id": "test", "receiver_id": "test"}
        ]

    def test_get_notifications_bad_request(self, client, mocker):
        """
        Test call where the user data service fails.

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
        response = client.get(self.endpoint)
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }


class TestDeleteUser:
    """Test the /user/ endpoint."""

    endpoint = "/user/"

    def test_delete_user(self, client, mocker):
        """
        Test working call.

        :return:
        """

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.delete", side_effect=mock_request)
        response = client.delete(self.endpoint)
        assert response.status_code == 200

    def test_delete_user_bad_request(self, client, mocker):
        """
        Test call where the user data service fails.

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

        mocker.patch("requests.delete", side_effect=mock_request)
        response = client.delete(self.endpoint)
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to delete user.",
            "status": "error",
        }


class TestIsCollectionPublic:
    """Test the /user/is_collection_public/{username} endpoint."""

    endpoint = "/user/is_collection_public/test_user"

    def test_is_collection_public(self, client, mocker):
        """
        Test working call.

        :return:
        """

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = True
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(self.endpoint)
        assert response.status_code == 200
        assert response.json()

    def test_is_collection_public_bad_request(self, client, mocker):
        """
        Test call where the user data service fails.

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
        response = client.get(self.endpoint)
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }
