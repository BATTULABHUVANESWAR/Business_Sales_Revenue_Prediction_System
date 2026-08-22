import os
import urllib.request


# ============================================================
# HUGGING FACE FILES
# ============================================================

MODEL_URL = (
    "https://huggingface.co/"
    "Bhuvi18/business-sales-prediction-model/"
    "resolve/main/model.joblib"
)

METRICS_URL = (
    "https://huggingface.co/"
    "Bhuvi18/business-sales-prediction-model/"
    "resolve/main/model_metrics.joblib"
)

HISTORICAL_DATA_URL = (
    "https://huggingface.co/"
    "Bhuvi18/business-sales-prediction-model/"
    "resolve/main/ml_ready.csv"
)


# ============================================================
# PROJECT PATHS
# ============================================================

BACKEND_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

BASE_DIR = os.path.dirname(
    BACKEND_DIR
)


# ============================================================
# DESTINATION PATHS
# ============================================================

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data",
    "processed"
)


MODEL_PATH = os.path.join(
    MODEL_DIR,
    "model.joblib"
)

METRICS_PATH = os.path.join(
    MODEL_DIR,
    "model_metrics.joblib"
)

HISTORICAL_DATA_PATH = os.path.join(
    DATA_DIR,
    "ml_ready.csv"
)


# ============================================================
# DOWNLOAD FUNCTION
# ============================================================

def download_file(url, path, name):

    if os.path.exists(path):

        print(
            f"✓ {name} already exists."
        )

        return

    print(
        f"Downloading {name}..."
    )

    os.makedirs(
        os.path.dirname(path),
        exist_ok=True
    )

    urllib.request.urlretrieve(
        url,
        path
    )

    print(
        f"✓ {name} downloaded successfully."
    )


# ============================================================
# MAIN
# ============================================================

def main():

    download_file(
        MODEL_URL,
        MODEL_PATH,
        "ML model"
    )

    download_file(
        METRICS_URL,
        METRICS_PATH,
        "model metrics"
    )

    download_file(
        HISTORICAL_DATA_URL,
        HISTORICAL_DATA_PATH,
        "historical prediction data"
    )

    print()
    print(
        "============================================"
    )
    print(
        "       DEPLOYMENT FILES READY"
    )
    print(
        "============================================"
    )
    print(
        f"Model: {MODEL_PATH}"
    )
    print(
        f"Metrics: {METRICS_PATH}"
    )
    print(
        f"Historical data: {HISTORICAL_DATA_PATH}"
    )
    print(
        "============================================"
    )


if __name__ == "__main__":

    main()