# SwasthyaScan

AI-powered preliminary health risk screener for underserved communities.
Built for **First Commit — Bharat Builds Tour 2026**.

## Problem

Millions of people, especially in rural and semi-urban India, cannot reach a
doctor in time — due to distance, cost, or lack of awareness. SwasthyaScan
lets anyone (or an ASHA worker / family member on their behalf) enter
symptoms and basic vitals, and instantly get an AI-generated risk level with
clear, simple next-step guidance — in Hindi or English.

## Project Structure

SwasthyaScan/
├── CLIENT/ → React (Vite) frontend (form, result dashboard, history)
└── server/ → Node.js + Express backend (API, Groq AI, MongoDB)


Each folder has its own setup details specific to it. This file covers the
project as a whole.

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React (Vite) + Tailwind CSS |
| Backend   | Node.js + Express (serverless via `serverless-http`) |
| Database  | MongoDB (Atlas) |
| AI Engine | Groq (`openai/gpt-oss-120b`) |
| Hosting   | AWS Amplify (frontend) + AWS Lambda + API Gateway (backend) |

## Core Features

- Symptom + vitals input form — type, voice, or checklist, in Hindi or English
- AI-powered risk assessment (Low / Medium / High) via Groq
- **Red-flag safety layer** — emergency symptoms (chest pain, severe
  breathlessness) trigger an instant urgent-care warning and locate the
  nearest hospital, bypassing the AI entirely, since safety-critical
  decisions shouldn't depend on unpredictable model output
- **"Why this risk?"** — the AI explains which specific factors led to the
  result, instead of just showing a label
- **ASHA / Family Mode** — screen for yourself or for someone else
- Screening history with search, risk filters, and a risk-trend graph — no
  login required, uses an anonymous device ID stored in the browser
- Downloadable bilingual PDF report per screening (Hindi text rendered with
  a bundled Devanagari font) and one-click CSV export of full history
- Nearest government hospital / PHC locator using live geolocation
- Hindi / English toggle throughout

## How the Two Folders Talk to Each Other
CLIENT (React, on AWS Amplify)
│
│ HTTP requests (Axios)
▼
server (Express, on AWS Lambda + API Gateway)
│
├──► Groq API (AI risk assessment)
└──► MongoDB Atlas (stores screening records)


The client never calls Groq or MongoDB directly — everything goes through
the server's API endpoints (`/api/v1/screening`, `/api/v1/history`,
`/api/v1/facilities`, `/api/v1/:id/summary`).

## Running the Project Locally

**1. Start the backend:**
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI + GROQ_API_KEY
npm run dev
```
Runs on `http://localhost:5000`

**2. Start the frontend:**
```bash
cd CLIENT
npm install
npm run dev
```
Set `VITE_API_BASE` in `.env` to your backend URL (local or deployed).

## Deployment

- **Frontend** → AWS Amplify Hosting, connected to this GitHub repo —
  auto-deploys the `CLIENT` folder on every push to `main`
- **Backend** → AWS Lambda (via `server/lambda.js` + `serverless-http`),
  exposed through Amazon API Gateway (HTTP API)
- **Database** → MongoDB Atlas (free tier)
- **AI** → Groq API (`openai/gpt-oss-120b`)

## Team

- **Sawariya Dixit** — Backend: API design, AI integration, database models,
  PDF/report generation, AWS Lambda deployment and configuration
- **Amisha Jat** — Frontend: UI/UX, all React pages and components,
  voice input, AWS Amplify deployment

## Hackathon Notes

- Built end-to-end over 4 days as our first hands-on deployment on AWS
  Lambda, API Gateway, and Amplify
- Demo video (max 3 minutes) shows the full screening flow, the urgent
  red-flag path, and where AWS (Lambda, API Gateway, Amplify) fits in