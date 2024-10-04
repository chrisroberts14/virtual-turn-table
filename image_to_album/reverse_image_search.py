import os
import requests


def bing_reverse_image_search(image_data):
    # Add your Bing Visual Search subscription key
    subscription_key = os.getenv("BING_API_KEY")
    endpoint = "https://api.bing.microsoft.com/v7.0/images/visualsearch"

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
    }

    # We use the 'files' parameter to send the image
    files = {'image': ('image.jpg', image_data)}

    try:
        # Call the Bing Visual Search API
        response = requests.post(endpoint, headers=headers, files=files)
        response.raise_for_status()

        # Print the search results
        results = response.json()
        # print("JSON Response:")
        # print(results)

        # Extract URLs from the results (if applicable)
        for tag in results.get("tags", []):
            for action in tag.get("actions", []):
                if action["actionType"] == "VisualSearch":
                    return [i['name'] for i in action['data']['value'][:5]]

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
