import pandas as pd
import numpy as np
import joblib
import re
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier

# ── 1. LOAD DATA ──────────────────────────────────────────────
df = pd.read_csv(
    r"C:\Users\Admin\Documents\NammaNeeru\mlmodel\data\wtr_sply_tmngs.csv",
    encoding="latin1", skiprows=1
)
df.columns = ["sl_no", "subdivision", "service_station", "area_detail", "days_supply", "timings"]
df = df[df["sl_no"] != "SI NO"]

df["subdivision"]     = df["subdivision"].ffill()
df["service_station"] = df["service_station"].ffill()
df["days_supply"]     = df["days_supply"].ffill()

ward_df = pd.read_csv(
    r"C:\Users\Admin\Documents\NammaNeeru\mlmodel\data\ward_consumption.csv"
)
ward_df.columns = ["ward_number", "ward_name", "num_connections", "consumption_ml"]
ward_df["ward_name_clean"] = ward_df["ward_name"].str.strip().str.upper()

# ── 2. EXTRACT WARD NUMBER ────────────────────────────────────
def extract_ward_number(text):
    match = re.search(r'Ward\s*No\.?\s*(\d+)', str(text), re.IGNORECASE)
    return int(match.group(1)) if match else np.nan

df["ward_number"] = df["timings"].apply(extract_ward_number)

# ── 3. TIMING FEATURE ─────────────────────────────────────────
def extract_hours(timing):
    try:
        t = str(timing).upper()
        nums = re.findall(r"(\d+\.\d+|\d+)", t)
        if len(nums) >= 2:
            start, end = float(nums[0]), float(nums[1])
            if "PM" in t and "AM" in t and start > end:
                return (12 - start) + end
            return abs(end - start)
    except:
        pass
    return 0

df["timing_length"] = df["timings"].apply(extract_hours)

# ── 4. PRESERVE ORIGINALS before encoding ─────────────────────
# Critical: save string values NOW before label encoding overwrites them
df["subdivision_orig"]     = df["subdivision"].copy()
df["service_station_orig"] = df["service_station"].copy()
df["days_supply_orig"]     = df["days_supply"].copy()

# ── 5. JOIN ward data for model training rows only ────────────
df = df.merge(
    ward_df[["ward_number", "ward_name", "ward_name_clean",
             "num_connections", "consumption_ml"]],
    on="ward_number",
    how="left"
)
df["num_connections"] = df["num_connections"].fillna(df["num_connections"].median())
df["consumption_ml"]  = df["consumption_ml"].fillna(df["consumption_ml"].median())
df["ward_name"]       = df["ward_name"].fillna("Unknown")
df["ward_name_clean"] = df["ward_name_clean"].fillna("UNKNOWN")

df["consumption_per_conn"] = (
    df["consumption_ml"] / df["num_connections"].replace(0, np.nan)
).fillna(0)

# ── 6. RISK LABEL ─────────────────────────────────────────────
q75_stress = df["consumption_per_conn"].quantile(0.75)
q25_conn   = df["num_connections"].quantile(0.25)

def create_risk(row):
    score = 0
    if str(row["days_supply"]).strip() == "Daily":       score += 2
    if row["timing_length"] < 2:                         score += 1
    if "CHIKKALALBAGH" in str(row["service_station"]):   score += 1
    if row["consumption_per_conn"] > q75_stress:         score += 1
    if row["num_connections"] < q25_conn:                score += 1
    if score >= 4: return 2
    elif score >= 2: return 1
    else: return 0

df["risk"] = df.apply(create_risk, axis=1)

# ── 7. LABEL ENCODING ─────────────────────────────────────────
label_cols = ["subdivision", "service_station", "days_supply", "ward_name_clean"]
encoders = {}

for col in label_cols:
    unique_vals = df[col].astype(str).unique()
    mapping = {val: i for i, val in enumerate(unique_vals)}
    df[col + "_enc"] = df[col].astype(str).map(mapping)
    encoders[col] = {"mapping": mapping, "default": -1}

# ── 8. TRAIN ──────────────────────────────────────────────────
features = [
    "subdivision_enc", "service_station_enc", "days_supply_enc",
    "ward_name_clean_enc", "timing_length",
    "num_connections", "consumption_ml", "consumption_per_conn"
]

X = df[features]
y = df["risk"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(
    n_estimators=100, max_depth=5, learning_rate=0.1,
    objective="multi:softmax", num_class=3, eval_metric="mlogloss"
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")

# ── 9. SAVE MODEL ARTIFACTS ───────────────────────────────────
joblib.dump(model,    "water_supply_model.pkl")
joblib.dump(encoders, "label_encoders.pkl")
joblib.dump(features, "feature_list.pkl")

# ── 10. BUILD COMPLETE WARD LOOKUP (all wards from ward_df) ───
#
# Strategy:
#   - Start with ALL wards from ward_df (this is the source of truth)
#   - For wards that matched timings, use their actual supply stats
#   - For wards with no timing match, fill with the closest subdivision
#     median or overall median — NOT dropped
#

# Compute per-ward supply stats from matched training rows
matched_supply = (
    df[df["ward_number"].notna()]
    .groupby("ward_number")
    .agg(
        timing_length=("timing_length",        "median"),
        subdivision=("subdivision_orig",        "first"),
        service_station=("service_station_orig","first"),
        days_supply=("days_supply_orig",        "first"),
    )
    .reset_index()
)

# Global medians as fallback for unmatched wards
median_timing = df["timing_length"].median()
most_common_subdivision     = df["subdivision_orig"].mode()[0]
most_common_service_station = df["service_station_orig"].mode()[0]
most_common_days_supply     = df["days_supply_orig"].mode()[0]

# Merge ALL wards ← supply stats (left join keeps all wards)
ward_lookup = ward_df.merge(matched_supply, on="ward_number", how="left")

# Fill unmatched wards with fallback values
ward_lookup["timing_length"]   = ward_lookup["timing_length"].fillna(median_timing)
ward_lookup["subdivision"]     = ward_lookup["subdivision"].fillna(most_common_subdivision)
ward_lookup["service_station"] = ward_lookup["service_station"].fillna(most_common_service_station)
ward_lookup["days_supply"]     = ward_lookup["days_supply"].fillna(most_common_days_supply)

# Recompute consumption_per_conn for every ward
ward_lookup["consumption_per_conn"] = (
    ward_lookup["consumption_ml"] / ward_lookup["num_connections"].replace(0, np.nan)
).fillna(df["consumption_per_conn"].median())

# Ensure clean name column exists
ward_lookup["ward_name_clean"] = ward_lookup["ward_name"].str.strip().str.upper()

# ── Add encoder entries for ALL ward names not seen during training ──
# This ensures new ward names don't return -1 (unknown) at inference
ward_name_mapping = encoders["ward_name_clean"]["mapping"]
next_id = max(ward_name_mapping.values()) + 1

for clean_name in ward_lookup["ward_name_clean"]:
    if clean_name not in ward_name_mapping:
        ward_name_mapping[clean_name] = next_id
        next_id += 1

encoders["ward_name_clean"]["mapping"] = ward_name_mapping

# Re-save encoders with the extended ward name mapping
joblib.dump(encoders, "label_encoders.pkl")

ward_lookup.to_csv("ward_lookup.csv", index=False)

print(f"\n ward_lookup.csv saved with {len(ward_lookup)} wards")
print(f" encoder updated with {len(ward_name_mapping)} ward name entries")
print(f"\nSample wards:\n{ward_lookup[['ward_name','ward_number','num_connections','days_supply']].head(10).to_string()}")