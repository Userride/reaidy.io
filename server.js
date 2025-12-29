const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
require("dotenv").config();

const User = require("./models/User");

const app = express();

/* ===============================
   SECURITY & MIDDLEWARE
================================ */

// Security headers
app.use(helmet());

// JSON body parsing
app.use(express.json());

// 🔥 CORS OPEN (Frontend abhi deploy nahi hai)
app.use(cors());

/* ===============================
   MONGODB CONNECTION
================================ */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err =>
    console.error("❌ MongoDB Error:", err.message)
  );

/* ===============================
   DEMO USER SEED (DEV ONLY)
================================ */

async function seedDemoUser() {
  try {
    const existingUser = await User.findOne({
      email: "demo@learning.com"
    });

    if (!existingUser) {
      console.log("🌱 Creating demo user...");

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
        "✅ Demo user created! Email: demo@learning.com | Password: password123"
      );
    } else {
      console.log("ℹ️ Demo user already exists");
    }
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
}

// Seed only in development
if (process.env.NODE_ENV !== "production") {
  seedDemoUser();
}

/* ===============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/assessment", require("./routes/assessment"));
app.use("/api/questions", require("./routes/questions"));

/* ===============================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    demo: "demo@learning.com / password123"
  });
});

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
