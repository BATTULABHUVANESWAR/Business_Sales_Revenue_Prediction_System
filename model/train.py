import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor


# ============================================================
# 1. LOAD DATA
# ============================================================

df = pd.read_csv("data/processed/ml_ready.csv")

# Convert Date
df["Date"] = pd.to_datetime(df["Date"])

# Sort chronologically
df = df.sort_values("Date").reset_index(drop=True)


# ============================================================
# 2. DEFINE TARGET AND FEATURES
# ============================================================

target = "Weekly_Sales"

features = [
    "Store",
    "Dept",
    "IsHoliday",
    "Temperature",
    "Fuel_Price",
    "MarkDown1",
    "MarkDown2",
    "MarkDown3",
    "MarkDown4",
    "MarkDown5",
    "CPI",
    "Unemployment",
    "Type",
    "Size",
    "Year",
    "Month",
    "Week",
    "Quarter",
    "Lag_1",
    "Lag_2",
    "Lag_4",
    "Rolling_Mean_4",
    "Rolling_Mean_8"
]

X = df[features]
y = df[target]


# ============================================================
# 3. TIME-BASED TRAIN / TEST SPLIT
# ============================================================

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining rows:", len(X_train))
print("Testing rows:", len(X_test))

print("\nTraining date range:")
print(df["Date"].iloc[0], "to", df["Date"].iloc[split_index - 1])

print("\nTesting date range:")
print(df["Date"].iloc[split_index], "to", df["Date"].iloc[-1])


# ============================================================
# 4. PREPROCESSING
# ============================================================

categorical_features = ["Type"]

numeric_features = [
    "Store",
    "Dept",
    "IsHoliday",
    "Temperature",
    "Fuel_Price",
    "MarkDown1",
    "MarkDown2",
    "MarkDown3",
    "MarkDown4",
    "MarkDown5",
    "CPI",
    "Unemployment",
    "Size",
    "Year",
    "Month",
    "Week",
    "Quarter",
    "Lag_1",
    "Lag_2",
    "Lag_4",
    "Rolling_Mean_4",
    "Rolling_Mean_8"
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ============================================================
# 5. MODELS
# ============================================================

models = {

    "Linear Regression": LinearRegression(),

    "Random Forest": RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    ),

    "XGBoost": XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=6,
        random_state=42,
        n_jobs=-1
    )
}


# ============================================================
# 6. TRAIN AND EVALUATE
# ============================================================

results = {}
trained_models = {}

for name, model in models.items():

    print(f"\nTraining {name}...")

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ]
    )

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)

    rmse = np.sqrt(
        mean_squared_error(y_test, y_pred)
    )

    r2 = r2_score(y_test, y_pred)

    results[name] = {
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    }

    trained_models[name] = pipeline


# ============================================================
# 7. MODEL COMPARISON
# ============================================================

results_df = pd.DataFrame(results).T

print("\n================ MODEL PERFORMANCE ================\n")
print(results_df)


# ============================================================
# 8. SELECT BEST MODEL
# ============================================================

# Primary: lowest MAE
# Secondary: lowest RMSE

best_model_name = (
    results_df
    .sort_values(
        by=["MAE", "RMSE"],
        ascending=[True, True]
    )
    .index[0]
)

best_model = trained_models[best_model_name]

print("\n====================================================")
print("BEST MODEL:", best_model_name)
print("====================================================")

print("\nBest Model Metrics:")

print("MAE :", results_df.loc[best_model_name, "MAE"])
print("RMSE:", results_df.loc[best_model_name, "RMSE"])
print("R2  :", results_df.loc[best_model_name, "R2"])


# ============================================================
# 9. SAVE BEST MODEL
# ============================================================

joblib.dump(
    best_model,
    "model.joblib"
)

print("\nModel saved successfully as: model.joblib")