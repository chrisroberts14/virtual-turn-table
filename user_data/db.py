"""Database configuration and connection."""

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, Session

print(f"postgresql://{os.getenv("VTT_POSTGRESQL_URL")}")
engine = create_engine(f"postgresql://{os.getenv("VTT_POSTGRESQL_URL")}", echo=True)

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
