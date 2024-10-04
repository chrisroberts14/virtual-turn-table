"""
Module for all image endpoints in the image_to_album API
"""
import shutil

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

from pathlib import Path

from .reverse_image_search import bing_reverse_image_search

imgs_router = APIRouter()


@imgs_router.post("/reverse_image_search/")
async def reverse_image_search(file: UploadFile = File(...)):
    """
    Upload an image to the API
    Then save it to an online storage service
    Then do the reverse image search
    :param file:
    :return:
    """
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid file type. Only JPEG and PNG are allowed."}
        )

    response = bing_reverse_image_search(file.file)

    # Return the saved image file as a response
    return {"test": response}
