import requests

# Define the base URL and endpoint
base_url = 'https://api.aimlapi.com'
endpoint = '/api/get_limit'
url = f"{base_url}{endpoint}"

# Set up the headers with the API key
api_key = '56867b7be6b34d26adc6935bf7510478'  # Replace with your actual API key
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

def check_api_limits():
    try:
        # Make the GET request
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for HTTP errors

        # Parse and print the JSON response
        limit_info = response.json()
        print(limit_info)
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

if __name__ == "__main__":
    check_api_limits()
