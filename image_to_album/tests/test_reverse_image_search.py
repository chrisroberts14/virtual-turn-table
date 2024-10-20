"""Tests for the reverse image search endpoint."""

from pathlib import Path

import requests


class TestReverseImageSearch:
    """Tests for the reverse image search endpoint."""

    def test_reverse_image_search(
        self, client, mocker, mock_image_search_data, mock_image
    ):
        """
        Test the reverse image search endpoint.

        :param client:
        :return:
        """
        # Mock the response from the image search api
        mock_post = mocker.patch("requests.post")
        mock_response_data = mock_image_search_data
        mock_response = mocker.Mock()
        mock_response.json.return_value = mock_response_data
        mock_response.status_code = 200
        mock_post.return_value = mock_response

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

    def test_reverse_image_search_bad_response(self, client, mocker, mock_image):
        """
        Test the reverse image search endpoint with a bad response.

        :param client:
        :param mocker:
        :return:
        """
        # Mock the response from the image search api
        mock_post = mocker.patch("requests.post")
        mock_response = mocker.Mock()
        mock_response.json.return_value = {}
        mock_response.status_code = 500
        mock_post.return_value = mock_response

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
        assert response.status_code == 500
        assert response.json() == {
            "message": "Image search failed please try again.",
            "status": "error",
        }

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

    def test_api_timeout(self, client, mocker, mock_image):
        """
        Test the reverse image search endpoint when the API fails.

        :param client:
        :param mocker:
        :return:
        """
        mocker.patch("requests.post", side_effect=requests.exceptions.ConnectionError)
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
        assert response.status_code == 500

    def test_api_error(self, client, mocker, mock_image):
        """
        Test the reverse image search endpoint when the API fails.

        :param client:
        :param mocker:
        :return:
        """
        mocker.patch("requests.post", side_effect=requests.exceptions.RequestException)
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
        assert response.status_code == 500
