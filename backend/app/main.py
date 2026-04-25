from fastapi import FastAPI
import pandas as pd

app = FastAPI(title="SahyogX API")


@app.get("/")
def home():
    return {"message": "SahyogX backend is running"}


@app.get("/allocate")
def allocate():
    volunteers = pd.read_csv("data/volunteers.csv")
    requests = pd.read_csv("data/requests.csv")

    assignments = []

    for _, req in requests.iterrows():
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