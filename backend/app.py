from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

import os
import sqlite3
import pandas as pd
import joblib


# ============================================================
# APP
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATABASE = os.path.join(
    BASE_DIR,
    "users.db"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "model.joblib"
)

METRICS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "model_metrics.joblib"
)

ALL_METRICS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "all_model_metrics.joblib"
)

ANN_METRICS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "ann_metrics.joblib"
)

HISTORICAL_DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "ml_ready.csv"
)

SALES_TREND_PATH = os.path.join(
    BASE_DIR,
    "data",
    "sales_trend.csv"
)


# ============================================================
# LOAD ML MODEL
# ============================================================

try:
    model = joblib.load(MODEL_PATH)
    print("✓ ML model loaded successfully.")

except Exception as e:
    print("✗ Failed to load ML model:")
    print(e)
    model = None


# ============================================================
# LOAD MODEL METRICS
# ============================================================

try:
    model_metrics = joblib.load(METRICS_PATH)
    print("✓ Model metrics loaded successfully.")

except Exception as e:
    print("✗ Failed to load model metrics:")
    print(e)
    model_metrics = {}

try:
    all_model_metrics = joblib.load(
        ALL_METRICS_PATH
    )

except Exception as e:

    print(
        "Could not load all model metrics:",
        e
    )

    all_model_metrics = {}



try:
    ann_metrics = joblib.load(
        ANN_METRICS_PATH
    )

except Exception as e:

    print(
        "Could not load ANN metrics:",
        e
    )

    ann_metrics = None

# ============================================================
# LOAD HISTORICAL DATA
# ============================================================

try:

    sales_data = pd.read_csv(
        HISTORICAL_DATA_PATH
    )

    sales_data["Date"] = pd.to_datetime(
        sales_data["Date"]
    )

    sales_data = sales_data.sort_values(
        "Date"
    )

    print(
        f"✓ Historical data loaded successfully. "
        f"Rows: {len(sales_data):,}"
    )

except Exception as e:

    print("✗ Failed to load historical data:")
    print(e)

    sales_data = pd.DataFrame()


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db():

    conn = sqlite3.connect(
        DATABASE,
        timeout=10
    )

    conn.execute(
        "PRAGMA busy_timeout = 10000"
    )

    return conn


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def init_db():

    conn = None

    try:

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            "PRAGMA journal_mode=WAL"
        )

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                email TEXT UNIQUE NOT NULL,

                password TEXT NOT NULL

            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                email TEXT NOT NULL,

                store INTEGER NOT NULL,

                department INTEGER NOT NULL,

                prediction_date TEXT NOT NULL,

                predicted_sales REAL NOT NULL,

                created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP

            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS
            idx_predictions_email
            ON predictions(email)
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS
            idx_predictions_created
            ON predictions(created_at)
        """)

        conn.commit()

        print("✓ Database initialized successfully.")

    except Exception as e:

        print(
            "✗ Database initialization error:",
            e
        )

    finally:

        if conn:
            conn.close()


init_db()


# ============================================================
# HISTORICAL FEATURE GENERATION
# ============================================================

def get_historical_features(
    store,
    department,
    prediction_date
):

    prediction_date = pd.to_datetime(
        prediction_date
    )

    if sales_data.empty:
        return None

    history = sales_data[
        (sales_data["Store"] == int(store)) &
        (sales_data["Dept"] == int(department)) &
        (sales_data["Date"] < prediction_date)
    ].sort_values(
        "Date"
    )

    if history.empty:
        return None

    sales = history["Weekly_Sales"]

    latest = history.iloc[-1]

    lag_1 = float(
        sales.iloc[-1]
    )

    lag_2 = float(
        sales.iloc[-2]
        if len(sales) >= 2
        else sales.iloc[-1]
    )

    lag_4 = float(
        sales.iloc[-4]
        if len(sales) >= 4
        else sales.iloc[0]
    )

    rolling_mean_4 = float(
        sales.tail(4).mean()
    )

    rolling_mean_8 = float(
        sales.tail(8).mean()
    )

    return {

        "Lag_1": lag_1,

        "Lag_2": lag_2,

        "Lag_4": lag_4,

        "Rolling_Mean_4":
            rolling_mean_4,

        "Rolling_Mean_8":
            rolling_mean_8,

        "Temperature":
            float(
                latest["Temperature"]
            ),

        "Fuel_Price":
            float(
                latest["Fuel_Price"]
            ),

        "CPI":
            float(
                latest["CPI"]
            ),

        "Unemployment":
            float(
                latest["Unemployment"]
            ),

        "Type":
            str(
                latest["Type"]
            ),

        "Size":
            int(
                latest["Size"]
            )
    }


# ============================================================
# USER EXISTS
# ============================================================

def user_exists(email):

    conn = None

    try:

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE LOWER(TRIM(email)) = ?
            """,
            (email.strip().lower(),)
        )

        user = cursor.fetchone()

        # Debug information for Render logs
        print(
            f"Checking user: {email}"
        )

        print(
            f"User found: {user}"
        )

        print(
            f"Database: {DATABASE}"
        )

        return user is not None

    except Exception as e:

        print(
            "User lookup error:",
            e
        )

        return False

    finally:

        if conn:
            conn.close()


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return jsonify({

        "success": True,

        "message":
            "Sales Prediction API is running."

    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "success": True,

        "message":
            "Backend is running.",

        "model_loaded":
            model is not None,

        "historical_data_loaded":
            not sales_data.empty

    })


