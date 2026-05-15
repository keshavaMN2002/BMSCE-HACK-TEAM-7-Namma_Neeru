from fastapi import APIRouter, Query
from app.services.ml_service import predict_water_risk, get_all_ward_names
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class PredictionInput(BaseModel):
    # ── Required: at least one of these must be provided ──────
    ward_name: Optional[str] = None          # user-facing search field

    # ── Optional overrides (auto-filled from ward lookup if omitted) ──
    subdivision:      Optional[str]   = None
    service_station:  Optional[str]   = None
    days_supply:      Optional[str]   = None
    timing_length:    Optional[float] = None

    class Config:
        # Example shown in OpenAPI /docs
        json_schema_extra = {
            "examples": {
                "by_ward_name": {
                    "summary": "Search by ward name only (simplest)",
                    "value": {"ward_name": "Yelahanka Satellite town"}
                },
                "full_manual": {
                    "summary": "Manual full input",
                    "value": {
                        "ward_name":       "Jakkur",
                        "subdivision":     "C-1",
                        "service_station": "CHIKKALALBAGH 1 & 2",
                        "days_supply":     "Daily",
                        "timing_length":   2.5
                    }
                }
            }
        }


@router.post("/high-risk-areas", summary="Predict water crisis risk for an area")
def predict(data: PredictionInput):
    """
    Predict water supply crisis risk.

    - Pass **ward_name** alone for a quick lookup-based prediction.
    - Optionally pass other fields to override the lookup values.
    """
    if not data.ward_name and not data.subdivision:
        return {"error": "Provide at least 'ward_name' or 'subdivision' to predict."}

    return predict_water_risk(data.model_dump())


@router.get("/wards", summary="List all available ward names")
def list_wards(search: Optional[str] = Query(default=None, description="Filter by partial name")):
    """
    Returns all ward names. Use the `search` param for autocomplete.
    """
    all_wards = get_all_ward_names()
    if search:
        all_wards = [w for w in all_wards if search.lower() in w.lower()]
    return {"wards": all_wards, "count": len(all_wards)}