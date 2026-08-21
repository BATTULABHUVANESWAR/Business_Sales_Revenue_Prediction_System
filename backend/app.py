from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Frontend folder
FRONTEND_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend")
)


# Home
@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "login.html")


# Serve all frontend files: CSS, JS, HTML
@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)


# API Prediction
@app.route("/api/predict", methods=["POST"])
def prediction():
    data = request.get_json()

    return jsonify({
        "prediction": 0,
        "message": "Prediction API connected successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)