require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const screeningRoutes = require("./routes/screening");
const facilitiesRoutes = require("./routes/Facilitiesroute");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "SwasthyaScan backend is running" });
});

app.use("/api/v1", screeningRoutes);
app.use("/api/v1/facilities", facilitiesRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
