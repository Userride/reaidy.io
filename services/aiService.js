const OpenAI = require("openai");

/* ===============================
   RULE BASED ROADMAP
================================ */
const ruleBasedRoadmap = (skills) => {
  let r = [];

  if (skills.js === "beginner") r.push("JS Basics", "Functions", "DOM");
  else if (skills.js === "intermediate") r.push("Async JS", "React Hooks");
  else r.push("Advanced React", "State Management");

  if (skills.db === "beginner") r.push("MongoDB Intro", "CRUD");
  else r.push("Indexing", "Aggregation");

  return r;
};

/* ===============================
   OPENAI ROADMAP
================================ */
const openAIRoadmap = async (skills) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an expert mentor.

User skills:
JavaScript: ${skills.js}
Database: ${skills.db}

Return ONLY a JSON array of topics.
Example:
["Async JS","Node.js","Indexing"]
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  try {
    return JSON.parse(response.choices[0].message.content.trim());
  } catch {
    return ruleBasedRoadmap(skills);
  }
};

/* ===============================
   AI STUDY SUGGESTION (NEW)
================================ */
const generateStudySuggestion = (skills) => {
  const map = {
    beginner: [
      "JavaScript fundamentals",
      "Variables, loops, functions",
      "Basic MongoDB CRUD"
    ],
    intermediate: [
      "Async JavaScript & Promises",
      "API handling",
      "MongoDB indexing"
    ],
    advanced: [
      "JS performance optimization",
      "Event loop & memory",
      "Aggregation pipelines"
    ]
  };

  return {
    js: { level: skills.js, suggestions: map[skills.js] },
    db: { level: skills.db, suggestions: map[skills.db] }
  };
};

exports.generateRoadmap = async (skills) => {
  try {
    return await openAIRoadmap(skills);
  } catch {
    return ruleBasedRoadmap(skills);
  }
};

exports.generateStudySuggestion = generateStudySuggestion;
