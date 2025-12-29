const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,

      skills: {
        js: { type: String, default: "beginner" },
        db: { type: String, default: "beginner" }
      },

      //  FIXED ASSESSMENTS STRUCTURE
      assessments: [
        {
          subject: String,
          score: {
            javascript: Number,
            database: Number
          },
          topicBreakdown: {
            jsLevel: String,
            dbLevel: String
          },
          date: { type: Date, default: Date.now }
        }
      ],

      roadmap: [
        {
          id: String,
          name: String,
          level: String,
          resources: [String],
          prerequisites: [String]
        }
      ],

      roadmapEdges: [{ from: String, to: String }],
      completedTopics: [String]
    },
    { timestamps: true }
  )
);
