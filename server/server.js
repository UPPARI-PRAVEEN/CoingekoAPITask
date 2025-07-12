require("dotenv").config(); // 👈 Load env variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const coinRoutes = require("./routes/authGetRoutes");
require("./cron/priceCron");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", coinRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
  });