# ============================================================
# REGISTER API
# ============================================================

@app.route(
    "/api/register",
    methods=["POST"]
)
def register():

    conn = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No registration data received."

            }), 400

        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()

        password = str(
            data.get(
                "password",
                ""
            )
        )

        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Email is required."

            }), 400

        if not password:

            return jsonify({

                "success": False,

                "message":
                    "Password is required."

            }), 400

        if len(password) < 4:

            return jsonify({

                "success": False,

                "message":
                    "Password must contain at least 4 characters."

            }), 400

        password_hash = (
            generate_password_hash(
                password
            )
        )

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            return jsonify({

                "success": False,

                "message":
                    "User already exists. Please login."

            }), 409

        cursor.execute(
            """
            INSERT INTO users
            (
                email,
                password
            )
            VALUES (?, ?)
            """,
            (
                email,
                password_hash
            )
        )

        conn.commit()

        print(
            f"✓ New user registered: {email}"
        )

        return jsonify({

            "success": True,

            "message":
                "Registration successful. Please login."

        })

    except sqlite3.IntegrityError:

        if conn:
            conn.rollback()

        return jsonify({

            "success": False,

            "message":
                "An account with this email already exists."

        }), 409

    except sqlite3.OperationalError as e:

        if conn:
            conn.rollback()

        print(
            "Database error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Database is currently busy. Please try again."

        }), 503

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Registration error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Registration failed."

        }), 500

    finally:

        if conn:
            conn.close()


# ============================================================
# LOGIN API
# ============================================================

@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    conn = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No login data received."

            }), 400

        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()

        password = str(
            data.get(
                "password",
                ""
            )
        )

        if not email or not password:

            return jsonify({

                "success": False,

                "message":
                    "Please enter email and password."

            }), 400

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                password
            FROM users
            WHERE email = ?
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({

                "success": False,

                "message":
                    "Account not found. Please register first."

            }), 404

        user_id = user[0]

        stored_password = user[1]

        try:

            password_valid = (
                check_password_hash(
                    stored_password,
                    password
                )
            )

        except Exception:

            password_valid = (
                stored_password == password
            )

        if not password_valid:

            return jsonify({

                "success": False,

                "message":
                    "Incorrect password."

            }), 401

        if stored_password == password:

            new_password_hash = (
                generate_password_hash(
                    password
                )
            )

            cursor.execute(
                """
                UPDATE users
                SET password = ?
                WHERE id = ?
                """,
                (
                    new_password_hash,
                    user_id
                )
            )

            conn.commit()

        return jsonify({

            "success": True,

            "message":
                "Login successful.",

            "email":
                email,

            "redirect":
                "/dashboard"

        })

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Login error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Login failed."

        }), 500

    finally:

        if conn:
            conn.close()


