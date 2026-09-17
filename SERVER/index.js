require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const connectDB = require("./config/database");
 const screeningRoutes = require("./routes/screening");


app.use(cors()); // allow frontend (different origin) to call this API
app.use(express.json());

connectDB();

// Health check — useful to verify the deployed backend is alive
app.get("/", (req, res) => {
  res.json({ status: "SwasthyaScan backend is running" });
});

app.use("/api/v1", screeningRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
} )