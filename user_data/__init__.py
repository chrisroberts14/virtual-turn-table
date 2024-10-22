"""Module creating the image to user_data API."""

from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from user_data.api_models import APIException, Album
from user_data.db import get_db
from user_data.db_models import UserDb

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


@app.get("/get_user_albums/{username}")
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
