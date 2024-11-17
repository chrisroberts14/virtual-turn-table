"""Test the image_to_uri endpoint."""

import base64

from bff.api_models import Album


class TestImageToURI:
    """Tests for the image_to_uri endpoint."""

    def test_image_to_uri(self, client, mocker, mock_image):
        """
        Test the get_uri endpoint.

        :param client:
        :return:
        """

        def mock_request(url: str, **_):
            """
            Mock the request.

            :param url:
            :return:
            """
            if url.endswith("/reverse_image_search/"):
                mock_response_data = {
                    "best_guess": "Arcade Fire We",
                    "top_10_results": [
                        "Arcade Fire We",
                        "Arcade Fire We",
                        "Arcade Fire We",
                        "Arcade Fire We",
                    ],
                }
            else:
                mock_response_data = Album(
                    title="We",
                    artists=["Arcade Fire"],
                    image_url="test_url",
                    album_uri="4EVnJfjXZjbyb8f2XvIVc2",
                    tracks_url="test_tracks_url",
                    songs=[],
                ).model_dump()
            mock_response = mocker.Mock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        base_64_image = base64.b64encode(mock_image.read()).decode("utf-8")

        response = client.post(
            "/image_search/image_to_album/",
            json={"image": f"data:image/jpeg;base64,{base_64_image}"},
        )

        result_album = Album(
            title="We",
            artists=["Arcade Fire"],
            image_url="test_url",
            album_uri="4EVnJfjXZjbyb8f2XvIVc2",
            tracks_url="test_tracks_url",
            songs=[],
        )
        assert response.status_code == 200
        assert response.json() == {
            "best_guess": result_album.model_dump(),
            "top_10_results": [
                result_album.model_dump(),
                result_album.model_dump(),
                result_album.model_dump(),
                result_album.model_dump(),
            ],
        }

    def test_failed_image_search(self, client, mocker, mock_image):
        """
        Test the image_to_uri endpoint where the image search fails.

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
            mock_response.json.return_value = "Arcade Fire We"
            mock_response.status_code = 500
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        base_64_image = base64.b64encode(mock_image.read()).decode("utf-8")

        response = client.post(
            "/image_search/image_to_album/",
            json={"image": f"data:image/jpeg;base64,{base_64_image}"},
        )
        assert response.status_code == 500
        assert response.json() == {
            "message": "Image search failed please try again.",
            "status": "error",
        }

    def test_failed_album_search(self, client, mocker, mock_image):
        """
        Test the image_to_uri endpoint where the album search fails.

        :param client:
        :param mocker:
        :return:
        """

        def mock_request(url: str, **_):
            """
            Mock the request.

            :param url:
            :return:
            """
            mock_response = mocker.Mock()
            if url.endswith("/reverse_image_search/"):
                mock_response.json.return_value = {
                    "best_guess": "Arcade Fire We",
                    "top_10_results": [
                        "Arcade Fire We",
                        "Arcade Fire We",
                        "Arcade Fire We",
                        "Arcade Fire We",
                    ],
                }
                mock_response_code = 200
            else:
                mock_response_code = 500
            mock_response.status_code = mock_response_code
            return mock_response

        mocker.patch("requests.post", side_effect=mock_request)
        base_64_image = base64.b64encode(mock_image.read()).decode("utf-8")

        response = client.post(
            "/image_search/image_to_album/",
            json={"image": f"data:image/jpeg;base64,{base_64_image}"},
        )
        assert response.status_code == 500
        assert response.json() == {
            "message": "Album search failed please try again.",
            "status": "error",
        }
