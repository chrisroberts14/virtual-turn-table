"""
Module creating the image to album API
"""

from fastapi import FastAPI, UploadFile
from fastapi.responses import RedirectResponse

app = FastAPI()


@app.get("/")
def docs_redirect() -> RedirectResponse:
    """
    Redirect to the docs
    :return:
    """
    return RedirectResponse(url="/docs")


@app.get("/health")
def check_health():
    """
    Endpoint to check health of the api for use with docker compose
    :return:
    """
    return {"status": "alive"}


@app.post("/image_to_album")
def image_to_album(img: UploadFile = UploadFile(...)):
    """
    Endpoint to get the image to album
    :return:
    """
    return {"filename", img.filename}
