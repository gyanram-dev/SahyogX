import pandas as pd

# Load data
volunteers = pd.read_csv("data/volunteers.csv")
requests = pd.read_csv("data/requests.csv")

# Store assignments
assignments = []

for _, req in requests.iterrows():
    best_score = -1
    best_volunteer = None

    for _, vol in volunteers.iterrows():

        # Skip unavailable volunteers
        if vol["availability"] != "Yes":
            continue

        score = 0

        # Skill match
        if vol["skill"] == req["skill_required"]:
            score += 50

        # Same location
        if vol["location"] == req["location"]:
            score += 30

        # Reliability score
        score += int(vol["reliability"]) * 2

        # Urgency bonus
        score += int(req["urgency"])

        if score > best_score:
            best_score = score
            best_volunteer = vol["name"]

    assignments.append({
        "Request": req["need_type"],
        "Location": req["location"],
        "Assigned Volunteer": best_volunteer,
        "Score": best_score
    })

# Output
result = pd.DataFrame(assignments)
print(result)

result.to_csv("data/assignments.csv", index=False)
print("\nAssignments saved to data/assignments.csv")