# ============================================================
# PREDICTION API
# ============================================================

@app.route(
    "/api/predict",
    methods=["POST"]
)
def predict():

    conn = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No prediction data received."

            }), 400

        # ====================================================
        # USER INPUT
        # ====================================================

        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()

        store = data.get("store")

        department = data.get(
            "department"
        )

        prediction_date = data.get(
            "prediction_date"
        )

        holiday = data.get(
            "holiday",
            0
        )

        markdown_values = [

            data.get("markdown1", 0) or 0,

            data.get("markdown2", 0) or 0,

            data.get("markdown3", 0) or 0,

            data.get("markdown4", 0) or 0,

            data.get("markdown5", 0) or 0

        ]

        # ====================================================
        # AUTHENTICATION
        # ====================================================

        if not email:

            return jsonify({

                "success": False,

                "message":
                    "User email is required."

            }), 400

        user_found = user_exists(email)

        print(
            f"AUTH CHECK EMAIL: {email}"
        )

        print(
            f"AUTH CHECK RESULT: {user_found}"
        )

        if not user_found:

            print(
                "AUTH FAILED"
            )

            return jsonify({

                "success": False,

                "message":
                    "User account not found. "
                    "Please login again."

            }), 401

        print(
            "AUTH PASSED"
        )

        # ====================================================
        # STORE / DEPARTMENT
        # ====================================================

        if (
            store is None
            or str(store).strip() == ""
        ):

            return jsonify({

                "success": False,

                "message":
                    "Please enter a Store."

            }), 400

        if (
            department is None
            or str(department).strip() == ""
        ):

            return jsonify({

                "success": False,

                "message":
                    "Please enter a Department."

            }), 400

        try:

            store = int(store)

            department = int(department)

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "success": False,

                "message":
                    "Store and Department "
                    "must be valid numbers."

            }), 400

        if store <= 0:

            return jsonify({

                "success": False,

                "message":
                    "Store must be greater than 0."

            }), 400

        if department <= 0:

            return jsonify({

                "success": False,

                "message":
                    "Department must be greater than 0."

            }), 400

        # ====================================================
        # HOLIDAY
        # ====================================================

        try:

            holiday = int(holiday)

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "success": False,

                "message":
                    "Holiday must be either 0 or 1."

            }), 400

        if holiday not in [0, 1]:

            return jsonify({

                "success": False,

                "message":
                    "Holiday must be either No or Yes."

            }), 400

        # ====================================================
        # MARKDOWNS
        # ====================================================

        try:

            markdown_values = [
                float(value)
                for value in markdown_values
            ]

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "success": False,

                "message":
                    "Markdown values must be valid numbers."

            }), 400

        if any(
            value < 0
            for value in markdown_values
        ):

            return jsonify({

                "success": False,

                "message":
                    "Markdown values cannot be negative."

            }), 400

        (
            markdown1,
            markdown2,
            markdown3,
            markdown4,
            markdown5
        ) = markdown_values

        # ====================================================
        # DATE
        # ====================================================

        if not prediction_date:

            return jsonify({

                "success": False,

                "message":
                    "Please select a Prediction Date."

            }), 400

        try:

            date_value = pd.to_datetime(
                prediction_date,
                errors="raise"
            )

        except Exception:

            return jsonify({

                "success": False,

                "message":
                    "Please provide a valid prediction date."

            }), 400

        # ====================================================
        # DATE FEATURES
        # ====================================================

        year = int(
            date_value.year
        )

        month = int(
            date_value.month
        )

        week = int(
            date_value.isocalendar().week
        )

        quarter = int(
            (month - 1) // 3 + 1
        )

        # ====================================================
        # MODEL CHECK
        # ====================================================

        if model is None:

            return jsonify({

                "success": False,

                "message":
                    "ML model is not available."

            }), 500

        if sales_data.empty:

            return jsonify({

                "success": False,

                "message":
                    "Historical sales data is not available."

            }), 500

        # ====================================================
        # HISTORICAL FEATURES
        # ====================================================

        historical_features = (
            get_historical_features(
                store,
                department,
                date_value
            )
        )

        if historical_features is None:

            return jsonify({

                "success": False,

                "message":
                    "No historical sales data found "
                    "for this Store and Department "
                    "before the selected date."

            }), 400

        # ====================================================
        # MODEL INPUT
        # ====================================================

        prediction_input = {

            "Store":
                int(store),

            "Dept":
                int(department),

            "IsHoliday":
                bool(holiday),

            "Temperature":
                historical_features["Temperature"],

            "Fuel_Price":
                historical_features["Fuel_Price"],

            "MarkDown1":
                markdown1,

            "MarkDown2":
                markdown2,

            "MarkDown3":
                markdown3,

            "MarkDown4":
                markdown4,

            "MarkDown5":
                markdown5,

            "CPI":
                historical_features["CPI"],

            "Unemployment":
                historical_features["Unemployment"],

            "Type":
                historical_features["Type"],

            "Size":
                historical_features["Size"],

            "Year":
                year,

            "Month":
                month,

            "Week":
                week,

            "Quarter":
                quarter,

            "Lag_1":
                historical_features["Lag_1"],

            "Lag_2":
                historical_features["Lag_2"],

            "Lag_4":
                historical_features["Lag_4"],

            "Rolling_Mean_4":
                historical_features["Rolling_Mean_4"],

            "Rolling_Mean_8":
                historical_features["Rolling_Mean_8"]

        }

        # ====================================================
        # PREDICT
        # ====================================================

        input_df = pd.DataFrame([
            prediction_input
        ])

        print(
            "Prediction input:"
        )

        print(
            input_df.to_dict(
                orient="records"
            )[0]
        )

        prediction = model.predict(
            input_df
        )

        predicted_sales = max(
            0.0,
            float(prediction[0])
        )

        # ====================================================
        # SAVE PREDICTION
        # ====================================================

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO predictions
            (
                email,
                store,
                department,
                prediction_date,
                predicted_sales
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                email,
                store,
                department,
                date_value.strftime(
                    "%Y-%m-%d"
                ),
                predicted_sales
            )
        )

        conn.commit()

        print(
            f"✓ Prediction saved | "
            f"{email} | "
            f"Store {store} | "
            f"Dept {department} | "
            f"₹{predicted_sales:,.2f}"
        )

        return jsonify({

            "success": True,

            "message":
                "Sales prediction generated successfully.",

            "prediction":
                predicted_sales,

            "calculated_features": {

                "Year": year,

                "Month": month,

                "Week": week,

                "Quarter": quarter,

                "Lag_1":
                    historical_features["Lag_1"],

                "Lag_2":
                    historical_features["Lag_2"],

                "Lag_4":
                    historical_features["Lag_4"],

                "Rolling_Mean_4":
                    historical_features["Rolling_Mean_4"],

                "Rolling_Mean_8":
                    historical_features["Rolling_Mean_8"],

                "Temperature":
                    historical_features["Temperature"],

                "Fuel_Price":
                    historical_features["Fuel_Price"],

                "CPI":
                    historical_features["CPI"],

                "Unemployment":
                    historical_features["Unemployment"],

                "Type":
                    historical_features["Type"],

                "Size":
                    historical_features["Size"]

            }

        })

    except sqlite3.OperationalError as e:

        if conn:
            conn.rollback()

        print(
            "Prediction database error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Database is currently busy. "
                "Please try again."

        }), 503

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Prediction error:",
            repr(e)
        )

        return jsonify({

            "success": False,

            "message":
                f"Prediction failed: {str(e)}"

        }), 500

    finally:

        if conn:
            conn.close()


