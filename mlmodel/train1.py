import pandas as pd
import numpy as np
import joblib

from difflib import get_close_matches

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

from xgboost import XGBClassifier


supply_df = pd.read_csv(
    "data/wtr_sply_tmngs.csv",
    encoding="latin1"
)

consumption_df = pd.read_csv(
    "data/Water_Consumption_Data_Mar_26_0.csv"
)


supply_df.columns = [
    "sl_no",
    "subdivision",
    "service_station",
    "area_detail",
    "days_supply",
    "timings"
]

consumption_df.columns = [
    "ward_number",
    "ward_name",
    "connections",
    "consumption_ml"
]


supply_df = supply_df[supply_df["sl_no"] != "SI NO"]

supply_df = supply_df.ffill()

supply_df = supply_df.dropna()


supply_df["area_detail"] = (
    supply_df["area_detail"]
    .astype(str)
    .str.lower()
    .str.strip()
)

consumption_df["ward_name"] = (
    consumption_df["ward_name"]
    .astype(str)
    .str.lower()
    .str.strip()
)


supply_df["timing_length"] = (
    supply_df["timings"]
    .astype(str)
    .apply(len)
)


ward_names = consumption_df["ward_name"].unique().tolist()

mapping_data = []

for area in supply_df["area_detail"].unique():

    match = get_close_matches(
        area,
        ward_names,
        n=1,
        cutoff=0.4
    )

    if match:
        matched_ward = match[0]
    else:
        matched_ward = "unknown"

    mapping_data.append({
        "area_detail": area,
        "ward_name": matched_ward
    })


mapping_df = pd.DataFrame(mapping_data)


mapping_df.to_csv(
    "data/area_ward_mapping.csv",
    index=False
)

print("\nArea → Ward mapping saved successfully!")


supply_df = pd.merge(
    supply_df,
    mapping_df,
    on="area_detail",
    how="left"
)


merged_df = pd.merge(
    supply_df,
    consumption_df,
    on="ward_name",
    how="left"
)


merged_df["connections"] = (
    merged_df["connections"]
    .fillna(0)
)

merged_df["consumption_ml"] = (
    merged_df["consumption_ml"]
    .fillna(0)
)


label_cols = [
    "subdivision",
    "service_station",
    "days_supply",
    "ward_name"
]

encoders = {}

for col in label_cols:

    le = LabelEncoder()

    merged_df[col] = le.fit_transform(
        merged_df[col].astype(str)
    )

    encoders[col] = le


def create_risk(row):

    score = 0

    if row["timing_length"] < 25:
        score += 2

    elif row["timing_length"] < 50:
        score += 1

    if row["consumption_ml"] > 300:
        score += 2

    elif row["consumption_ml"] > 150:
        score += 1

    if row["connections"] > 5000:
        score += 1

    if score >= 4:
        return 2

    elif score >= 2:
        return 1

    return 0


merged_df["risk"] = merged_df.apply(
    create_risk,
    axis=1
)


X = merged_df[
    [
        "subdivision",
        "service_station",
        "days_supply",
        "ward_name",
        "timing_length",
        "connections",
        "consumption_ml"
    ]
]

y = merged_df["risk"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    objective="multi:softmax",
    num_class=3
)


model.fit(X_train, y_train)


y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", accuracy)


joblib.dump(
    model,
    "water_supply_model.pkl"
)

print("\nModel saved successfully!")