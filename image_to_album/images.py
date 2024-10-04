"""
Module for all image endpoints in the image_to_album API
"""
import os

import requests
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse


imgs_router = APIRouter()


@imgs_router.post("/reverse_image_search/")
async def reverse_image_search(file: UploadFile = File(...)):
    """
    Upload an image to the API
    Then do the reverse image search
    :param file:
    :return:
    """
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid file type. Only JPEG and PNG are allowed."}
        )

    subscription_key = os.getenv("BING_API_KEY")
    endpoint = "https://api.bing.microsoft.com/v7.0/images/visualsearch"

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
    }

    # This contains the image data
    files = {'image': ('placeholder.jpg', file.file)}

    try:
        # Call the Bing Visual Search API
        response = requests.post(endpoint, headers=headers, files=files)
        response.raise_for_status()

        results = response.json()

        # Extract the image names from the response
        for tag in results.get("tags", []):
            for action in tag.get("actions", []):
                if action["actionType"] == "VisualSearch":
                    return [i['name'] for i in action['data']['value'][:5]]

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
