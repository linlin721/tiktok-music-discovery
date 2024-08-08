from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

base_url = 'https://api.aimlapi.com'
api_key = ''  # the API key

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
            "prompt": data.get('prompt', ''),
            "tags": data.get('tags', ''),
            "title": data.get('title', ''),
            "make_instrumental": data.get('make_instrumental', True),
            "wait_audio": True
        }
        response = custom_generate_audio(payload)
        logging.debug(f'API response: {response}')  # log the response
        
        if isinstance(response, list) and len(response) > 0:  # handle list response and check for items
            audio_info = response[0]
            return jsonify({
                "title": audio_info['title'],
                "artist": "Bay Bear",
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
