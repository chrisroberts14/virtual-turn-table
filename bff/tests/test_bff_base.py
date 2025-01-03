"""Test the base BFF endpoints."""


class TestBFFBase:
    """Test the base BFF endpoints."""

    def test_docs_redirect(self, client):
        """
        Test the redirect to the docs.

        :param client:
        :return:
        """
        response = client.get("/")
        assert response.status_code == 200

    def test_check_health(self, client):
        """
        Test the health check endpoint.

        :param client:
        :return:
        """
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "alive"}
