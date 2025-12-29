const r = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Question = require("../models/Question");
const { generateRoadmap, generateStudySuggestion } = require("../services/aiService");

/* ===============================
   SKILL → ROADMAP
================================ */
r.post("/submit", auth, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills) return res.status(400).json({ msg: "Skills required" });

    const roadmapTopics = await generateRoadmap(skills);

    const roadmapWithIds = roadmapTopics.map((topic, index) => ({
      id: `t${index + 1}`,
      name: topic,
      level: skills.js,
      resources: [
        `https://learn-${topic.toLowerCase().replace(/\s+/g, "-")}.com`
      ],
      prerequisites: []
    }));

    const edges = roadmapWithIds.slice(0, -1).map((_, i) => ({
      from: roadmapWithIds[i].id,
      to: roadmapWithIds[i + 1].id
    }));

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        skills,
        roadmap: roadmapWithIds,
        roadmapEdges: edges,
        completedTopics: []
      },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (e) {
    res.status(500).json({ msg: "Roadmap generation failed" });
  }
});

/* ===============================
   MCQ SUBMIT + AI SUGGESTION
================================ */
r.post("/mcq-submit", auth, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ msg: "Answers required" });

    const questions = await Question.find();
    let score = { javascript: 0, database: 0 };

    questions.forEach(q => {
      const userAnswer = answers[q.subject]?.find(
        a => a.id === q._id.toString()
      );
      if (userAnswer && userAnswer.selected === q.correctIndex) {
        score[q.subject]++;
      }
    });

    const jsLevel =
      score.javascript <= 1 ? "beginner" :
      score.javascript === 2 ? "intermediate" : "advanced";

    const dbLevel =
      score.database <= 1 ? "beginner" :
      score.database === 2 ? "intermediate" : "advanced";

    const studyPlan = generateStudySuggestion({
      js: jsLevel,
      db: dbLevel
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        skills: { js: jsLevel, db: dbLevel },
        $push: {
          assessments: {
            subject: "MCQ Test",
            score,
            topicBreakdown: { jsLevel, dbLevel }
          }
        }
      },
      { new: true }
    ).select("-password");

    res.json({
      user,
      score,
      skills: { js: jsLevel, db: dbLevel },
      studyPlan
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "MCQ submission failed" });
  }
});

/* ===============================
   COMPLETE TOPIC
================================ */
r.post("/complete", auth, async (req, res) => {
  const { topicId } = req.body;
  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { completedTopics: topicId }
  });
  res.json({ success: true });
});

module.exports = r;
