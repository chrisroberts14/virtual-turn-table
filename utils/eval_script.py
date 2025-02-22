"""
Evaluation script for the reverse image search spotify element.

Each image is run through the reverse image search 6 times
 - 4 rotations (0, 90, 180, 270)
 - 1 Blurred image
 - 1 Low resolution image
"""
# pylint: disable=no-member, broad-exception-raised

import base64
import json
import os
import time
from pathlib import Path

import cv2
import requests
from google.cloud import vision
from google.oauth2 import service_account
from rich.progress import track


# Set up the google cloud client
google_cloud_credentials: dict = {
    "type": "service_account",
    "project_id": os.getenv("GOOGLE_PROJECT_ID"),
    "private_key_id": os.getenv("GOOGLE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
    "client_id": os.getenv("GOOGLE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("GOOGLE_CLIENT_X509_CERT_URL"),
    "universe_domain": "googleapis.com",
}

credentials = service_account.Credentials.from_service_account_info(
    google_cloud_credentials
)
client = vision.ImageAnnotatorClient(credentials=credentials)


def display_image(img):
    """
    Display the image.

    :param img:
    :return:
    """
    cv2.imshow("Image", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def spotify_search(query: str):
    """
    Search spotify for the query.

    :param query:
    :return:
    """
    auth_url = "https://accounts.spotify.com/api/token"

    # Encode client_id and client_secret to base64 for Authorization header
    auth_str = f"{os.getenv("SPOTIFY_CLIENT_ID")}:{os.getenv("SPOTIFY_CLIENT_SECRET")}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {"Authorization": f"Basic {b64_auth_str}"}

    data = {"grant_type": "client_credentials"}

    response = requests.post(auth_url, headers=headers, data=data, timeout=5)
    if response.status_code != 200:
        raise Exception("Failed to get the access token")
    response_data = response.json()

    search_url = "https://api.spotify.com/v1/search"

    headers = {"Authorization": f"Bearer {response_data['access_token']}"}

    params = {
        "q": query,  # The search query
        "type": "album",  # The type can be album, artist, track, etc.
        "limit": 1,  # The number of items to return
    }
    response = requests.get(search_url, headers=headers, params=params, timeout=5)
    if response.status_code != 200:
        return "Failed to get the album details"

    # Get the album details
    data = response.json()
    if len(data["albums"]["items"]) == 0:
        return "No album found."
    first_album_link = response.json()["albums"]["items"][0]["href"]
    album_response = requests.get(first_album_link, headers=headers, timeout=5)
    if album_response.status_code != 200:
        return "Failed to get the album details"

    response_json = response.json()
    title = response_json["albums"]["items"][0]["name"]
    return title


def main():
    """
    Run the script.

    :return:
    """
    # Results dict to be written to a file
    results = {}

    for image in track(Path("images").glob("*.jpg"), "Processing images..."):
        img = cv2.imread(str(image))
        img = cv2.resize(img, (500, 500))
        images_to_search = [img]
        # display_image(img)

        # Rotate the image
        for angle in [
            cv2.ROTATE_90_CLOCKWISE,
            cv2.ROTATE_180,
            cv2.ROTATE_90_COUNTERCLOCKWISE,
        ]:
            images_to_search.append(cv2.rotate(img, angle))
            # display_image(rotated)

        # Blur the image
        images_to_search.append(cv2.GaussianBlur(img, (21, 21), 0))
        # display_image(blurred)

        # Scale the image
        images_to_search.append(cv2.resize(img, (240, 240)))
        # display_image(scaled)

        for img, img_name in zip(
            images_to_search,
            [
                "Original",
                "Rotated - 90",
                "Rotated - 180",
                "Rotated - 270",
                "Blurred",
                "Scaled",
            ],
        ):
            # pylint: disable=no-member
            image_content = cv2.imencode(".jpg", img)[1].tobytes()
            google_image = vision.Image(content=image_content)
            response = client.web_detection(image=google_image)
            top_pages = [
                page.page_title
                for page in response.web_detection.pages_with_matching_images
            ]
            best_guess = response.web_detection.best_guess_labels[0].label
            if image.stem not in results:
                results[image.stem] = {}
            results[image.stem][img_name] = {
                "best_guess": best_guess,
                "top_pages": top_pages,
            }

            # Run spotify searches
            best_guess_result = spotify_search(best_guess)
            top_results = list({spotify_search(page) for page in top_pages})
            results[image.stem][img_name]["best_guess_result"] = best_guess_result
            results[image.stem][img_name]["top_results"] = top_results
            time.sleep(0.25)

        print(f"Completed image {image.stem}")

    with open("results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
