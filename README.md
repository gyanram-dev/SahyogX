# SahyogX

![Hackathon](https://img.shields.io/badge/Hackathon-Submission-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TanStack-61dafb)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Storage](https://img.shields.io/badge/Storage-CSV-lightgrey)
![Status](https://img.shields.io/badge/Workflow-Live%20Relief%20Coordination-success)

SahyogX is an AI-inspired smart resource allocation platform for NGOs, volunteers, and citizens during urgent community support situations.

It helps citizens raise requests, NGOs triage and assign them, and volunteers receive actionable tasks through a simple live workflow.

## Problem Statement

During disasters, relief drives, and local emergencies, help requests often arrive through scattered channels such as calls, chats, spreadsheets, and social media. NGOs struggle to see priorities clearly, assign the right volunteer quickly, and track whether a request was actually completed.

This creates delays, duplicate effort, poor visibility, and missed support for people who need help most.

## Solution Overview

SahyogX provides a unified coordination system with three role-based experiences:

- Citizens submit help requests with category, urgency, location, and details.
- NGOs monitor live requests, review them, assign them, and close completed cases.
- Volunteers receive assigned tasks, accept work, and mark tasks complete.

The project uses CSV-backed persistence for hackathon-friendly setup, making the full workflow easy to run locally without external database configuration.

## Key Features

- Role-based portals for Citizen, NGO, and Volunteer users.
- Live NGO dashboard with automatic request refresh.
- Volunteer dashboard with live task updates.
- Full status workflow:
  - `Raised`
  - `Under Review`
  - `Assigned`
  - `Accepted`
  - `Completed`
  - `Closed`
- Colored status badges across dashboards.
- NGO analytics cards powered by backend CSV data:
  - Total Requests
  - Pending Requests
  - Assigned Requests
  - Completed Requests
  - Completion Rate
- Loading and success feedback for citizen, NGO, and volunteer actions.
- CSV persistence for requests and volunteers.
- Modern premium UI built with React, Tailwind CSS, TanStack Router, and Lucide icons.

## Workflow

```mermaid
flowchart LR
    A["Citizen raises request"] --> B["Status: Raised"]
    B --> C["NGO reviews request"]
    C --> D["Status: Under Review"]
    D --> E["NGO assigns volunteer"]
    E --> F["Status: Assigned"]
    F --> G["Volunteer accepts task"]
    G --> H["Status: Accepted"]
    H --> I["Volunteer completes task"]
    I --> J["Status: Completed"]
    J --> K["NGO closes request"]
    K --> L["Status: Closed"]
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TanStack Router, Vite |
| Styling | Tailwind CSS, custom portal design system |
| Icons | Lucide React |
| Backend | FastAPI, Uvicorn |
| Data Handling | Pandas |
| Persistence | CSV files |
| Language | TypeScript, Python |

## CSV Persistence

SahyogX stores core operational data in local CSV files under the `data/` directory:

- `data/requests.csv` stores citizen requests, status, urgency, location, skill needs, and assignment state.
- `data/volunteers.csv` stores volunteer skills, locations, availability, and reliability data.

The FastAPI backend loads these CSV files with Pandas, updates request rows during workflow actions, and writes the updated data back to disk. This keeps the hackathon demo lightweight while still showing real persistence across page reloads and API calls.

## Screenshots

Add final demo screenshots here before submission:

### Landing Page

![Landing Page](docs/screenshots/landing-page.png)

### Citizen Request Form

![Citizen Request Form](docs/screenshots/citizen-request.png)

### NGO Dashboard

![NGO Dashboard](docs/screenshots/ngo-dashboard.png)

### Volunteer Dashboard

![Volunteer Dashboard](docs/screenshots/volunteer-dashboard.png)

## How To Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd SahyogX
```

### 2. Set up the backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the URL printed by Vite, usually:

```text
http://localhost:5173
```

### 4. Try the demo workflow

1. Open the Citizen page and submit a request.
2. Open the NGO dashboard and watch the request appear automatically.
3. Move it to review or assign it.
4. Open the Volunteer dashboard and accept the assigned task.
5. Mark the task complete.
6. Return to NGO dashboard and close the completed request.

## API Highlights

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/requests` | Fetch all requests |
| `POST` | `/request` | Create a new citizen request |
| `POST` | `/review/{request_id}` | Move request to Under Review |
| `POST` | `/assign/{request_id}` | Assign request to volunteer |
| `GET` | `/volunteer/tasks` | Fetch assigned/accepted volunteer tasks |
| `POST` | `/volunteer/accept/{request_id}` | Volunteer accepts task |
| `POST` | `/volunteer/complete/{request_id}` | Volunteer completes task |
| `POST` | `/close/{request_id}` | NGO closes completed request |

## Future Scope

- Replace CSV storage with PostgreSQL or Supabase.
- Add authentication and role-based access control.
- Add real volunteer matching by distance, skills, availability, and reliability.
- Add geolocation and map-based routing.
- Add notifications via SMS, WhatsApp, or email.
- Add audit logs and request timelines.
- Add image uploads and document verification.
- Add offline-first support for disaster zones with weak connectivity.

## Project Vision

SahyogX aims to make grassroots relief coordination faster, clearer, and more accountable by connecting citizens, NGOs, and volunteers in one live operational workflow.
