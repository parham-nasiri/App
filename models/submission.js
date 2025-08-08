const mongoose = require("mongoose");
const { finished } = require("winston-transport");
const submissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  teacherQuiz: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

submissionSchema.index({ quizId: 1, userId: 1 }, { unique: true }); 
const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;