# ============================================================
# MODEL METRICS API
# ============================================================

@app.route(
    "/api/model-metrics",
    methods=["GET"]
)
def model_metrics_api():

    try:

        if not model_metrics:

            return jsonify({

                "success": False,

                "message":
                    "Model metrics are not available."

            }), 404

        return jsonify({

            "success": True,

            "best_model":
                model_metrics.get(
                    "best_model"
                ),

            "r2":
                model_metrics.get("R2"),

            "mae":
                model_metrics.get("MAE"),

            "rmse":
                model_metrics.get("RMSE"),

            "models_compared":
                model_metrics.get(
                    "models_compared"
                ),

            "training_rows":
                model_metrics.get(
                    "training_rows"
                ),

            "testing_rows":
                model_metrics.get(
                    "testing_rows"
                ),

            "total_rows":
                model_metrics.get(
                    "total_rows"
                )

        })

    except Exception as e:

        print(
            "Model metrics error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load model metrics."

        }), 500


@app.route(
    "/api/model-comparison",
    methods=["GET"]
)
def model_comparison():

    try:

        results = []

        # ====================================================
        # TRADITIONAL ML MODELS
        # ====================================================

        for model_name, metrics in all_model_metrics.items():

            results.append({

                "model": model_name,

                "MAE": float(
                    metrics["MAE"]
                ),

                "RMSE": float(
                    metrics["RMSE"]
                ),

                "R2": float(
                    metrics["R2"]
                )

            })


        # ====================================================
        # ANN
        # ====================================================

        if ann_metrics:

            results.append({

                "model": "ANN",

                "MAE": float(
                    ann_metrics["MAE"]
                ),

                "RMSE": float(
                    ann_metrics["RMSE"]
                ),

                "R2": float(
                    ann_metrics["R2"]
                )

            })


        # ====================================================
        # SORT BY R²
        # ====================================================

        results.sort(
            key=lambda x: x["R2"],
            reverse=True
        )


        # ====================================================
        # BEST MODEL
        # ====================================================

        best_model = (
            results[0]["model"]
            if results
            else None
        )


        return jsonify({

            "success": True,

            "best_model":
                best_model,

            "models":
                results

        })


    except Exception as e:

        print(
            "Model comparison error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load model comparison."

        }), 500


