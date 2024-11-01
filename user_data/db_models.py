"""Database models for user data."""

from pathlib import Path
from typing import List

from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from user_data.db import Base, engine

user_album_link_table = Table(
    "user_album_link_table",
    Base.metadata,
    Column("username", String(50), ForeignKey("users.username"), primary_key=True),
    Column("album_uri", String(20), ForeignKey("albums.album_uri"), primary_key=True),
)


class Crud:  # pylint: disable=too-few-public-methods
    """Base class for CRUD operations."""

    id = NotImplemented

    @classmethod
    def create(cls, db, obj_in):
        """
        Create a new object in the database.

        :param db:
        :param obj_in:
        :return:
        """
        db.add(obj_in)
        db.commit()
        db.refresh(obj_in)
        return obj_in

    @classmethod
    def get_by_id(cls, db, id_):
        """
        Get an object by its id.

        :param db:
        :param id_:
        :return:
        """
        return db.get(cls, id_)


class UserDb(Base, Crud):
    """User database model."""

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(50), primary_key=True, unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    albums: Mapped[List["AlbumDb"]] = relationship(
        "AlbumDb", secondary=user_album_link_table, back_populates="users"
    )


class AlbumDb(Base, Crud):
    """Album database model."""

    __tablename__ = "albums"

    album_uri: Mapped[str] = mapped_column(String(20), primary_key=True, unique=True)
    users: Mapped[List[UserDb]] = relationship(
        "UserDb", secondary=user_album_link_table, back_populates="albums"
    )


if not Path(Path(__file__).parent, "db/user_data.db").exists():
    Base.metadata.create_all(bind=engine)
