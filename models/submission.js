const submissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: Number,
      isCorrect: Boolean
    }
  ],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

submissionSchema.index({ quizId: 1, userId: 1 }, { unique: true }); 
const Submission = mongoose.model("Submission", submissionSchema);
