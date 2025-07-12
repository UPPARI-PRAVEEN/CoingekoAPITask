const axios = require("axios");
const cron = require("node-cron");
const Coin = require("../models/Coin");
const History = require("../models/History");


let cachedData = null;
let lastFetched = 0;

const fetchCoinData = async () => {
  const now = Date.now();
  if (cachedData && now - lastFetched < 60000) {
    console.log("Returning cached data");
    return cachedData;
  }

  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1
      }
    });

    cachedData = response.data;
    lastFetched = now;
    console.log("Fetched fresh data");
    return cachedData;

  } catch (error) {
    console.error("CoinGecko API Error:", error.response?.status, error.message);
    return null;
  }
};

saveCurrentSnapshot = async (req, res) => {
  try {
    console.log("Saving snapshot...");
    const data = await fetchCoinData(); 
    console.log("Data fetched:", data.length);

    await Coin.deleteMany({});
    console.log("Old data cleared");

    const formattedData = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price_change_24h,
      marketCap: coin.market_cap,
      change24h: coin.market_cap_change_24h,
      timestamp: new Date()
    }));

    await Coin.insertMany(formattedData);
    await History.insertMany(formattedData);

    console.log("Snapshot saved");

    res.json({ message: "Snapshot saved successfully" });
  } catch (err) {
    console.error("Save snapshot error:", err);
    res.status(500).json({ error: "Failed to save snapshot" });
  }
};


getHistory = async (req, res) => {
  const { coinId } = req.params;
  try {
    const data = await History.find({ coinId }).sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};



// cron.schedule("*/1 * * * *", fetchCoinData);
// cron.schedule("*/5 * * * * *", fetchCoinData); // every 5 seconds


const getCoinsData = async (req, res) => {
  const result = await fetchCoinData();

  if (result) {
    res.json(result);
  } else {
    res.status(503).json({ message: "Coin data not available. Try again later." });
  }
};


module.exports = {getCoinsData,saveCurrentSnapshot,getHistory}
