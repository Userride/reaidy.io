// server/routes/roadmap.js
const r = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

r.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json({
    roadmap: user.roadmap,
    roadmapEdges: user.roadmapEdges,
    completedTopics: user.completedTopics,
    assessments: user.assessments
  });
});

r.post("/export-pdf", auth, async (req, res) => {
  // PDF export logic (Puppeteer/jsPDF)
  res.json({ message: "PDF generated", downloadUrl: "/api/pdf/roadmap.pdf" });
});

module.exports = r;
