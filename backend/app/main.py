from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

app = FastAPI(title="SahyogX API")


# ---------- Request Model ----------
class HelpRequest(BaseModel):
    need_type: str
    location: str
    urgency: int
    skill_required: str


# ---------- Load Existing CSV ----------
requests_df = pd.read_csv("data/requests.csv")


@app.get("/")
def home():
    return {"message": "SahyogX backend is running"}


@app.get("/requests")
def get_requests():
    return requests_df.to_dict(orient="records")


@app.post("/request")
def add_request(new_request: HelpRequest):
    global requests_df

    new_row = {
        "id": len(requests_df) + 1,
        "need_type": new_request.need_type,
        "location": new_request.location,
        "urgency": new_request.urgency,
        "skill_required": new_request.skill_required
    }

    requests_df = pd.concat(
        [requests_df, pd.DataFrame([new_row])],
        ignore_index=True
    )

    return {"message": "Request added successfully", "data": new_row}


@app.get("/allocate")
def allocate():
    volunteers = pd.read_csv("data/volunteers.csv")

    assignments = []

    for _, req in requests_df.iterrows():
        best_score = -1
        best_volunteer = None

        for _, vol in volunteers.iterrows():

            if vol["availability"] != "Yes":
                continue

            score = 0

            if vol["skill"] == req["skill_required"]:
                score += 50

            if vol["location"] == req["location"]:
                score += 30

            score += int(vol["reliability"]) * 2
            score += int(req["urgency"])

            if score > best_score:
                best_score = score
                best_volunteer = vol["name"]

        assignments.append({
            "request": req["need_type"],
            "location": req["location"],
            "assigned_volunteer": best_volunteer,
            "score": best_score
        })

    return {"assignments": assignments}