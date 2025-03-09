"""Database configuration and connection."""

import os
from typing import Generator

import sqlalchemy.engine
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, Session

# pragma: no cover
if os.getenv("PROD_ENV"):
    unix_socket_path = os.getenv("INSTANCE_UNIX_SOCKET")
    # e.g. /cloudsql/project:region:instance
    engine = create_engine(
        sqlalchemy.engine.URL.create(
            drivername="postgresql+psycopg2",
            username=os.getenv("VTT_POSTGRESQL_USER"),
            password=os.getenv("VTT_POSTGRESQL_PASSWORD"),
            database=os.getenv("VTT_POSTGRESQL_DB"),
            query={"host": unix_socket_path},
        )
    )
else:
    engine = create_engine(f"postgresql://{os.getenv('VTT_POSTGRESQL_URL')}", echo=True)

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
