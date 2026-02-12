const express = require("express");
const router = express.Router();
const QuickCheck = require("../models/QuickCheck");
const auth = require("../middleware/auth");

router.use(auth);

/* ===== CREATE ===== */
router.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "User ID missing" });
    }

    const check = new QuickCheck({
      userId,
      symptoms: req.body.symptoms,
      result: req.body.result,
    });

    const saved = await check.save();

    res.json(saved);
  } catch (err) {
    console.error("QUICKCHECK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



/* ===== GET CURRENT USER ===== */
router.get("/", async (req, res) => {
  try {
    const checks = await QuickCheck.find({
      owner: req.user._id,
    });

    res.json(checks);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ===== DELETE CURRENT USER ===== */
router.delete("/", async (req, res) => {
  try {
    await QuickCheck.deleteMany({
      owner: req.user._id,
    });

    res.json({ message: "Cleared" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
