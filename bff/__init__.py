"""Module creating the bff."""

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from bff.music import music_router
from bff.user import user_router
from bff.image_search import image_search_router
from bff.api_models import APIException

app = FastAPI()
app.include_router(music_router, prefix="/music")
app.include_router(user_router, prefix="/user")
app.include_router(image_search_router, prefix="/image_search")


origins = [
    "http://localhost:5173",
]


# pylint: disable=too-few-public-methods
class CustomErrorMiddleware(BaseHTTPMiddleware):
    """Custom error handling middleware."""

    async def dispatch(self, request: Request, call_next):
        """
        Dispatch method for middleware.

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


app.add_middleware(CustomErrorMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
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
