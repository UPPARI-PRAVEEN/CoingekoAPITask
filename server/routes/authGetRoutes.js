const express = require("express");
const authGetCoin = require('../authController/authGetCoins');

// Create router object
const router = express.Router();


router.get("/coins", authGetCoin.getCoinsData); 
router.post("/history", authGetCoin.saveCurrentSnapshot);
router.get("/history/:coinId", authGetCoin.getHistory);

// Export router
module.exports = router;
