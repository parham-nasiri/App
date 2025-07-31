const mongoose = require('mongoose');

const userQuizProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    isSeen: { type: Boolean, default: false },
    firstAnswer: { type: Boolean, default: false },
    isCorrect: { type: Boolean, default: false }
  }]
});

userQuizProgressSchema.index({ userId: 1 }, { unique: true });

const UserQuizProgress = mongoose.model("UserQuizProgress", userQuizProgressSchema);
module.exports = UserQuizProgress;
