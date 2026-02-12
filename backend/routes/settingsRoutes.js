const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");
const auth = require("../middleware/auth");

router.use(auth);

// SAVE SETTINGS (per user)
router.post("/save", async (req, res) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          ...req.body,
          userId: req.user._id,
        },
      },
      { upsert: true, new: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

// GET SETTINGS (only logged user)
router.get("/", async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      userId: req.user._id,
    });

    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

module.exports = router;
