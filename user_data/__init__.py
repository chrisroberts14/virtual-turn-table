"""Module creating the image to user_data API."""

from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.status import HTTP_201_CREATED
from sqlalchemy.orm import Session

from user_data.api_models import APIException, Album, User, AlbumUserLinkIn
from user_data.db import get_db
from user_data.db_models import UserDb, AlbumDb

app = FastAPI()

origins = [
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.middleware("http")
async def custom_error_handling_middleware(request: Request, call_next):
    """
    Custom error handling middleware.

    :param request:
    :param call_next:
    :return:
    """
    try:
        return await call_next(request)
    except APIException as ex:
        return JSONResponse(
            status_code=ex.status_code,
            content={"status": "error", "message": ex.message},
        )


@app.get("/")
def docs_redirect() -> RedirectResponse:
    """
    Redirect to the docs.

    :return:
    """
    return RedirectResponse(url="/docs")


@app.get("/health")
def check_health():
    """
    Endpoint to check health of the api for use with docker compose.

    :return:
    """
    return {"status": "alive"}


@app.get("/{username}/albums")
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


@app.post("/user/", status_code=HTTP_201_CREATED)
def create_or_get_user(user: User, db: Session = Depends(get_db)) -> User:
    """
    Create or get a user.

    :param user:
    :param db:
    :return:
    """
    db_user = UserDb.get_by_id(db, user.username)
    if db_user is not None:
        return db_user
    return UserDb.create(db, UserDb(username=user.username, email=user.email))


@app.post("/create_album/{album_uri}/", status_code=HTTP_201_CREATED)
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


@app.post("/add_album_link/", status_code=HTTP_201_CREATED)
def add_album_link(data: AlbumUserLinkIn, db: Session = Depends(get_db)):
    """
    Add a link between a user and an album.

    :param db:
    :param data:
    :return:
    """
    user = UserDb.get_by_id(db, data.user_id)
    if user is None:
        raise APIException(status_code=404, message="User not found")
    album = AlbumDb.get_by_id(db, data.album_uri)
    if album is None:
        raise APIException(status_code=404, message="Album not found")
    user.albums.append(album)
    db.commit()
