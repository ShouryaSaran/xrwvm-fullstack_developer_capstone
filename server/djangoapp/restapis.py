# Uncomment the imports below before you add the function code
import requests
import os
import json
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    if params:
        request_url = backend_url + endpoint + "?" + params
    else:
        request_url = backend_url + endpoint

    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + quote(text, safe='')
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(
            request_url,
            data=json.dumps(data_dict),
            headers={'Content-Type': 'application/json'},
        )
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
