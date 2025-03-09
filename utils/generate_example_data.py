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
    "0XOseclZGO4NnaBz5Shjxp",
    "3AMHMM2aNG6k3d7ybcQ5bY",
    "0C0OFASoQC57yC12vQhCwN",
    "2VuZJsJBPLwg9BeQFQle8G",
    "46VcvAWpybuvO2ZnShwC2N",
    "75l5Bqvc0BH45UhJrS04Xj",
    "4kUbTSoTsbKP5MRdYMDBx1",
    "6DadUIElI6GgDh8XCscyxn",
    "1DNojVW079FU9YnAMk3Cgr",
    "3EVZWeTZ5XDe8Z1O746XP3",
    "1k0GwSFLuaMSQKs9Q9MQyD",
    "1R8kkopLT4IAxzMMkjic6X",
    "6MJlXwm9rJV1sWBhNKIZG0",
    "2brwuyGZ2lLqWnBX6U4MQT",
    "3ly9T2L4pqTZijFgQssd3x",
    "3usnShwygMXVZB4IV5dwnU",
    "4AF1M7bGCFL3LHCtXUUXw5",
    "2T0iwqVWzr4Y63x4kKO5DW",
    "3DrgM5X3yX1JP1liNLAOHI",
    "1ID4yRgxYUutcLKzYDcln4",
    "6ZB8qaR9JNuS0Q0bG1nbcH",
    "0tX0WZ8mgkOS3Fwd8OzFDQ",
    "53klcezw81ytuAIwCzod3Z",
    "2sAePf08xIp4tnDlMUCV8B",
    "7eed9MBclFPjjjvotfR2e9",
]


def main():
    """
    Main function for the script.

    :return:
    """
    # Create ten users
    create_user_endpoint = "http://localhost:8002/user/create_user"
    create_album_endpoint = "http://localhost:8002/user/create_album/{}"
    add_album_link_endpoint = "http://localhost:8002/user/add_album_link"
    for i in range(10):
        username = f"test-user-{i}"
        user = {"username": username, "image_url": ""}
        response = requests.post(create_user_endpoint, json=user, timeout=5)
        if response.status_code != 201:
            print("Failed to create user")
            return 1
        # Set the first 5 users to have public collections
        if i < 5:
            response = requests.put(
                f"http://localhost:8002/social/toggle_collection_public/{username}",
                timeout=5,
            )
            if response.status_code != 200:
                print("Failed to toggle collection public")
                return 1
        # Add five albums for each user
        five_albums = random.sample(album_ids, 5)
        for album_id in five_albums:
            # Create the album
            response = requests.post(create_album_endpoint.format(album_id), timeout=5)
            if response.status_code != 201:
                print("Failed to create album")
                return 1
            data = {"album_uri": album_id, "user_id": username}
            response = requests.post(add_album_link_endpoint, json=data, timeout=5)
            if response.status_code != 201:
                print("Failed to add album link")
                return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
