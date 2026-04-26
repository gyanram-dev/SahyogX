from fastapi import FastAPI, HTTPException
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

def normalize_requests_df():
    global requests_df

    if "id" not in requests_df.columns:
        requests_df.insert(0, "id", range(1, len(requests_df) + 1))

    requests_df["id"] = pd.to_numeric(requests_df["id"], errors="coerce")

    next_id = 1
    for idx, value in requests_df["id"].items():
        if pd.isna(value):
            requests_df.at[idx, "id"] = next_id
        next_id = max(next_id, int(requests_df.at[idx, "id"]) + 1)

    requests_df["id"] = requests_df["id"].astype(int)

    if "status" not in requests_df.columns:
        requests_df["status"] = "Open"
    else:
        requests_df["status"] = requests_df["status"].fillna("Open")

    if "assigned_to" not in requests_df.columns:
        requests_df["assigned_to"] = None

    if requests_df["id"].duplicated().any():
        seen_ids = set()
        next_id = int(requests_df["id"].max()) + 1

        for idx, request_id in requests_df["id"].items():
            if request_id in seen_ids:
                requests_df.at[idx, "id"] = next_id
                next_id += 1
            else:
                seen_ids.add(request_id)

        requests_df["id"] = requests_df["id"].astype(int)
        requests_df.to_csv(REQUESTS_FILE, index=False)


def request_records():
    normalize_requests_df()
    return (
        requests_df.astype(object)
        .where(pd.notna(requests_df), None)
        .to_dict(orient="records")
    )


def request_record(row_index: int):
    row = requests_df.loc[[row_index]]
    return (
        row.astype(object)
        .where(pd.notna(row), None)
        .to_dict(orient="records")[0]
    )


def update_request_status(request_id: int, status: str):
    global requests_df
    normalize_requests_df()

    matches = requests_df.index[requests_df["id"] == request_id].tolist()
    if not matches:
        raise HTTPException(status_code=404, detail="Request not found")

    row_index = matches[0]
    requests_df.at[row_index, "status"] = status
    requests_df.to_csv(REQUESTS_FILE, index=False)

    return request_record(row_index)

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
    return request_records()

@app.get("/volunteer/tasks")
def get_volunteer_tasks():
    normalize_requests_df()
    active_tasks = requests_df[requests_df["status"].isin(["Assigned", "Accepted"])]
    return (
        active_tasks.astype(object)
        .where(pd.notna(active_tasks), None)
        .to_dict(orient="records")
    )

@app.post("/request")
def add_request(data: RequestInput):
    global requests_df
    normalize_requests_df()

    next_id = 1 if requests_df.empty else int(requests_df["id"].max()) + 1

    new_row = pd.DataFrame([{
        "id": next_id,
        "need_type": data.need_type,
        "location": data.location,
        "urgency": data.urgency,
        "skill_required": data.skill_required,
        "status": "Open",
        "assigned_to": None,
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
@app.post("/assign/{request_id}")
def assign_request(request_id: int):
    global requests_df
    request = update_request_status(request_id, "Assigned")

    row_index = requests_df.index[requests_df["id"] == request_id].tolist()[0]
    requests_df.at[row_index, "assigned_to"] = "Volunteer A"
    requests_df.to_csv(REQUESTS_FILE, index=False)
    request = request_record(row_index)

    return {"message": "Assigned successfully", "request": request}

@app.post("/volunteer/accept/{request_id}")
def accept_volunteer_task(request_id: int):
    request = update_request_status(request_id, "Accepted")
    return {"message": "Task accepted successfully", "request": request}

@app.post("/volunteer/complete/{request_id}")
def complete_volunteer_task(request_id: int):
    request = update_request_status(request_id, "Completed")
    return {"message": "Task completed successfully", "request": request}
