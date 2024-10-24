"""Test the user data endpoints."""


class TestUserDataEndpoints:
    """Test cases for the user_data endpoints."""

    def test_get_user_albums(self, client, mock_user):
        """
        Test the get user albums endpoint.

        :param client:
        :return:
        """
        response = client.get("/user1/albums")
        assert response.status_code == 200
        assert response.json() == [{"album_uri": mock_user.albums[0].album_uri}]

    def test_get_user_albums_no_user(self, client):
        """
        Test the get user albums endpoint with no user.

        :param client:
        :return:
        """
        response = client.get("/user1/albums")
        assert response.status_code == 404
        assert response.json() == {"message": "User not found", "status": "error"}

    def test_create_user(self, client):
        """
        Test the create user endpoint.

        :param client:
        :return:
        """
        response = client.post("/user/", json={"username": "user1", "email": "test"})
        assert response.status_code == 201
        assert response.json() == {"username": "user1", "email": "test", "albums": []}

    def test_create_user_already_exists(self, client):
        """
        Test the create user endpoint when the user already exists.

        :param client:
        :return:
        """
        response = client.post("/user/", json={"username": "user1", "email": "test"})
        assert response.status_code == 201
        assert response.json() == {
            "username": "user1",
            "email": "test",
            "albums": [{"album_uri": "album1"}],
        }

    def test_create_album(self, client):
        """
        Test the create album endpoint.

        :param client:
        :return:
        """
        response = client.post("/create_album/album1/")
        assert response.status_code == 201
        assert response.json() == {"album_uri": "album1"}

    def test_create_album_exists(self, client, mock_album):
        """
        Test the create album endpoint when the album already exists.

        :param client:
        :param mock_album:
        :return:
        """
        response = client.post(f"/create_album/{mock_album.album_uri}/")
        assert response.status_code == 201
        assert response.json() == {"album_uri": mock_album.album_uri}

    def test_create_album_link(self, client, mock_user, mock_album):
        """
        Test the create album link endpoint.

        :param client:
        :return:
        """
        response = client.post(
            "/add_album_link/",
            json={"user_id": mock_user.username, "album_uri": mock_album.album_uri},
        )
        assert response.status_code == 201

    def test_create_album_link_no_user(self, client, mock_album):
        """
        Test the create album link endpoint with no user.

        :param client:
        :return:
        """
        response = client.post(
            "/add_album_link/",
            json={"user_id": "user1", "album_uri": mock_album.album_uri},
        )
        assert response.status_code == 404
        assert response.json() == {"message": "User not found", "status": "error"}

    def test_create_album_link_no_album(self, client, mock_user):
        """
        Test the create album link endpoint with no album.

        :param client:
        :return:
        """
        response = client.post(
            "/add_album_link/",
            json={"user_id": mock_user.username, "album_uri": "album3"},
        )
        assert response.status_code == 404
        assert response.json() == {"message": "Album not found", "status": "error"}
