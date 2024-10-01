"""
Module for all image endpoints in the image_to_album API
"""
import shutil

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

from pathlib import Path

from GoogleSearch import Search
from starlette.responses import FileResponse

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

    # Save the uploaded file
    file_path = Path(r"C:\Users\chris\OneDrive\Desktop\python\virtual-turn-table") / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output = Search(file_path=str(file_path))

    # Return the saved image file as a response
    return {"test": output}
