import os
import urllib.request

MODEL_URL = (
    "https://huggingface.co/"
    "Bhuvi18/business-sales-prediction-model/"
    "resolve/main/model.joblib"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "model.joblib")


def download_model():

    os.makedirs(MODEL_DIR, exist_ok=True)

    if os.path.exists(MODEL_PATH):
        print("✓ ML model already exists.")
        return

    print("Downloading ML model...")

    urllib.request.urlretrieve(
        MODEL_URL,
        MODEL_PATH
    )

    print("✓ ML model downloaded successfully.")


if __name__ == "__main__":
    download_model()