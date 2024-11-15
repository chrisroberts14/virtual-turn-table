"""User endpoints for the API."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from starlette.status import HTTP_201_CREATED, HTTP_200_OK

from user_data.api_models import (
    APIException,
    Album,
    User,
    AlbumUserLinkIn,
    UserSearchOut,
    Notification,
)
from user_data.db import get_db
from user_data.db_models import UserDb, AlbumDb

user_router = APIRouter()


@user_router.get("/search")
def get_users_by_search(
    query: str, db: Session = Depends(get_db)
) -> list[UserSearchOut]:
    """
    Get all users by search.

    :param query:
    :param db:
    :return:
    """
    # This is bespoke for the user table so don't have a generic get_by_search
    db_users = (
        db.query(UserDb).filter(UserDb.username.ilike(f"%{query}%")).limit(10).all()
    )
    return [
        UserSearchOut(username=user.username, image_url=user.image_url)
        for user in db_users
    ]


@user_router.get("/{username}/albums")
def get_user_albums(username: str, db: Session = Depends(get_db)) -> list[Album]:
    """
    Get all albums for a user.

    :param db:
    :param username:
    :return:
    """
    db_user = UserDb.get_by_id(db, username)
    if db_user is None:
        raise APIException(status_code=404, message="User not found")
    return db_user.albums


@user_router.post("/create_user", status_code=HTTP_201_CREATED)
def create_or_get_user(user: User, db: Session = Depends(get_db)) -> User:
    """
    Create or get a user.

    :param user:
    :param db:
    :return:
    """
    db_user = UserDb.get_by_id(db, user.username)
    if db_user is not None:
        # Update the image if it has changed
        if user.image_url != db_user.image_url:
            db_user.image_url = user.image_url
            db.commit()
            db.refresh(db_user)
        return db_user
    return UserDb.create(db, UserDb(username=user.username, image_url=user.image_url))


@user_router.post("/create_album/{album_uri}", status_code=HTTP_201_CREATED)
def create_album_if_not_exists(album_uri: str, db: Session = Depends(get_db)) -> Album:
    """
    Create an album if it doesn't already exist.

    :param album_uri:
    :param db:
    :return:
    """
    album = AlbumDb.get_by_id(db, album_uri)
    if album is None:
        return AlbumDb.create(db, AlbumDb(album_uri=album_uri))
    return album


@user_router.post("/add_album_link", status_code=HTTP_201_CREATED)
def add_album_link(data: AlbumUserLinkIn, db: Session = Depends(get_db)):
    """
    Add a link between a user and an album if it doesn't already exist.

    :param db:
    :param data:
    :return:
    """
    user = UserDb.get_by_id(db, data.user_id)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    user_albums = UserDb.get_by_id(db, data.user_id).albums
    if data.album_uri in [album.album_uri for album in user_albums]:
        return JSONResponse(
            status_code=HTTP_200_OK,
            content={"message": "Link already exists", "status": "success"},
        )
    album = AlbumDb.get_by_id(db, data.album_uri)
    if album is None:
        raise APIException(status_code=404, message="Album not found")
    user.albums.append(album)
    db.commit()
    db.refresh(user)
    return JSONResponse(
        status_code=HTTP_201_CREATED,
        content={"album_uri": album.album_uri, "status": "success"},
    )


@user_router.get("/is_collection_public/{username}")
def is_collection_public(username: str, db: Session = Depends(get_db)) -> bool:
    """
    Check if a user's collection is public.

    :param db:
    :param username:
    :return:
    """
    db_user = UserDb.get_by_id(db, username)
    if db_user is None:
        raise APIException(status_code=404, message="User not found")
    return db_user.is_collection_public


@user_router.get("/notifications/{username}")
def get_notifications(
    username: str, db: Session = Depends(get_db)
) -> list[Notification]:
    """
    Get all notifications for a user.

    :param db:
    :param username:
    :return:
    """
    user = UserDb.get_by_id(db, username)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    return [
        Notification(
            id=str(notif.id), sender_id=notif.sender_id, receiver_id=notif.receiver_id
        )
        for notif in user.received_notifications
    ]


@user_router.delete("/{username}")
def delete_user(username: str, db: Session = Depends(get_db)):
    """
    Delete a user.

    :param db:
    :param username:
    :return:
    """
    db_user = UserDb.get_by_id(db, username)
    if db_user is None:
        raise APIException(status_code=404, message="User not found")
    db.delete(db_user)
    db.commit()
    return JSONResponse(
        status_code=HTTP_200_OK,
        content={"message": "User deleted", "status": "success"},
    )
