"""Test the auth router."""

import jwt
import pytest

from bff.auth import verify_token
from bff.api_models import APIException


class TestGetToken:
    """Test the get_token function."""

    endpoint = "/auth/token"

    def test_get_token(self, client, mocker):
        """
        Test the get_token endpoint.

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
            mock_response.json.return_value = {"display_name": "test_user"}
            mock_response.status_code = 200
            return mock_response

        mocker.patch("requests.get", side_effect=mock_request)
        response = client.post(
            self.endpoint,
            params={"spotify_access_token": "test_token"},
        )
        assert response.status_code == 200
        result = response.json()
        assert "access_token" in result
        assert "token_type" in result

    def test_failed_verification(self, client, mocker):
        """
        Test the get_token endpoint with a failed verification.

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
        response = client.post(
            self.endpoint,
            params={"spotify_access_token": "test_token"},
        )
        assert response.status_code == 401


class TestVerifyToken:
    """Test the verify_token function."""

    def test_verify_token(self, mocker):
        """
        Test the verify_token function.

        :param mocker:
        :return:
        """
        mock_credentials = mocker.Mock()
        mock_credentials.credentials = "test_token"
        mocker.patch("bff.auth.jwt.decode", return_value={"user": "test_user"})
        result = verify_token(mock_credentials)
        assert result == {"user": "test_user"}

    def test_verify_token_invalid(self, mocker):
        """
        Test the verify_token function with an invalid token.

        :param mocker:
        :return:
        """
        mock_credentials = mocker.Mock()
        mock_credentials.credentials = "test_token"
        mocker.patch("bff.auth.jwt.decode", side_effect=jwt.PyJWTError)
        with pytest.raises(APIException):
            verify_token(mock_credentials)
