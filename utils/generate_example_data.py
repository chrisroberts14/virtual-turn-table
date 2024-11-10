"""Create example data in the database.

To use you must start the program and then run this script.
"""

import sys
import random
import requests

album_ids = [
    "4hnqM0JK4CM1phwfq1Ldyz",
    "4CzNl4NEKjGi0aGdVOShfo",
    "2PZIytLiCWDHEjAXuwkVKz",
    "4GT6uZod4p5RiDMOVHOMme",
    "1XkGORuUX2QGOEIL4EbJKm",
    "78bpIziExqiI9qztvNFlQu",
    "4GQmfMtt1JhIQLK3L6p5lo",
    "36mLYlXANoKVHSlTfok68g",
    "1mOyLIaNd9HgSw12iXASND",
]


def main():
    """
    Main function for the script.

    :return:
    """
    # Create ten users
    create_user_endpoint = "http://localhost:8000/user/create_user"
    add_album_link_endpoint = "http://localhost:8000/user/add_album"
    for i in range(10):
        user = {"username": f"user{i}", "image_url": ""}
        response = requests.post(create_user_endpoint, json=user, timeout=5)
        if response.status_code != 201:
            print("Failed to create user")
            return 1
        # Set the first 5 users to have public collections
        if i < 5:
            response = requests.put(
                f"http://localhost:8000/social/toggle_collection_public/user{i}",
                timeout=5,
            )
            if response.status_code != 200:
                print("Failed to toggle collection public")
                return 1
        # Add five albums for each user
        five_albums = random.sample(album_ids, 5)
        for album_id in five_albums:
            data = {"album_uri": album_id, "user_id": f"user{i}"}
            response = requests.post(add_album_link_endpoint, json=data, timeout=5)
            if response.status_code != 201:
                print("Failed to add album link")
                return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
