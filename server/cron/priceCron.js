const cron = require("node-cron");
const axios = require("axios");
const History = require("../models/History");
const mongoose = require("mongoose");
require("dotenv").config();

const fetchDataAndSave = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1
      }
    });

    const formattedData = response.data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price_change_24h,
      marketCap: coin.market_cap,
      change24h: coin.market_cap_change_24h,
      timestamp: new Date()
    }));

    await History.insertMany(formattedData);
    console.log("History data saved");
  } catch (err) {
    console.error(" Cron error:", err.message);
  }
};
// cron.schedule("*/5 * * * *", async () => {
//   try {
//     const res = await axios.post("http://localhost:5000/api/history");
//     console.log(" POST /api/history hit →", res.data.message);
//   } catch (err) {
//     console.error(" Cron failed to hit /api/history:", err.message);
//   }
// });


// Run every 1 hour
cron.schedule("*/5 * * * *", fetchDataAndSave);
