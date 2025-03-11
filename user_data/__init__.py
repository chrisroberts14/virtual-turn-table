"""Module creating the image to user_data API."""

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from user_data.api_models import APIException
from user_data.social import social_router
from user_data.users import user_router

app = FastAPI()
app.include_router(social_router, prefix="/social")
app.include_router(user_router, prefix="/user")


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
