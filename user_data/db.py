"""Database configuration and connection."""

from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, Session


engine = create_engine(
    f"sqlite:///{Path(__file__).parent}/user_data.db",
    connect_args={"check_same_thread": False},
)


# Enable foreign key constraints on connection
def _enable_foreign_keys(dbapi_connection, _):  # pragma: no cover
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# Use the event listener to apply the function on new connections
event.listen(engine, "connect", _enable_foreign_keys)

Base = declarative_base()


def init_db(db_engine=engine):  # pragma: no cover
    """
    Create the database.

    :return:
    """
    Base.metadata.create_all(bind=db_engine)


def get_db() -> Generator[Session, None, None]:  # pragma: no cover
    """
    Gets a database session.

    :return:
    """
    connection = engine.connect()
    session = Session(bind=connection)
    savepoint = connection.begin_nested()
    try:
        yield session
        session.commit()
        connection.commit()
    except SQLAlchemyError as e:
        savepoint.rollback()
        connection.rollback()
        raise e
    finally:
        session.close()
