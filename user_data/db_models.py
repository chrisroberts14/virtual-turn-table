"""Database models for user data."""

import os
from pathlib import Path
from typing import List
from uuid import uuid4

from sqlalchemy import Column, String, ForeignKey, Table, Boolean, UUID
from sqlalchemy.orm import Mapped, relationship, Session
from sqlalchemy.testing.schema import mapped_column

from user_data.db import Base, engine

user_album_link_table = Table(
    "user_album_link_table",
    Base.metadata,
    Column("username", String(50), ForeignKey("users.username"), primary_key=True),
    Column("album_uri", String(30), ForeignKey("albums.album_uri"), primary_key=True),
)

shared_collection_link_table = Table(
    "shared_collection_link_table",
    Base.metadata,
    Column("sharer", String(50), ForeignKey("users.username"), primary_key=True),
    Column("receiver", String(50), ForeignKey("users.username"), primary_key=True),
)


class Crud:  # pylint: disable=too-few-public-methods
    """Base class for CRUD operations."""

    id = NotImplemented

    @classmethod
    def create(cls, db: Session, obj_in):
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
    def get_by_id(cls, db: Session, id_):
        """
        Get an object by its id.

        :param db:
        :param id_:
        :return:
        """
        return db.get(cls, id_)

    @classmethod
    def delete(cls, db: Session, id_):
        """
        Delete an object by its id.

        :param db:
        :param id_:
        :return:
        """
        obj = cls.get_by_id(db, id_)
        db.delete(obj)
        db.commit()
        return obj


class NotificationDb(Base, Crud):
    """Notification database model."""

    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(UUID, primary_key=True, unique=True, default=uuid4)
    # Separate relationships for sender and receiver to avoid back_populates conflict
    sender_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.username"))
    receiver_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.username"))

    sender: Mapped["UserDb"] = relationship(
        "UserDb",
        foreign_keys=[sender_id],
        back_populates="sent_notifications",
    )
    receiver: Mapped["UserDb"] = relationship(
        "UserDb",
        foreign_keys=[receiver_id],
        back_populates="received_notifications",
    )


class UserDb(Base, Crud):
    """User database model."""

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(50), primary_key=True, unique=True)
    # Store the image_url so we don't have to make a request to the spotify API
    image_url: Mapped[str] = mapped_column(String(200), nullable=True)
    albums: Mapped[List["AlbumDb"]] = relationship(
        "AlbumDb", secondary=user_album_link_table, back_populates="users"
    )
    is_collection_public: Mapped[bool] = mapped_column(Boolean, default=False)
    # List of users who have shared their collections with this user
    shared_collections: Mapped[List["UserDb"]] = relationship(
        "UserDb",
        secondary=shared_collection_link_table,
        primaryjoin=username == shared_collection_link_table.c.sharer,
        secondaryjoin=username == shared_collection_link_table.c.receiver,
        back_populates="shared_with",
    )

    # List of users with whom this user's collection has been shared
    shared_with: Mapped[List["UserDb"]] = relationship(
        "UserDb",
        secondary=shared_collection_link_table,
        primaryjoin=username == shared_collection_link_table.c.receiver,
        secondaryjoin=username == shared_collection_link_table.c.sharer,
        back_populates="shared_collections",
    )

    sent_notifications: Mapped[List[NotificationDb]] = relationship(
        "NotificationDb",
        foreign_keys=[NotificationDb.sender_id],
        back_populates="sender",
    )
    received_notifications: Mapped[List[NotificationDb]] = relationship(
        "NotificationDb",
        foreign_keys=[NotificationDb.receiver_id],
        back_populates="receiver",
    )


class AlbumDb(Base, Crud):
    """Album database model."""

    __tablename__ = "albums"

    album_uri: Mapped[str] = mapped_column(String(30), primary_key=True, unique=True)
    users: Mapped[List[UserDb]] = relationship(
        "UserDb", secondary=user_album_link_table, back_populates="albums"
    )


# Don't create the database if in testing mode this is not usually a good idea
# but for this use it should be fine
if os.environ.get("PYTEST_VERSION") is None:  # pragma: no cover
    if not Path(Path(__file__).parent, "db", "db/user_data.db").exists():
        Base.metadata.create_all(bind=engine)
