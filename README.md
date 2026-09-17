
# SwasthyaScan

AI-powered preliminary health risk screener for underserved communities.
Built for **First Commit — Bharat Builds Tour 2026**.

## Problem

Millions of people, especially in rural and semi-urban India, cannot reach a
doctor in time — due to distance, cost, or lack of awareness. SwasthyaScan
lets anyone (or an ASHA worker / family member on their behalf) enter
symptoms and basic vitals, and instantly get an AI-generated risk level with
clear, simple next-step guidance.

## Project Structure

```
SwasthyaScan/
├── client/     → React frontend (form, result dashboard, history)
└── server/     → Node.js + Express backend (API, Bedrock AI, MongoDB)
```

Each folder has its own `README.md` with setup details specific to it.
This file covers the project as a whole.

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React |
| Backend   | Node.js + Express |
| Database  | MongoDB (Atlas) |
| AI Engine | Amazon Bedrock |
| Hosting   | AWS Amplify (frontend) + Lambda/API Gateway or EC2 (backend) |

## Core Features

- Symptom + vitals input form
- AI-powered risk assessment (Low / Medium / High) via Amazon Bedrock
- **Red-flag safety layer** — emergency symptoms (chest pain, severe
  breathlessness) trigger an instant urgent-care warning, bypassing the AI
  entirely, since safety-critical decisions shouldn't depend on unpredictable
  model output
- **"Why this risk?"** — the AI explains which specific factors led to the
  result, instead of just showing a label
- **ASHA / Family Mode** — screen for yourself or for someone else
- History of past screenings (no login required — uses an anonymous
  device ID stored in the browser)
- Hindi / English toggle

## How the Two Folders Talk to Each Other

```
client (React, on Amplify)
   │
   │  HTTP requests (Axios/Fetch)
   ▼
server (Express, on Lambda/EC2)
   │
   ├──► Amazon Bedrock   (AI risk assessment)
   └──► MongoDB Atlas    (stores screening records)
```

The client never calls Bedrock or MongoDB directly — everything goes
through the server's API endpoints. See `server/README.md` for the exact
API contract (request/response shapes) the frontend should use.

## Running the Project Locally

**1. Start the backend:**
```bash
cd server
npm install
cp .env.example .env   # fill in MongoDB URI + AWS credentials
npm run dev
```
Runs on `http://localhost:5000`

**2. Start the frontend:**
```bash
cd client
npm install
npm start
```
Point the frontend's API base URL to `http://localhost:5000/api` during
local development.

## Deployment Plan

- **Frontend** → AWS Amplify Hosting (connect this GitHub repo, auto-deploys
  the `client` folder on push)
- **Backend** → AWS Lambda + API Gateway (using `server/lambda.js`), or a
  simple EC2/Render instance if Lambda setup takes too long
- **Database** → MongoDB Atlas free tier
- **AI** → Amazon Bedrock (Claude 3 Haiku model)

## Team

Solo build — frontend and backend split for parallel development during
the hackathon.

## Hackathon Notes

- AI tools used during development should be listed in the final writeup
- Demo video (max 3 minutes) must clearly show AWS being used — Bedrock and
  Amplify both need to be visible/explained, not just named in text