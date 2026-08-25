import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping


# ============================================================
# 1. LOAD DATA
# ============================================================

df = pd.read_csv("../data/processed/ml_ready.csv")

df["Date"] = pd.to_datetime(df["Date"])

df = df.sort_values(
    "Date"
).reset_index(drop=True)


# ============================================================
# 2. FEATURES AND TARGET
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
# 3. TIME-BASED TRAIN / VALIDATION / TEST SPLIT
# ============================================================

unique_dates = sorted(
    df["Date"].unique()
)

total_dates = len(unique_dates)

train_end_index = int(
    total_dates * 0.70
)

validation_end_index = int(
    total_dates * 0.80
)

train_end_date = unique_dates[
    train_end_index
]

validation_end_date = unique_dates[
    validation_end_index
]


train_mask = (
    df["Date"] < train_end_date
)

validation_mask = (
    (df["Date"] >= train_end_date) &
    (df["Date"] < validation_end_date)
)

test_mask = (
    df["Date"] >= validation_end_date
)


X_train = X.loc[train_mask]
y_train = y.loc[train_mask]

X_validation = X.loc[validation_mask]
y_validation = y.loc[validation_mask]

X_test = X.loc[test_mask]
y_test = y.loc[test_mask]


print("\n================ DATA SPLIT ================\n")

print(
    "Training rows   :",
    len(X_train)
)

print(
    "Validation rows :",
    len(X_validation)
)

print(
    "Testing rows    :",
    len(X_test)
)


# ============================================================
# 4. PREPROCESSING
# ============================================================

categorical_features = [
    "Type"
]

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

            OneHotEncoder(
                handle_unknown="ignore"
            ),

            categorical_features
        ),

        (
            "numeric",

            StandardScaler(),

            numeric_features
        )

    ]
)


# ============================================================
# 5. FIT PREPROCESSOR ONLY ON TRAINING DATA
# ============================================================

X_train_processed = preprocessor.fit_transform(
    X_train
)

X_validation_processed = preprocessor.transform(
    X_validation
)

X_test_processed = preprocessor.transform(
    X_test
)



print(
    "\nProcessed feature shape:",
    X_train_processed.shape
)


# ============================================================
# 6. BUILD ANN
# ============================================================

input_features = X_train_processed.shape[1]


model = Sequential([

    Input(
        shape=(input_features,)
    ),

    Dense(
        128,
        activation="relu"
    ),

    Dropout(0.2),

    Dense(
        64,
        activation="relu"
    ),

    Dropout(0.2),

    Dense(
        32,
        activation="relu"
    ),

    Dense(1)

])


model.compile(

    optimizer="adam",

    loss="mse"

)


print(
    "\n================ ANN MODEL ================\n"
)

model.summary()


# ============================================================
# 7. EARLY STOPPING
# ============================================================

early_stopping = EarlyStopping(

    monitor="val_loss",

    patience=7,

    restore_best_weights=True

)


# ============================================================
# 8. TRAIN ANN
# ============================================================

print(
    "\nTraining ANN...\n"
)


history = model.fit(

    X_train_processed,

    y_train.values,

    validation_data=(

        X_validation_processed,

        y_validation.values

    ),

    epochs=50,

    batch_size=256,

    callbacks=[

        early_stopping

    ],

    verbose=1

)


# ============================================================
# 9. PREDICT
# ============================================================

y_pred = model.predict(
    X_test_processed
).ravel()


# ============================================================
# 10. EVALUATION
# ============================================================

mae = mean_absolute_error(
    y_test,
    y_pred
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        y_pred
    )
)

r2 = r2_score(
    y_test,
    y_pred
)


# ============================================================
# 11. DISPLAY RESULTS
# ============================================================

print(
    "\n================ ANN PERFORMANCE ================\n"
)

print(
    f"MAE  : {mae:,.2f}"
)

print(
    f"RMSE : {rmse:,.2f}"
)

print(
    f"R²   : {r2:.4f}"
)

print(
    f"R² % : {r2 * 100:.2f}%"
)


# ============================================================
# 12. SAVE MODEL
# ============================================================

model.save(
    "ann_model.keras"
)

print(
    "\nANN model saved as: ann_model.keras"
)


# ============================================================
# 13. SAVE PREPROCESSOR
# ============================================================

joblib.dump(
    preprocessor,
    "ann_preprocessor.joblib"
)

print(
    "ANN preprocessor saved as: ann_preprocessor.joblib"
)


# ============================================================
# 14. SAVE METRICS
# ============================================================

ann_metrics = {

    "model": "ANN",

    "MAE": float(mae),

    "RMSE": float(rmse),

    "R2": float(r2),

    "training_rows": len(
        X_train
    ),

    "validation_rows": len(
        X_validation
    ),

    "testing_rows": len(
        X_test
    ),

    "input_features": int(
        input_features
    )

}


joblib.dump(
    ann_metrics,
    "ann_metrics.joblib"
)


print(
    "ANN metrics saved as: ann_metrics.joblib"
)


print(
    "\n================ ANN TRAINING COMPLETE ================\n"
)