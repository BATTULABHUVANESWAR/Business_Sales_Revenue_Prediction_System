import pandas as pd

# Load datasets

train = pd.read_csv("../data/raw/train.csv")
features = pd.read_csv("../data/raw/features.csv")
stores = pd.read_csv("../data/raw/stores.csv")


# Data Information

print("\n========== TRAIN DATA ==========")

print("\nShape:")
print(train.shape)

print("\nData types:")
print(train.dtypes)

print("\nMissing values:")
print(train.isnull().sum())

print("\nDuplicate rows:")
print(train.duplicated().sum())

print("\nBasic statistics:")
print(train.describe())


print("\n========== FEATURES DATA ==========")

print("\nShape:")
print(features.shape)

print("\nData types:")
print(features.dtypes)

print("\nMissing values:")
print(features.isnull().sum())

print("\nDuplicate rows:")
print(features.duplicated().sum())

print("\nBasic statistics:")
print(features.describe())


print("\n========== STORES DATA ==========")

print("\nShape:")
print(stores.shape)

print("\nData types:")
print(stores.dtypes)

print("\nMissing values:")
print(stores.isnull().sum())

print("\nDuplicate rows:")
print(stores.duplicated().sum())

print("\nBasic statistics:")
print(stores.describe())


# Date Information

print("\n========== DATE INFORMATION ==========")

print("Train date range:")
print(train["Date"].min(), "to", train["Date"].max())

print("\nFeatures date range:")
print(features["Date"].min(), "to", features["Date"].max())


# Sales Information

print("\n========== SALES INFORMATION ==========")

print("Minimum Weekly Sales:")
print(train["Weekly_Sales"].min())

print("\nMaximum Weekly Sales:")
print(train["Weekly_Sales"].max())

print("\nAverage Weekly Sales:")
print(train["Weekly_Sales"].mean())

print("\nNumber of negative sales:")
print((train["Weekly_Sales"] < 0).sum())

# Negative Sales Information

negative_sales = train[train["Weekly_Sales"] < 0]

print("\nNegative sales rows:")
print(negative_sales.head(20))

print("\nNumber of negative sales:")
print(len(negative_sales))

print("\nNegative sales by department:")
print(negative_sales["Dept"].value_counts().head(10))

print("\nNegative sales by store:")
print(negative_sales["Store"].value_counts().head(10))

# Missing Value Information

print("\n========== MISSING VALUE INFORMATION ==========")

print("\nMissing values in features:")
print(features.isnull().sum())

print("\nMissing values by date:")
print(
    features[
        features[["CPI", "Unemployment"]].isnull().any(axis=1)
    ][["Store", "Date", "CPI", "Unemployment"]].head(20)
)

print("\nMarkdown missing value percentage:")

markdown_columns = [
    "MarkDown1",
    "MarkDown2",
    "MarkDown3",
    "MarkDown4",
    "MarkDown5"
]

for column in markdown_columns:
    percentage = features[column].isnull().mean() * 100
    print(f"{column}: {percentage:.2f}%")