"""Module creating the image to album API."""

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from image_to_album.images import imgs_router

app = FastAPI()
app.include_router(imgs_router, prefix="/imgs", tags=["Images"])


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
