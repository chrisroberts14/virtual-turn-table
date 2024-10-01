"""
Module for all image endpoints in the image_to_album API
"""

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

imgs_router = APIRouter()


@imgs_router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid file type. Only JPEG and PNG are allowed."}
        )

    return {"filename": file.filename}
