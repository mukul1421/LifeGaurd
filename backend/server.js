require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const medicalWalletRoutes = require("./routes/medicalWalletRoutes");
const quickCheckRoutes = require("./routes/quickCheckRoutes");
const aiCheckRoutes = require("./routes/aiCheck"); // ⭐ AI ROUTE

app.use("/api/users", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/medical-wallet", medicalWalletRoutes);
app.use("/api/quick-check", quickCheckRoutes);
app.use("/api", aiCheckRoutes); // ⭐ /api/ai-check endpoint

/* ================= MONGODB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("☁️ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Lifeguard Backend Running Successfully");
});

/* ================= SERVER PORT ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
