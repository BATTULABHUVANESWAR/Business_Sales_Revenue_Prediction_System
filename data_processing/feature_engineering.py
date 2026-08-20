import pandas as pd


# Load cleaned dataset

df = pd.read_csv(
    "../data/processed/sales_cleaned.csv"
)

df["Date"] = pd.to_datetime(df["Date"])


# Sort data

df = df.sort_values(
    ["Store", "Dept", "Date"]
).reset_index(drop=True)


# Create lag features

group = df.groupby(["Store", "Dept"])["Weekly_Sales"]

df["Lag_1"] = group.shift(1)
df["Lag_2"] = group.shift(2)
df["Lag_4"] = group.shift(4)


# Create rolling features

df["Rolling_Mean_4"] = (
    df.groupby(["Store", "Dept"])["Weekly_Sales"]
    .transform(lambda x: x.shift(1).rolling(4).mean())
)

df["Rolling_Mean_8"] = (
    df.groupby(["Store", "Dept"])["Weekly_Sales"]
    .transform(lambda x: x.shift(1).rolling(8).mean())
)


# Display information

print("\n========== FEATURE ENGINEERING ==========")

print("\nNew features:")
print([
    "Lag_1",
    "Lag_2",
    "Lag_4",
    "Rolling_Mean_4",
    "Rolling_Mean_8"
])

print("\nMissing values created by lag/rolling features:")
print(
    df[
        [
            "Lag_1",
            "Lag_2",
            "Lag_4",
            "Rolling_Mean_4",
            "Rolling_Mean_8"
        ]
    ].isnull().sum()
)

# Remove rows without sufficient historical data

df = df.dropna(
    subset=[
        "Lag_1",
        "Lag_2",
        "Lag_4",
        "Rolling_Mean_4",
        "Rolling_Mean_8"
    ]
).copy()

# Final feature check

print("\n========== FINAL FEATURE DATA ==========")

print("Shape:")
print(df.shape)

print("\nMissing values:")
print(df.isnull().sum())

print("\nFeatures:")
print(df.columns.tolist())

# Save ML-ready dataset

df.to_csv(
    "../data/processed/ml_ready.csv",
    index=False
)

print("\nML-ready dataset saved successfully.")