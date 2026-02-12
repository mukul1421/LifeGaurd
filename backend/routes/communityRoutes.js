const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");
const auth = require("../middleware/auth");

//
// ✅ CREATE POST (logged user only)
//
router.post("/add", auth, async (req, res) => {
  try {
    const { postText } = req.body;

    const newPost = new CommunityPost({
      userId: req.user._id,     // ⭐ from auth
      username: req.user.name,  // ⭐ real user name
      postText,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post added successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ✅ GET ALL POSTS (public)
//
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
