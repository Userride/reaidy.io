const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());

app.use(
  cors({
    origin: "*", // ✅ frontend abhi deploy nahi hai
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ===============================
   ROOT ROUTE (IMPORTANT FOR RENDER)
================================ */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Learning Roadmap Backend is running",
    health: "/api/health",
    auth: "/api/auth",
    assessment: "/api/assessment",
    questions: "/api/questions"
  });
});

/* ===============================
   HEALTH CHECK
================================ */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    demo: "demo@learning.com / password123",
    timestamp: new Date()
  });
});

/* ===============================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ===============================
   SEED DEMO USER (SAFE)
================================ */
async function seedDemoUser() {
  try {
    const existingUser = await User.findOne({
      email: "demo@learning.com"
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash("password123", 10);

      await User.create({
        name: "Demo User",
        email: "demo@learning.com",
        password: passwordHash,
        skills: { js: "beginner", db: "beginner" },
        roadmap: [],
        completedTopics: []
      });

      console.log(
        "🌱 Demo user created → demo@learning.com / password123"
      );
    } else {
      console.log("ℹ️ Demo user already exists");
    }
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
}

seedDemoUser();

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/assessment", require("./routes/assessment"));
app.use("/api/questions", require("./routes/questions"));

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
