"""Test the base user data endpoints."""


class TestUserDataBase:
    """Test the base user data endpoints."""

    def test_docs_redirect(self, client):
        """
        Test the redirect to the docs.

        :param client:
        :return:
        """
        response = client.get("/")
        assert response.status_code == 200
        assert str(response.url).endswith("/docs")

    def test_check_health(self, client):
        """
        Test the health check endpoint.

        :param client:
        :return:
        """
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "alive"}
