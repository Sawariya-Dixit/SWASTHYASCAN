// seedFacilities.js
// Run this ONCE from your SERVER folder to load facilities into MongoDB.
// Uses your existing config/database.js connection, so it behaves exactly
// like your index.js when connecting.
//
// Usage:
//   node seedFacilities.js
//
// After it prints "Seeding complete", you can delete this file,
// models/Facility.js is fine to keep (or delete if you don't need it elsewhere),
// and utills/Facilitiesdata.js can be deleted too.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/database");     // same connection your index.js uses
const Facility = require("./models/Facility");
const facilitiesData = require("./utills/Facilitiesdata");

async function seed() {
  try {
    await connectDB(); // waits for the connection, same as your server does

    console.log("Connected to MongoDB.");

    const deleted = await Facility.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing facility records.`);

    const inserted = await Facility.insertMany(facilitiesData);
    console.log(`Seeding complete. Inserted ${inserted.length} facilities.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();