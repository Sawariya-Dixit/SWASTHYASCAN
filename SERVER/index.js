require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const screeningRoutes = require("./routes/screening");

const app = express();

app.use(cors()); // allow frontend (different origin) to call this API
app.use(express.json());

// Health check — useful to verify the deployed backend is alive
app.get("/", (req, res) => {
  res.json({ status: "SwasthyaScan backend is running" });
});

app.use("/api", screeningRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
