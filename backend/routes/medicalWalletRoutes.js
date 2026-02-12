const express = require("express");
const router = express.Router();
const MedicalWallet = require("../models/MedicalWallet");
const auth = require("../middleware/auth");

router.use(auth);

//
// ✅ CREATE WALLET RECORD (PRIVATE)
//
router.post("/", async (req, res) => {
  try {
    const doc = new MedicalWallet({
      owner: req.user._id,   // ⭐ link to logged user
      ...req.body,
    });

    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ✅ GET CURRENT USER WALLET ONLY
//
router.get("/", async (req, res) => {
  try {
    const records = await MedicalWallet.find({
      owner: req.user._id,  // ⭐ user filter
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ✅ DELETE ONLY USER OWN RECORD
//
router.delete("/:id", async (req, res) => {
  try {
    await MedicalWallet.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
