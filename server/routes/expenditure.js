const router = require("express").Router();
const Expenditure = require("../models/Expenditure");
const Log = require("../models/Log");

router.post("/", async (req, res) => {
  const data = await Expenditure.create(req.body);

  await Log.create({
    action: "EXPENDITURE",
    ...req.body,
    user: req.user?.email || "system"
  });

  res.json(data);
});

module.exports = router;
