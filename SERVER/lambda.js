// OPTIONAL FILE — only needed if deploying this Express app to AWS Lambda
// via API Gateway. If you deploy on EC2 / Render instead, ignore this file
// and just run `server.js` directly.
//
// Install first: npm install serverless-http
//
// In AWS Lambda console, set the handler to: lambda.handler

require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const screeningRoutes = require("./routes/screening");
const facilitiesRoutes = require("./routes/Facilitiesroute");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "SwasthyaScan backend is running (Lambda)" });
});

app.use("/api/v1", screeningRoutes);
app.use("/api/v1/facilities", facilitiesRoutes);

let isConnected = false;

async function ensureDbConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  // Reuse the DB connection across warm Lambda invocations
  context.callbackWaitsForEmptyEventLoop = false;
  await ensureDbConnected();
  return serverlessHandler(event, context);
};