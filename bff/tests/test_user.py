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
            mock_response.json.return_value = {"user_id": "test_user"}
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(self.endpoint, json={"username": "test_user"})
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
        response = client.post(self.endpoint, json={"username": "test_user"})
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
        response = client.post(self.endpoint, json=self.data_in.model_dump())
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
        response = client.post(self.endpoint, json=self.data_in.model_dump())
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
        response = client.post(self.endpoint, json=self.data_in.model_dump())
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to add album link.",
            "status": "error",
        }


class TestGetUserAlbums:
    """Test the /user/get_user_albums/{username} endpoint."""

    endpoint = "/user/get_user_albums/test_user"

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
        response = client.get(self.endpoint)
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
        response = client.get(self.endpoint)
        assert response.status_code == 400


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
                mock_response.json.return_value = [{"username": "test_user"}]
            elif "/v1/users" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = {"images": [{"url": "test_user"}]}
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test", "spotify_access_token": "test_token"},
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
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test", "spotify_access_token": "test_token"},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to access user data.",
            "status": "error",
        }

    def test_get_users_by_search_failed_spotify_call(self, client, mocker):
        """
        Test call where the spotify service fails.

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
            if "/user/search" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = [{"username": "test_user"}]
            elif "/v1/users" in url:
                mock_response.status_code = 400
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test", "spotify_access_token": "test_token"},
        )
        assert response.status_code == 200
        assert response.json() == [{"username": "test_user", "image_url": ""}]

    def test_get_users_by_search_no_user_image(self, client, mocker):
        """
        Test call where the user does not have an image.

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
            if "/user/search" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = [{"username": "test_user"}]
            elif "/v1/users" in url:
                mock_response.status_code = 200
                mock_response.json.return_value = {"images": []}
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            self.endpoint,
            params={"query": "test", "spotify_access_token": "test_token"},
        )
        assert response.status_code == 200
        assert response.json() == [{"username": "test_user", "image_url": ""}]
