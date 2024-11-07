"""Test the play_track endpoint."""


class TestPlayTrack:
    """Test the play_track endpoint."""

    def test_play_track(self, client, mocker):
        """
        Test the play_track endpoint.

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
            mock_response.status_code = 204
            return mock_response

        mocker.patch("requests.put", side_effect=mock_request)
        response = client.post(
            "/music/play_track/",
            json={
                "track_uri": "test_uri",
                "device_id": "test_device_id",
                "spotify_access_token": "test_token",
            },
        )
        assert response.status_code == 200
        assert response.json() == {
            "message": "Track played successfully.",
            "status": "success",
        }

    def test_play_track_fails(self, client, mocker):
        """
        Test the play_track endpoint where the request fails.

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
            mock_response.status_code = 500
            return mock_response

        mocker.patch("requests.put", side_effect=mock_request)
        response = client.post(
            "/music/play_track/",
            json={
                "track_uri": "test_uri",
                "device_id": "test_device_id",
                "spotify_access_token": "test_token",
            },
        )
        assert response.status_code == 500
        assert response.json() == {
            "message": "Failed to play track.",
            "status": "error",
        }

    def test_play_track_no_device_id(self, client):
        """
        Test the play_track endpoint where no device id is provided.

        :param client:
        :return:
        """
        response = client.post(
            "/music/play_track/",
            json={
                "track_uri": "test_uri",
                "device_id": "",
                "spotify_access_token": "test_token",
            },
        )
        assert response.status_code == 400
        assert response.json() == {
            "message": "No device id provided.",
            "status": "error",
        }
