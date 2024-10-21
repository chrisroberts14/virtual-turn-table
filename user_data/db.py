"""Database configuration and connection."""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base

engine = create_engine()


# Enable foreign key constraints on connection
def _enable_foreign_keys(dbapi_connection, _):  # pragma: no cover
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# Use the event listener to apply the function on new connections
event.listen(engine, "connect", _enable_foreign_keys)


Base = declarative_base()
