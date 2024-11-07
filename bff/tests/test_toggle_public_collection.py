"""Tests for the toggle public collection endpoint."""


class TestShareCollection:
    """Test the toggle public collection endpoint."""

    endpoint = "/social/toggle_collection_public/test_user"

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
