const router = require("express").Router();
const auth = require("../middleware/auth");
const Question = require("../models/Question");

// GET MCQ QUESTIONS
router.get("/", auth, async (req, res) => {
  const questions = await Question.find().select("-correctIndex");
  
  // group by subject
  const grouped = { javascript: [], database: [] };
  questions.forEach(q => {
    grouped[q.subject].push({
      id: q._id,
      q: q.question,
      opts: q.options
    });
  });

  res.json(grouped);
});

module.exports = router;
