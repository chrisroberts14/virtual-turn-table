"""Tests for the share collection endpoint."""


class TestShareCollection:
    """Test the share collection endpoint."""

    endpoint = "/social/share_collection"

    def test_share_collection(self, client, mocker):
        """Test sharing a collection."""

        def mock_request(_, **__):
            """
            Mock the request.

            :return:
            """
            mock_response = mocker.Mock()
            mock_response.status_code = 201
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(
            self.endpoint, json={"sharer": "test_user", "receiver": "test_user2"}
        )
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

        mocker.patch("requests.post", side_effect=mock_request)
        response = client.post(
            self.endpoint, json={"sharer": "test_user", "receiver": "test_user2"}
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Failed to share collection",
            "status": "error",
        }
