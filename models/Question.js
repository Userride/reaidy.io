const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ["javascript", "database"],
    required: true
  },
  question: String,
  options: [String],
  correctIndex: Number
});

module.exports = mongoose.model("Question", QuestionSchema);
