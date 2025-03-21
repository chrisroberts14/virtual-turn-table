"""Module creating the image to album API."""

import logging

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from image_to_album.api_models import APIException
from image_to_album.endpoints import imgs_router, album_router

logger = logging.getLogger(__name__)
logging.basicConfig(filename="img_to_album.log", level=logging.INFO)


app = FastAPI()
app.include_router(imgs_router, prefix="/imgs", tags=["Images"])
app.include_router(album_router, prefix="/album", tags=["Albums"])


origins = [
    "http://localhost:8000",
    "https://vtt-bff-791764533505.us-central1.run.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.exception_handler(APIException)
async def global_exception_handler(_: Request, exc: APIException):
    """
    Custom exception handler for the API.

    :param _:
    :param exc:
    :return:
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": exc.message},
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
