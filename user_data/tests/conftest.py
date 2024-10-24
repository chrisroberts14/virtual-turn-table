"""Fixtures for testing."""

from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, StaticPool
from sqlalchemy.orm import sessionmaker, Session

from user_data import app, UserDb, AlbumDb
from user_data.db import Base, get_db

DATABASE_URL = "sqlite://"
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True,
    poolclass=StaticPool,
)


# Enable foreign key constraints on connection
def _enable_foreign_keys(dbapi_connection, _):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# Use the event listener to apply the function on new connections
event.listen(engine, "connect", _enable_foreign_keys)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    """
    Override the get_db dependency.

    :return:
    """
    # pylint: disable=duplicate-code
    connection = engine.connect()
    session = Session(bind=connection)
    savepoint = connection.begin_nested()
    try:
        yield session
    finally:
        session.close()
        savepoint.rollback()


@pytest.fixture(scope="function")
def db() -> Session:  # pylint: disable=redefined-outer-name
    """
    Fixture for the database.

    :return:
    """
    for session in override_get_db():
        try:
            yield session
        finally:
            session.rollback()


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:  # pylint: disable=redefined-outer-name
    """
    Fixture for the test client.

    :return:
    """
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
def mock_user(db: Session) -> UserDb:  # pylint: disable=redefined-outer-name
    """
    Fixture for a mock user.

    Adds it to the database
    :param db:
    :return:
    """
    return UserDb.create(
        db, UserDb(username="user1", email="test", albums=[AlbumDb(album_uri="album1")])
    )


@pytest.fixture(scope="function")
def mock_album(db: Session) -> AlbumDb:  # pylint: disable=redefined-outer-name
    """
    Fixture for a mock album.

    Adds it to the database
    :param db:
    :return:
    """
    return AlbumDb.create(db, AlbumDb(album_uri="album2"))
