const router = require("express").Router();
const Assignment = require("../models/Assignment");
const Log = require("../models/Log");

router.post("/", async (req, res) => {
  const data = await Assignment.create(req.body);

  await Log.create({
    action: "ASSIGNMENT",
    ...req.body,
    user: req.user?.email || "system"
  });

  res.json(data);
});

module.exports = router;
