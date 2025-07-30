const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  answers: [
    {
      testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
      selectedOption: { type: Number, required: true }
    }
  ],
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

submissionSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
