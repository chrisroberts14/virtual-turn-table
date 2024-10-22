"""Database models for user data."""

from typing import List

from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from user_data.db import Base

user_album_link_table = Table(
    "user_album_link_table",
    Base.metadata,
    Column("username", String, ForeignKey("users.username"), primary_key=True),
    Column("album_uri", String, ForeignKey("albums.album_uri"), primary_key=True),
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

    @classmethod
    def update(cls, db, obj, id_):
        """
        Update an object.

        :param db:
        :param obj:
        :param id_:
        :return:
        """
        db_obj = db.query(cls).filter(cls.id == id_).first()

        for key, value in obj.model_dump().items():
            if value is not None:
                setattr(db_obj, key, value)

        db.commit()
        return db.get(cls, id_)

    @classmethod
    def delete(cls, db, id_):
        """
        Delete an object.

        :param db: database session
        :param id_: id of the object
        :return: None
        """
        db_obj = db.get(cls, id_)
        db.delete(db_obj)
        db.commit()


class UserDb(Base, Crud):
    """User database model."""

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(primary_key=True, unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    albums: Mapped[List["AlbumDb"]] = relationship(
        "AlbumDb", secondary=user_album_link_table, back_populates="users"
    )


class AlbumDb(Base, Crud):
    """Album database model."""

    __tablename__ = "albums"

    album_uri: Mapped[str] = mapped_column(primary_key=True, unique=True)
    users: Mapped[List[UserDb]] = relationship(
        "UserDb", secondary=user_album_link_table, back_populates="albums"
    )
