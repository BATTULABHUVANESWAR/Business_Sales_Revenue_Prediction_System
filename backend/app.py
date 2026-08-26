from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sqlite3
import pandas as pd

app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# PATHS
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_FOLDER = os.path.join(BASE_DIR, "frontend")
DATABASE = os.path.join(BASE_DIR, "users.db")


# -------------------------------------------------
# DATABASE
# -------------------------------------------------

def init_db():
    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


init_db()


# -------------------------------------------------
# FRONTEND
# -------------------------------------------------

@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)


# -------------------------------------------------
# REGISTER API
# -------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        # Check existing user
        cursor.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()

            return jsonify({
                "success": False,
                "message": "User already exists. Please login."
            }), 409

        # Create new user
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, password)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Registration successful. Please login."
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------
# LOGIN API
# -------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Please enter email and password."
            }), 400

        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = ? AND password = ?
            """,
            (email, password)
        )

        user = cursor.fetchone()

        conn.close()

        if user:

            return jsonify({
                "success": True,
                "message": "Login successful.",
                "redirect": "/dashboard.html"
            })

        # Email exists but password wrong
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        )

        email_exists = cursor.fetchone()

        conn.close()

        if email_exists:

            return jsonify({
                "success": False,
                "message": "Incorrect password."
            }), 401

        # New user
        return jsonify({
            "success": False,
            "message": "Account not found. Please register first."
        }), 404

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------
# PREDICTION API
# -------------------------------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No prediction data received."
            }), 400

        # User inputs
        store = data.get("store")
        department = data.get("department") or data.get("dept")
        prediction_date = data.get("prediction_date")
        holiday = data.get("holiday", 0)

        markdown1 = data.get("markdown1", 0) or 0
        markdown2 = data.get("markdown2", 0) or 0
        markdown3 = data.get("markdown3", 0) or 0
        markdown4 = data.get("markdown4", 0) or 0
        markdown5 = data.get("markdown5", 0) or 0

        if not store:
            return jsonify({
                "success": False,
                "message": "Please select a Store."
            }), 400

        if not department:
            return jsonify({
                "success": False,
                "message": "Please select a Department."
            }), 400

        if not prediction_date:
            return jsonify({
                "success": False,
                "message": "Please select a Prediction Date."
            }), 400

        # Automatic date features
        date_value = pd.to_datetime(prediction_date)

        year = int(date_value.year)
        month = int(date_value.month)
        week = int(date_value.isocalendar().week)
        quarter = int((month - 1) // 3 + 1)

        # Internal ML input
        prediction_input = {
            "Store": int(store),
            "Dept": int(department),
            "Holiday": int(holiday),

            "MarkDown1": float(markdown1),
            "MarkDown2": float(markdown2),
            "MarkDown3": float(markdown3),
            "MarkDown4": float(markdown4),
            "MarkDown5": float(markdown5),

            "Year": year,
            "Month": month,
            "Week": week,
            "Quarter": quarter
        }

        # -------------------------------------------------
        # ACTUAL ML MODEL WILL BE CONNECTED HERE
        # -------------------------------------------------

        prediction = 0

        return jsonify({
            "success": True,
            "message": "Prediction request received successfully.",
            "prediction": prediction,
            "calculated_features": {
                "Year": year,
                "Month": month,
                "Week": week,
                "Quarter": quarter
            }
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------
# RUN
# -------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
