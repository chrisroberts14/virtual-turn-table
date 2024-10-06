"""API to return music."""

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from music.music import music_router


app = FastAPI()
app.include_router(music_router, prefix="/music", tags=["music"])


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
