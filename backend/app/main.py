from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import pandas as pd

# ---------------------------
# App Setup
# ---------------------------
app = FastAPI(title="SahyogX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # hackathon mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# File Paths
# ---------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

REQUESTS_FILE = DATA_DIR / "requests.csv"
VOLUNTEERS_FILE = DATA_DIR / "volunteers.csv"

# ---------------------------
# Load Data
# ---------------------------
requests_df = pd.read_csv(REQUESTS_FILE)
volunteers_df = pd.read_csv(VOLUNTEERS_FILE)

# ---------------------------
# Models
# ---------------------------
class RequestInput(BaseModel):
    need_type: str
    location: str
    urgency: int
    skill_required: str

# ---------------------------
# Routes
# ---------------------------
@app.get("/")
def home():
    return {"message": "SahyogX backend is running"}

@app.get("/requests")
def get_requests():
    global requests_df
    return requests_df.to_dict(orient="records")

@app.post("/request")
def add_request(data: RequestInput):
    global requests_df

    new_row = pd.DataFrame([{
        "id": len(requests_df) + 1,
        "need_type": data.need_type,
        "location": data.location,
        "urgency": data.urgency,
        "skill_required": data.skill_required
    }])

    requests_df = pd.concat([requests_df, new_row], ignore_index=True)
    requests_df.to_csv(REQUESTS_FILE, index=False)

    return {"message": "Request added successfully"}

@app.get("/allocate")
def allocate():
    global requests_df, volunteers_df

    assignments = []

    used_volunteers = set()

    for _, req in requests_df.iterrows():
        best_score = -1
        best_person = None

        for _, vol in volunteers_df.iterrows():

            if vol["name"] in used_volunteers:
                continue

            score = 0

            if req["location"] == vol["location"]:
                score += 50

            if req["skill_required"].lower() == vol["skill"].lower():
                score += 40

            score += int(req["urgency"])

            if score > best_score:
                best_score = score
                best_person = vol["name"]

        if best_person:
            used_volunteers.add(best_person)

        assignments.append({
            "request": req["need_type"],
            "location": req["location"],
            "assigned_volunteer": best_person if best_person else "Unassigned",
            "score": best_score
        })

    return {"assignments": assignments}