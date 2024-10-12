"""Module creating the image to album API."""

import logging

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from image_to_album.endpoints import imgs_router, album_router

logger = logging.getLogger(__name__)
logging.basicConfig(filename="img_to_album.log", level=logging.INFO)


app = FastAPI()
app.include_router(imgs_router, prefix="/imgs", tags=["Images"])
app.include_router(album_router, prefix="/album", tags=["Albums"])


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
