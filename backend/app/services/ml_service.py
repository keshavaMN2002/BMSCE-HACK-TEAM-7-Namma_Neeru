import joblib
import pandas as pd
import random
import os

BASE_DIR = r"C:\Users\Admin\Documents\NammaNeeru\mlmodel"

model    = joblib.load(os.path.join(BASE_DIR, "water_supply_model.pkl"))
encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))
features = joblib.load(os.path.join(BASE_DIR, "feature_list.pkl"))
lookup   = pd.read_csv(os.path.join(BASE_DIR, "ward_lookup.csv"))

# Normalize lookup for case-insensitive matching
lookup["ward_name_clean"] = lookup["ward_name_clean"].str.strip().str.upper()


def _encode(col: str, val) -> int:
    """Encode a single value using saved label mappings."""
    mapping = encoders[col]["mapping"]
    key = str(val).strip().upper() if col == "ward_name_clean" else str(val)
    return mapping.get(key, encoders[col]["default"])


def _lookup_ward(ward_name_input: str) -> dict | None:
    """
    Find a ward row by name (exact → partial fallback).
    Returns a plain dict or None if not found.
    """
    query = ward_name_input.strip().upper()
    match = lookup[lookup["ward_name_clean"] == query]
    if match.empty:
        match = lookup[lookup["ward_name_clean"].str.contains(query, na=False)]
    return match.iloc[0].to_dict() if not match.empty else None


def get_all_ward_names() -> list[str]:
    """Return sorted list of all known ward names (for autocomplete)."""
    return sorted(lookup["ward_name"].dropna().unique().tolist())


def predict_water_risk(data: dict) -> dict:
    """
    Accepts either:
      (A) ward_name only → auto-fills all ward stats from lookup
      (B) full feature dict → uses provided values directly

    Returns risk prediction with reasons.
    """

    # ── Resolve ward data ──────────────────────────────────────
    ward_row = None
    ward_name_input = data.get("ward_name", "")

    if ward_name_input:
        ward_row = _lookup_ward(ward_name_input)
        if ward_row is None:
            available = get_all_ward_names()
            return {
                "error": f"Ward '{ward_name_input}' not found.",
                "available_wards": available
            }

    # If ward_row found, use its values; allow data dict to override
    def resolve(field, fallback=0):
        if field in data and data[field] is not None:
            return data[field]
        return ward_row[field] if ward_row and field in ward_row else fallback

    subdivision     = resolve("subdivision",     "Unknown")
    service_station = resolve("service_station", "Unknown")
    days_supply     = resolve("days_supply",     "Unknown")
    ward_name_clean = (ward_row["ward_name_clean"] if ward_row
                       else str(ward_name_input).strip().upper())
    timing_length      = resolve("timing_length",      0.0)
    num_connections    = resolve("num_connections",     0.0)
    consumption_ml     = resolve("consumption_ml",      0.0)
    consumption_per_conn = resolve("consumption_per_conn", 0.0)

    # ── Build encoded input ────────────────────────────────────
    input_df = pd.DataFrame([{
        "subdivision_enc":       _encode("subdivision",     subdivision),
        "service_station_enc":   _encode("service_station", service_station),
        "days_supply_enc":       _encode("days_supply",     days_supply),
        "ward_name_clean_enc":   _encode("ward_name_clean", ward_name_clean),
        "timing_length":         float(timing_length),
        "num_connections":       float(num_connections),
        "consumption_ml":        float(consumption_ml),
        "consumption_per_conn":  float(consumption_per_conn),
    }])[features]   # reorder columns to exactly match training order

    # ── Predict ────────────────────────────────────────────────
    prediction    = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]

    risk_map = {0: "Low Risk", 1: "Medium Risk", 2: "High Risk"}

    # ── Reasons (domain logic) ─────────────────────────────────
    reasons = []
    if float(timing_length) < 2:
        reasons.append("Short water supply window (< 2 hrs)")
    if str(days_supply).strip().lower() not in ("daily", "unknown"):
        reasons.append(f"Intermittent supply schedule ({days_supply})")
    if float(consumption_ml) > 300:
        reasons.append("High total ward consumption (> 300 ML)")
    if float(consumption_per_conn) > 0.05:
        reasons.append("High consumption per connection (demand stress)")
    if float(num_connections) < 2000:
        reasons.append("Low connection count (underserved area)")
    if not reasons:
        reasons.append("Water supply conditions are stable")

    return {
        "id":           random.randint(1, 10000),
        "ward_name":    ward_row["ward_name"] if ward_row else ward_name_input,
        "ward_number":  int(ward_row["ward_number"]) if ward_row else None,
        "risk":         risk_map[int(prediction)],
        "confidence":   f"{round(max(probabilities) * 100, 2)}%",
        "reasons":      reasons,
        "details": {
            "subdivision":        subdivision,
            "service_station":    service_station,
            "days_supply":        days_supply,
            "supply_hours":       timing_length,
            "num_connections":    int(num_connections),
            "consumption_ml":     round(float(consumption_ml), 2),
        },
        "prediction": int(prediction)
    }