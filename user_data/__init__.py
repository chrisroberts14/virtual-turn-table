"""Module creating the image to user_data API."""

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from user_data.api_models import APIException

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
