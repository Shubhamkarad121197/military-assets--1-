const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  res.json({ token: "dummy-token-success" });
});

module.exports = router;
