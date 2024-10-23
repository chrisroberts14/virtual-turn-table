"""Tests for the reverse image search endpoint."""

from pathlib import Path


class TestReverseImageSearch:
    """Tests for the reverse image search endpoint."""

    def test_reverse_image_search(self, client, mocker, mock_image):
        """
        Test the reverse image search endpoint.

        :param client:
        :return:
        """
        # Mock the response from the image search api
        mock = mocker.patch("google.cloud.vision.ImageAnnotatorClient.web_detection")
        mock_response = mocker.Mock()
        mock_image_data = mocker.Mock()
        mock_image_data.label = "Arcade Fire We"
        mock_response.web_detection.best_guess_labels = [mock_image_data]
        mock.return_value = mock_response

        response = client.post(
            "/imgs/reverse_image_search/",
            files={
                "file": (
                    "test.jpg",
                    mock_image,
                    "image/jpeg",
                )
            },
        )
        assert response.status_code == 200
        assert response.json() == "Arcade Fire We"

    def test_bad_file_type(self, client):
        """
        Test the reverse image search endpoint with a bad file type.

        :param client:
        :return:
        """
        with open(
            Path(__file__).parent / "mock_api_data/mock_image_search_data.json", "rb"
        ) as f:
            response = client.post(
                "/imgs/reverse_image_search/",
                files={
                    "file": (
                        "test.txt",
                        f,
                        "text/plain",
                    )
                },
            )
        assert response.status_code == 400
        assert response.json() == {
            "message": "Invalid file type. Please upload a jpg or png.",
            "status": "error",
        }
