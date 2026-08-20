import joblib
import pandas as pd


# Load trained model
model = joblib.load("model.joblib")


def predict_sales(input_data):

    # Convert input to DataFrame
    input_df = pd.DataFrame([input_data])

    # Make prediction
    prediction = model.predict(input_df)

    return float(prediction[0])


# Example input
if __name__ == "__main__":

    sample_input = {
        "Store": 10,
        "Dept": 72,
        "IsHoliday": False,
        "Temperature": 55.0,
        "Fuel_Price": 3.0,
        "MarkDown1": 0,
        "MarkDown2": 0,
        "MarkDown3": 0,
        "MarkDown4": 0,
        "MarkDown5": 0,
        "CPI": 126.0,
        "Unemployment": 8.0,
        "Type": "A",
        "Size": 150000,
        "Year": 2012,
        "Month": 11,
        "Week": 47,
        "Quarter": 4,
        "Lag_1": 400000,
        "Lag_2": 350000,
        "Lag_4": 300000,
        "Rolling_Mean_4": 350000,
        "Rolling_Mean_8": 330000
    }

    prediction = predict_sales(sample_input)

    print("\n========== SALES PREDICTION ==========")
    print(f"Predicted Weekly Sales: {prediction:.2f}")