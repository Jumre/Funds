from flask import Flask, request, jsonify, render_template
import requests
from requests.auth import HTTPBasicAuth
import datetime
import base64

app = Flask(__name__)

consumer_key = 'your_consumer_key'
consumer_secret = 'your_consumer_secret'
shortcode = 'your_shortcode'
lipa_na_mpesa_online_passkey = 'your_passkey'
callback_url = 'https://your_callback_url.com'

def get_access_token():
    api_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(api_url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
    access_token = response.json().get('access_token')
    return access_token

def lipa_na_mpesa_online(phone_number, amount):
    access_token = get_access_token()
    api_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    headers = { "Authorization": f"Bearer {access_token}" }
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{shortcode}{lipa_na_mpesa_online_passkey}{timestamp}".encode()).decode('utf-8')
    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": "FamilyProject",
        "TransactionDesc": "Monthly Contribution"
    }
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_payment', methods=['POST'])
def process_payment():
    phone_number = request.form['phone']
    amount = request.form['amount']
    response = lipa_na_mpesa_online(phone_number, amount)
    return jsonify(response)

@app.route('/mpesa_callback', methods=['POST'])
def mpesa_callback():
    data = request.json
    print(data)
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})

if __name__ == "__main__":
    app.run(debug=True)
