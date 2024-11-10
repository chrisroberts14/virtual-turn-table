"""Fixtures for testing."""

from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, StaticPool
from sqlalchemy.orm import sessionmaker, Session

from user_data import app
from user_data.db import Base, get_db
from user_data.db_models import UserDb, AlbumDb

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
        db,
        UserDb(
            username="user1",
            albums=[AlbumDb(album_uri="album1")],
            image_url="image_url",
        ),
    )


@pytest.fixture(scope="function")
def mock_user_with_no_albums(db: Session) -> UserDb:  # pylint: disable=redefined-outer-name
    """
    Fixture for a mock user with no albums.

    Adds it to the database
    :param db:
    :return:
    """
    return UserDb.create(db, UserDb(username="user3", image_url="image_url"))


@pytest.fixture(scope="function")
def mock_album(db: Session) -> AlbumDb:  # pylint: disable=redefined-outer-name
    """
    Fixture for a mock album.

    Adds it to the database
    :param db:
    :return:
    """
    return AlbumDb.create(db, AlbumDb(album_uri="album2"))


@pytest.fixture(scope="function")
def mock_user_with_public_album(mock_album: AlbumDb, db: Session) -> UserDb:  # pylint: disable=redefined-outer-name
    """
    Create a mock user with a public album.

    :param mock_album:
    :param db:
    :return:
    """
    return UserDb.create(
        db,
        UserDb(
            username="user2",
            albums=[mock_album],
            is_collection_public=True,
            image_url="image_url",
        ),
    )


@pytest.fixture(scope="function")
def user_with_shared_collections(
    mock_user_with_public_album: UserDb,  # pylint: disable=redefined-outer-name
    mock_user: UserDb,  # pylint: disable=redefined-outer-name
    db,  # pylint: disable=redefined-outer-name
) -> UserDb:
    """
    Create a user with shared collections.

    :param mock_user:
    :param mock_user_with_public_album:
    :return:
    """
    mock_user.shared_collections.append(mock_user_with_public_album)
    db.commit()
    return mock_user
