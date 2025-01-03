"""Tests for social sharing functionality."""

from uuid import uuid4


class TestSocial:
    """Test social sharing functionality."""

    def test_get_public_collections(self, client, mock_user_with_public_album):
        """Test getting public collections."""
        response = client.get(
            "/social/get_public_collections", params={"offset": 0, "count": 1}
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "username": mock_user_with_public_album.username,
                "albums": ["album2"],
                "image_url": "image_url",
            }
        ]

    def test_get_shared_collections(
        self, client, user_with_shared_collections, mock_user_with_public_album
    ):
        """Test getting shared collections."""
        response = client.get(
            f"/social/get_shared_collections/{user_with_shared_collections.username}",
            params={"offset": 0, "count": 1},
        )
        assert response.status_code == 200
        assert response.json() == [
            {
                "username": mock_user_with_public_album.username,
                "albums": ["album2"],
                "image_url": "image_url",
            }
        ]

    def test_get_shared_collections_bad_user(self, client):
        """Test getting shared collections for a user that does not exist."""
        response = client.get(
            "/social/get_shared_collections/nonexistent",
            params={"offset": 0, "count": 1},
        )
        assert response.status_code == 404
        assert response.json() == {"message": "User not found", "status": "error"}

    def test_share_collection(self, client, mock_user, mock_user_with_public_album):
        """Test sharing a collection."""
        response = client.post(
            "/social/share_collection",
            json={
                "sharer": mock_user.username,
                "receiver": mock_user_with_public_album.username,
            },
        )
        assert response.status_code == 201

    def test_share_collection_same_user(self, client, mock_user):
        """Test sharing a collection with the same user."""
        response = client.post(
            "/social/share_collection",
            json={"sharer": mock_user.username, "receiver": mock_user.username},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Cannot share with yourself",
            "status": "error",
        }

    def test_share_collection_no_albums(self, client, mock_user_with_no_albums):
        """Test sharing a collection with a user that has no albums."""
        response = client.post(
            "/social/share_collection",
            json={"sharer": mock_user_with_no_albums.username, "receiver": "user2"},
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Sharer has no albums",
            "status": "error",
        }

    def test_share_collection_bad_sharer(self, client):
        """Test sharing a collection with a user that does not exist."""
        response = client.post(
            "/social/share_collection",
            json={"sharer": "nonexistent", "receiver": "user2"},
        )
        assert response.status_code == 404
        assert response.json() == {
            "message": "Sharer not found",
            "status": "error",
        }

    def test_share_collection_bad_receiver(self, client, mock_user):
        """Test sharing a collection with a user that does not exist."""
        response = client.post(
            "/social/share_collection",
            json={"sharer": mock_user.username, "receiver": "nonexistent"},
        )
        assert response.status_code == 404
        assert response.json() == {"message": "Receiver not found", "status": "error"}

    def test_make_collection_public(self, client, mock_user):
        """Test making a collection public."""
        response = client.put(f"/social/toggle_collection_public/{mock_user.username}")
        assert response.status_code == 200

    def test_make_collection_public_bad_user(self, client):
        """
        Test making a collection public for a user that does not exist.

        :param client:
        :return:
        """
        response = client.put("/social/toggle_collection_public/nonexistent")
        assert response.status_code == 404
        assert response.json() == {"message": "User not found", "status": "error"}


class TestShareReject:
    """Test the /social/share_reject endpoint."""

    endpoint = "/social/share_reject"

    def test_share_reject(self, client, mock_notification):
        """
        Test rejecting a shared collection.

        :param client:
        :param mock_notification:
        :return:
        """
        response = client.put(f"{self.endpoint}/{mock_notification.id}")
        assert response.status_code == 200
        assert response.json() == {"message": "Notification deleted"}

    def test_share_reject_bad_notification(self, client):
        """
        Test rejecting a shared collection with a bad notification.

        :param client:
        :return:
        """
        response = client.put(f"{self.endpoint}/{uuid4()}")
        assert response.status_code == 404
        assert response.json() == {
            "message": "Notification not found",
            "status": "error",
        }


class TestShareAccept:
    """Test the /social/share_accept endpoint."""

    endpoint = "/social/share_accept"

    def test_share_accept(self, client, mock_notification):
        """
        Test accepting a shared collection.

        :param client:
        :param mock_notification:
        :return:
        """
        response = client.put(f"{self.endpoint}/{mock_notification.id}")
        assert response.status_code == 200
        assert response.json() == {"message": "Collection shared"}

    def test_share_accept_bad_notification(self, client):
        """
        Test accepting a shared collection with a bad notification.

        :param client:
        :return:
        """
        response = client.put(f"{self.endpoint}/{uuid4()}")
        assert response.status_code == 404
        assert response.json() == {
            "message": "Notification not found",
            "status": "error",
        }
