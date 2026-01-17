const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const Purchase = require("../models/Purchase");

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find({});
    const purchases = await Purchase.find({});

    res.json({
      assets: assets,
      purchases: purchases,
      transfers: []
    });
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
