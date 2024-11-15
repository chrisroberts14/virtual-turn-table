"""Social endpoints for the API."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_201_CREATED

from user_data.api_models import APIException, ShareCollectionIn, Notification
from user_data.db import get_db
from user_data.db_models import UserDb, NotificationDb

social_router = APIRouter()


@social_router.get("/get_public_collections", status_code=HTTP_200_OK)
def get_public_collections(db: Session = Depends(get_db)) -> list[dict]:
    """
    Get the first `count` public collections.

    :param db:
    :return:
    """
    return [
        {
            "username": user.username,
            "image_url": user.image_url,
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
            "image_url": shared_user.image_url,
            "albums": [album.album_uri for album in shared_user.albums],
        }
        for shared_user in user.shared_collections
    ]


@social_router.post("/share_collection", status_code=HTTP_201_CREATED)
def share_collection(
    data: ShareCollectionIn, db: Session = Depends(get_db)
) -> Notification:
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

    # Send a notification to the receiver
    notification = NotificationDb.create(
        db, NotificationDb(sender=sharer, receiver=receiver)
    )
    db.commit()
    return Notification(
        id=str(notification.id),
        sender_id=notification.sender_id,
        receiver_id=notification.receiver_id,
    )


@social_router.put("/toggle_collection_public/{username}", status_code=HTTP_200_OK)
def toggle_collection_public(username: str, db: Session = Depends(get_db)):
    """
    Toggle if a user's collection is public.

    :param db:
    :param username:
    :return:
    """
    user = UserDb.get_by_id(db, username)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    user.is_collection_public = not bool(user.is_collection_public)
    db.commit()


@social_router.put("/share_reject/{notification_id}", status_code=HTTP_200_OK)
def share_reject(notification_id: str, db: Session = Depends(get_db)):
    """
    Reject a shared collection.

    :param db:
    :param notification_id:
    :return:
    """
    notification = NotificationDb.get_by_id(db, uuid.UUID(notification_id))
    if notification is None:
        raise APIException(status_code=404, message="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}


@social_router.put("/share_accept/{notification_id}", status_code=HTTP_200_OK)
def share_accept(notification_id: str, db: Session = Depends(get_db)):
    """
    Accept a shared collection.

    :param db:
    :param notification_id:
    :return:
    """
    notification = NotificationDb.get_by_id(db, uuid.UUID(notification_id))
    if notification is None:
        raise APIException(status_code=404, message="Notification not found")
    sharer = UserDb.get_by_id(db, notification.sender_id)
    receiver = UserDb.get_by_id(db, notification.receiver_id)
    # Don't need to check as the notification can't exist without these
    receiver.shared_collections.append(sharer)
    db.delete(notification)
    db.commit()
    return {"message": "Collection shared"}
