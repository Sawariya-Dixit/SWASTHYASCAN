
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

- **[Your Name]** — Backend: API design, AI integration, database models,
  PDF/report generation, AWS Lambda deployment and configuration
- **[Friend's Name]** — Frontend: UI/UX, all React pages and components,
  voice input, AWS Amplify deployment

## Hackathon Notes

- Built end-to-end over 4 days as our first hands-on deployment on AWS
  Lambda, API Gateway, and Amplify
- Demo video (max 3 minutes) shows the full screening flow, the urgent
  red-flag path, and where AWS (Lambda, API Gateway, Amplify) fits in