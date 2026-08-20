import pandas as pd


# Load datasets

train = pd.read_csv("../data/raw/train.csv")
features = pd.read_csv("../data/raw/features.csv")
stores = pd.read_csv("../data/raw/stores.csv")


# Convert Date to datetime

train["Date"] = pd.to_datetime(train["Date"])
features["Date"] = pd.to_datetime(features["Date"])


# Merge train with features

df = pd.merge(
    train,
    features,
    on=["Store", "Date"],
    how="left",
    suffixes=("", "_features")
)


# Remove duplicate IsHoliday column

df = df.drop(columns=["IsHoliday_features"])


# Merge store information

df = pd.merge(
    df,
    stores,
    on="Store",
    how="left"
)


# Handle missing Markdown values

markdown_columns = [
    "MarkDown1",
    "MarkDown2",
    "MarkDown3",
    "MarkDown4",
    "MarkDown5"
]

df[markdown_columns] = df[markdown_columns].fillna(0)


# Remove negative sales

df = df[df["Weekly_Sales"] >= 0].copy()


# Create date features

df["Year"] = df["Date"].dt.year
df["Month"] = df["Date"].dt.month
df["Week"] = df["Date"].dt.isocalendar().week.astype(int)
df["Quarter"] = df["Date"].dt.quarter


# Sort data

df = df.sort_values(
    ["Store", "Dept", "Date"]
).reset_index(drop=True)


# Final data quality check

print("\n========== FINAL DATA ==========")

print("\nShape:")
print(df.shape)

print("\nMissing values:")
print(df.isnull().sum().sum())

print("\nNegative sales:")
print((df["Weekly_Sales"] < 0).sum())

print("\nColumns:")
print(df.columns.tolist())


# Save processed dataset

df.to_csv(
    "../data/processed/sales_cleaned.csv",
    index=False
)

print("\nCleaned dataset saved successfully.")