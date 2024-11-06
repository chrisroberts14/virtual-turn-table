"""Test the get_user_info endpoint."""


class TestGetUser:
    """Test the get_user_info endpoint."""

    def test_get_user_info(self, client, mocker):
        """
        Test the get_user_info endpoint.

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
                "display_name": "test_user",
                "id": "test_user",
                "images": [{"url": "test_user"}],
            }
            mock_response = mocker.Mock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.get(
            "/user/get_user_info", params={"spotify_access_token": "test_token"}
        )
        assert response.status_code == 200
        assert response.json() == {
            "display_name": "test_user",
            "id": "test_user",
            "image_url": "test_user",
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
            "/user/get_user_info", params={"spotify_access_token": "bad_token"}
        )
        assert response.status_code == 401
        assert response.json() == {
            "message": "Invalid access token please re-authenticate.",
            "status": "error",
        }
