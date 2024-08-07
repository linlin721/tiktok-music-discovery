# import time
# import requests

# # the base url contains the api key
# base_url = 'https://suno.gcui.art'


# def custom_generate_audio(payload):
#     url = f"{base_url}/api/custom_generate"
#     response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
#     return response.json()


# def extend_audio(payload):
#     url = f"{base_url}/api/extend_audio"
#     response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
#     return response.json()

# def generate_audio_by_prompt(payload):
#     url = f"{base_url}/api/generate"
#     response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
#     return response.json()


# def get_audio_information(audio_ids):
#     url = f"{base_url}/api/get?ids={audio_ids}"
#     response = requests.get(url)
#     return response.json()


# def get_quota_information():
#     url = f"{base_url}/api/get_limit"
#     response = requests.get(url)
#     return response.json()

# def get_clip(clip_id):
#     url = f"{base_url}/api/clip?id={clip_id}"
#     response = requests.get(url)
#     return response.json()


# if __name__ == '__main__':
#     data = custom_generate_audio({
#       "prompt": "",
#       "tags": "jazz",
#       "title": "Silent Battlefield",
#       "make_instrumental": False,
#       "wait_audio": False
#     })

#     ids = f"{data[0]['id']},{data[1]['id']}"
#     print(f"ids: {ids}")

#     def get_audio_information(audio_ids):
#         url = f"{base_url}/api/get?ids={audio_ids}"
#         response = requests.get(url)
#         return response.json()


#     for _ in range(60):
#         data = get_audio_information(ids)
#         if data[0]["status"] == 'streaming':
#             print(f"{data[0]['id']} ==> {data[0]['audio_url']}")
#             print(f"{data[1]['id']} ==> {data[1]['audio_url']}")
#             break
#         # sleep 5s
#         time.sleep(5)



from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

base_url = 'https://api.aimlapi.com'
api_key = '56867b7be6b34d26adc6935bf7510478'  # the API key

def custom_generate_audio(payload):
    try:
        url = f"{base_url}/generate/custom-mode"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        raise
    except Exception as err:
        logging.error(f"Other error occurred: {err}")
        raise

def get_audio_information(audio_ids):
    try:
        url = f"{base_url}/?ids[0]={audio_ids}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        raise
    except Exception as err:
        logging.error(f"Other error occurred: {err}")
        raise

@app.route('/generate_bgm', methods=['POST'])
def generate_bgm():
    try:
        data = request.json
        logging.debug(f'Received data: {data}')  # debugging
        payload = {
            "prompt": data.get('prompt', 'Create a calm and soothing background music'),
            "tags": data.get('tags', 'ambient'),
            "title": data.get('title', 'Calm Melody'),
            "make_instrumental": data.get('make_instrumental', True),
            "wait_audio": True
        }
        response = custom_generate_audio(payload)
        logging.debug(f'API response: {response}')  # log the response
        
        if isinstance(response, list) and len(response) > 0:  # handle list response and check for items
            audio_info = response[0]
            return jsonify({
                "title": audio_info['title'],
                "artist": "NewGen aka ng",
                "style": audio_info['tags'],
                "audio_url": audio_info['audio_url']
            })
        
        return jsonify({"error": "Failed to generate BGM"}), 500  # return error if no items in response
    except Exception as e:
        logging.error(f"Error in generate_bgm: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_audio_info', methods=['GET'])
def get_audio_info():
    audio_id = request.args.get('id')
    if not audio_id:
        return jsonify({"error": "Missing audio ID"}), 400
    
    try:
        audio_info = get_audio_information(audio_id)
        logging.debug(f'Audio info: {audio_info}')  # debugging
        return jsonify(audio_info)
    except Exception as e:
        logging.error(f"Error fetching audio information: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test route is working!"})

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Music Generation API!"})

if __name__ == '__main__':
    app.run(port=5003)
