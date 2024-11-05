"""Social endpoints for the API."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_201_CREATED

from user_data.api_models import APIException, ShareCollectionIn
from user_data.db import get_db
from user_data.db_models import UserDb

social_router = APIRouter()


@social_router.get("/get_public_collections", status_code=HTTP_200_OK)
def get_public_collections(db: Session = Depends(get_db)) -> list[dict]:
    """
    Get all public collections.

    :param db:
    :return:
    """
    return [
        {
            "username": user.username,
            "albums": [album.album_uri for album in user.albums],
        }
        for user in db.query(UserDb).filter(UserDb.is_collection_public.is_(True)).all()
    ]


@social_router.get("/get_shared_collections/{username}", status_code=HTTP_200_OK)
def get_shared_collections(username: str, db: Session = Depends(get_db)) -> list[dict]:
    """
    Get all collections shared with a user.

    :param db:
    :param username:
    :return:
    """
    user = UserDb.get_by_id(db, username)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    return [
        {
            "username": shared_user.username,
            "albums": [album.album_uri for album in shared_user.albums],
        }
        for shared_user in user.shared_collections
    ]


@social_router.post("/share_collection", status_code=HTTP_201_CREATED)
def share_collection(data: ShareCollectionIn, db: Session = Depends(get_db)):
    """
    Share a collection with another user.

    :param db:
    :param data:
    :return:
    """
    if data.sharer == data.receiver:
        raise APIException(status_code=400, message="Cannot share with yourself")
    sharer = UserDb.get_by_id(db, data.sharer)
    if sharer is None:
        raise APIException(status_code=404, message="Sharer not found")
    if not sharer.albums:
        raise APIException(status_code=400, message="Sharer has no albums")
    receiver = UserDb.get_by_id(db, data.receiver)
    if receiver is None:
        raise APIException(status_code=404, message="Receiver not found")
    receiver.shared_collections.append(sharer)
    db.commit()


@social_router.put("/make_collection_public/{username}", status_code=HTTP_200_OK)
def make_collection_public(username: str, db: Session = Depends(get_db)):
    """
    Make a user's collection public.

    :param db:
    :param username:
    :return:
    """
    user = UserDb.get_by_id(db, username)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    user.is_collection_public = True
    db.commit()
