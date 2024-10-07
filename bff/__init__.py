"""Module creating the bff."""

import requests
from fastapi import FastAPI, UploadFile
from fastapi.responses import RedirectResponse

app = FastAPI()


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


@app.post("/image_to_uri/")
def image_to_uri(file: UploadFile) -> str:
    """
    Take an image and return the best guess of the spotify URI.

    :param file:
    :return:
    """
    # Hard coded for now will eventually be in a config file
    endpoint = "http://localhost:8000/image_to_album/reverse_image_search/"
    files = {"file": ("placeholder.jpg", file.file)}

    # Get best results for image search
    response = requests.post(endpoint, files=files, timeout=5)
    response.raise_for_status()

    # Get the URI
    endpoint = "http://localhost:8000/image_to_album/get_uri/"
    response = requests.post(endpoint, json=response.json(), timeout=5)
    return response.json()
