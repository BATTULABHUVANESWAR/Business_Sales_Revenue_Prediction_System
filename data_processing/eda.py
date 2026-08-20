import pandas as pd
import matplotlib.pyplot as plt


# Load cleaned dataset

df = pd.read_csv("../data/processed/sales_cleaned.csv")


# Convert Date to datetime

df["Date"] = pd.to_datetime(df["Date"])


# Aggregate weekly sales

weekly_sales = (
    df.groupby("Date")["Weekly_Sales"]
    .sum()
    .reset_index()
)


# Plot sales trend

plt.figure(figsize=(12, 6))

plt.plot(
    weekly_sales["Date"],
    weekly_sales["Weekly_Sales"]
)

plt.title("Weekly Sales Trend")
plt.xlabel("Date")
plt.ylabel("Total Weekly Sales")
plt.xticks(rotation=45)

plt.tight_layout()

plt.savefig(
    "../visualizations/weekly_sales_trend.png",
    dpi=300
)

plt.show()

# Store-wise Sales Analysis

store_sales = (
    df.groupby("Store")["Weekly_Sales"]
    .sum()
    .sort_values(ascending=False)
)


# Plot store-wise sales

plt.figure(figsize=(12, 6))

store_sales.plot(kind="bar")

plt.title("Total Sales by Store")
plt.xlabel("Store")
plt.ylabel("Total Sales")
plt.xticks(rotation=0)

plt.tight_layout()

plt.savefig(
    "../visualizations/store_wise_sales.png",
    dpi=300
)

plt.show()
print("\n========== TOP STORES ==========")

print(store_sales.head(10))

# Department-wise Sales Analysis

dept_sales = (
    df.groupby("Dept")["Weekly_Sales"]
    .sum()
    .sort_values(ascending=False)
)


# Plot department-wise sales

plt.figure(figsize=(12, 6))

dept_sales.head(15).plot(kind="bar")

plt.title("Top 15 Departments by Total Sales")
plt.xlabel("Department")
plt.ylabel("Total Sales")
plt.xticks(rotation=0)

plt.tight_layout()

plt.savefig(
    "../visualizations/department_wise_sales.png",
    dpi=300
)

plt.show()


# Top departments

print("\n========== TOP DEPARTMENTS ==========")

print(dept_sales.head(10))

# Holiday vs Non-Holiday Sales

holiday_weekly_sales = (
    df.groupby(["Date", "IsHoliday"])["Weekly_Sales"]
    .sum()
    .reset_index()
)


# Average sales per week

holiday_average = (
    holiday_weekly_sales
    .groupby("IsHoliday")["Weekly_Sales"]
    .mean()
)


print("\n========== HOLIDAY SALES ANALYSIS ==========")

print("\nAverage weekly sales:")

print(
    holiday_average.rename(
        index={
            False: "Non-Holiday",
            True: "Holiday"
        }
    )
)


# Plot average weekly sales

plt.figure(figsize=(8, 6))

holiday_average.plot(kind="bar")

plt.title("Average Weekly Sales: Holiday vs Non-Holiday")
plt.xlabel("Holiday")
plt.ylabel("Average Weekly Sales")
plt.xticks(
    [0, 1],
    ["Non-Holiday", "Holiday"],
    rotation=0
)

plt.tight_layout()

plt.savefig(
    "../visualizations/holiday_vs_nonholiday_average.png",
    dpi=300
)

plt.show()

# Year-wise Sales Analysis

yearly_sales = (
    df.groupby("Year")["Weekly_Sales"]
    .sum()
)


print("\n========== YEARLY SALES ==========")

print(yearly_sales)


# Plot yearly sales

plt.figure(figsize=(8, 6))

yearly_sales.plot(kind="bar")

plt.title("Total Sales by Year")
plt.xlabel("Year")
plt.ylabel("Total Sales")
plt.xticks(rotation=0)

plt.tight_layout()

plt.savefig(
    "../visualizations/yearly_sales.png",
    dpi=300
)

plt.show()

# Monthly Sales Analysis

monthly_sales = (
    df.groupby("Month")["Weekly_Sales"]
    .mean()
)


print("\n========== MONTHLY SALES ==========")

print(monthly_sales)


# Plot monthly average sales

plt.figure(figsize=(10, 6))

monthly_sales.plot(kind="bar")

plt.title("Average Weekly Sales by Month")
plt.xlabel("Month")
plt.ylabel("Average Weekly Sales")
plt.xticks(
    range(12),
    [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    rotation=0
)

plt.tight_layout()

plt.savefig(
    "../visualizations/monthly_sales.png",
    dpi=300
)

plt.show()