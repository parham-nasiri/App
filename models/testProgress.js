const mongoose = require('mongoose');

const testProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    isSeen: { type: Boolean, default: false },
    firstAnswer: { type: Boolean, default: false },
    isCorrect: { type: Boolean, default: false }
  }]
});
testProgressSchema.index({ userId: 1 }, { unique: true });

const TestProgress = mongoose.model("TestProgress", testProgressSchema);
module.exports = TestProgress;