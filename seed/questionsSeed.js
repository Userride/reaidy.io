const mongoose = require("mongoose");
const Question = require("../models/Question");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const questions = [
  // JavaScript
  {
    subject: "javascript",
    question: "What does async/await replace?",
    options: ["Callbacks", "Promises", "Both"],
    correctIndex: 2
  },
  {
    subject: "javascript",
    question: "Which method iterates arrays?",
    options: ["forEach", "map", "filter"],
    correctIndex: 0
  },
  {
    subject: "javascript",
    question: "What is `this` in arrow functions?",
    options: ["Window", "Parent scope", "Undefined"],
    correctIndex: 1
  },

  // Database
  {
    subject: "database",
    question: "MongoDB stores data as?",
    options: ["Tables", "JSON", "XML"],
    correctIndex: 1
  },
  {
    subject: "database",
    question: "What is an index?",
    options: ["Data sorting", "Query speed up", "Backup"],
    correctIndex: 1
  },
  {
    subject: "database",
    question: "Mongoose is for?",
    options: ["React", "MongoDB", "Express"],
    correctIndex: 1
  }
];

async function seed() {
  await Question.deleteMany();
  await Question.insertMany(questions);
  console.log("✅ MCQ Questions seeded");
  process.exit();
}

seed();