# ============================================================
# SALES TREND API
# ============================================================

@app.route(
    "/api/sales-trend",
    methods=["GET"]
)
def sales_trend():

    try:

        if not os.path.exists(
            SALES_TREND_PATH
        ):

            return jsonify({

                "success": False,

                "message":
                    "Sales trend data is not available."

            }), 404

        df = pd.read_csv(
            SALES_TREND_PATH
        )

        df["Date"] = pd.to_datetime(
            df["Date"]
        )

        df = df.sort_values(
            "Date"
        )

        sales_data_response = []

        for _, row in df.iterrows():

            sales_data_response.append({

                "date":
                    row["Date"].strftime(
                        "%Y-%m-%d"
                    ),

                "sales":
                    float(row["Sales"])

            })

        return jsonify({

            "success": True,

            "sales":
                sales_data_response

        })

    except Exception as e:

        print(
            "Sales trend error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500


# ============================================================
# HISTORY API
# ============================================================

@app.route(
    "/api/history",
    methods=["GET"]
)
def history():

    conn = None

    try:

        email = str(
            request.args.get(
                "email",
                ""
            )
        ).strip().lower()

        if not email:

            return jsonify({

                "success": False,

                "message":
                    "User email is required."

            }), 400

        conn = get_db()

        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                store,
                department,
                prediction_date,
                predicted_sales,
                created_at
            FROM predictions
            WHERE email = ?
            ORDER BY created_at DESC
            """,
            (email,)
        )

        rows = cursor.fetchall()

        predictions = [
            dict(row)
            for row in rows
        ]

        return jsonify({

            "success": True,

            "predictions":
                predictions

        })

    except Exception as e:

        print(
            "History error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load prediction history."

        }), 500

    finally:

        if conn:
            conn.close()


# ============================================================
# DASHBOARD API
# ============================================================

@app.route(
    "/api/dashboard",
    methods=["GET"]
)
def dashboard():

    conn = None

    try:

        email = str(
            request.args.get(
                "email",
                ""
            )
        ).strip().lower()

        if not email:

            return jsonify({

                "success": False,

                "message":
                    "User email is required."

            }), 400

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM predictions
            WHERE email = ?
            """,
            (email,)
        )

        total_predictions = (
            cursor.fetchone()[0]
        )

        cursor.execute(
            """
            SELECT AVG(predicted_sales)
            FROM predictions
            WHERE email = ?
            """,
            (email,)
        )

        average_sales = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT MAX(predicted_sales)
            FROM predictions
            WHERE email = ?
            """,
            (email,)
        )

        highest_sales = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT
                id,
                store,
                department,
                prediction_date,
                predicted_sales,
                created_at
            FROM predictions
            WHERE email = ?
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (email,)
        )

        latest = cursor.fetchone()

        latest_prediction = None

        if latest:

            latest_prediction = {

                "id":
                    latest[0],

                "store":
                    latest[1],

                "department":
                    latest[2],

                "prediction_date":
                    latest[3],

                "predicted_sales":
                    latest[4],

                "created_at":
                    latest[5]

            }

        return jsonify({

            "success": True,

            "total_predictions":
                total_predictions,

            "average_sales":
                average_sales,

            "highest_sales":
                highest_sales,

            "latest_prediction":
                latest_prediction

        })

    except Exception as e:

        print(
            "Dashboard error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load dashboard."

        }), 500

    finally:

        if conn:
            conn.close()


@app.route(
    "/api/performance",
    methods=["GET"]
)
def performance():

    conn = None

    try:

        email = str(
            request.args.get(
                "email",
                ""
            )
        ).strip().lower()

        if not email:

            return jsonify({

                "success": False,

                "message":
                    "User email is required."

            }), 400

        conn = get_db()

        cursor = conn.cursor()

        # ==================================================
        # STORE PERFORMANCE
        # ==================================================

        cursor.execute(
            """
            SELECT
                store,
                COUNT(*) AS prediction_count,
                AVG(predicted_sales) AS average_sales,
                SUM(predicted_sales) AS total_sales,
                MAX(predicted_sales) AS highest_sales
            FROM predictions
            WHERE email = ?
            GROUP BY store
            ORDER BY total_sales DESC
            """,
            (email,)
        )

        store_rows = cursor.fetchall()

        stores = []

        for row in store_rows:

            stores.append({

                "store":
                    row[0],

                "prediction_count":
                    row[1],

                "average_sales":
                    float(
                        row[2] or 0
                    ),

                "total_sales":
                    float(
                        row[3] or 0
                    ),

                "highest_sales":
                    float(
                        row[4] or 0
                    )

            })


        # ==================================================
        # DEPARTMENT PERFORMANCE
        # ==================================================

        cursor.execute(
            """
            SELECT
                department,
                COUNT(*) AS prediction_count,
                AVG(predicted_sales) AS average_sales,
                SUM(predicted_sales) AS total_sales,
                MAX(predicted_sales) AS highest_sales
            FROM predictions
            WHERE email = ?
            GROUP BY department
            ORDER BY total_sales DESC
            """,
            (email,)
        )

        department_rows = cursor.fetchall()

        departments = []

        for row in department_rows:

            departments.append({

                "department":
                    row[0],

                "prediction_count":
                    row[1],

                "average_sales":
                    float(
                        row[2] or 0
                    ),

                "total_sales":
                    float(
                        row[3] or 0
                    ),

                "highest_sales":
                    float(
                        row[4] or 0
                    )

            })


        # ==================================================
        # RESPONSE
        # ==================================================

        return jsonify({

            "success": True,

            "stores":
                stores,

            "departments":
                departments

        })


    except Exception as e:

        print(
            "Performance error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load performance data."

        }), 500


    finally:

        if conn:

            conn.close()

# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    print()
    print("============================================")
    print("     SALES PREDICTION SYSTEM")
    print("============================================")
    print("Backend: http://127.0.0.1:5000")
    print("Health:  http://127.0.0.1:5000/api/health")
    print("============================================")
    print()

    app.run(

        host="0.0.0.0",

        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),

        debug=False

    )
