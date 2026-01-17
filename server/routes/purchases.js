const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const Asset = require("../models/Asset");

router.post("/", async (req, res) => {
  try {
    const { name, category, base, quantity } = req.body;

    const total = quantity * 1000;

    const purchase = await Purchase.create({
      base,
      equipment: name,
      quantity,
      total
    });

    let asset = await Asset.findOne({ name: name, base: base });

    if (asset) {
      asset.quantity += Number(quantity);
      await asset.save();
    } else {
      await Asset.create({
        name,
        category: category || "Weapon",
        base,
        quantity
      });
    }

    res.json(purchase);
  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({ msg: "Error saving purchase and updating inventory" });
  }
});

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find({});
    const purchases = await Purchase.find({});

    console.log(`Found ${assets.length} assets in DB.`);

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
